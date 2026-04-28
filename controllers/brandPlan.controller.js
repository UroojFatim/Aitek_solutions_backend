// controllers/brandPlan.controller.js
import sequelize from "../config/database.config.js";
import { ApiResponse } from "../utils/response.util.js";
import User from "../models/user.model.js";
import Business from "../models/business.model.js";

import BrandRoadmap from "../models/BrandEstablishment/brandRoadmap.model.js";
import BrandRoadmapPhase from "../models/BrandEstablishment/brandRoadmapPhase.model.js";
import BrandRoadmapWeek from "../models/BrandEstablishment/brandRoadmapWeek.model.js";
import BrandRoadmapTask from  "../models/BrandEstablishment/brandRoadmapTask.model.js";

import BrandPlan from "../models/BrandEstablishment/brandPlan.model.js";
import BrandPlanWeek from "../models/BrandEstablishment/brandPlanWeek.model.js";
import BrandPlanTask from "../models/BrandEstablishment/brandPlanTask.model.js";
import BrandTaskNote from "../models/BrandEstablishment/brandTaskNote.model.js";

import { sendEmail } from "../services/email.service.js";
import { sendBulkNotification } from "../utils/notification.util.js";
import { notifyAdminsTaskCompleted } from "../utils/adminNotification.util.js";

const DAYS = (n) => n * 24 * 60 * 60 * 1000;

const initChecklistState = (checklist_items) => {
    if (!Array.isArray(checklist_items) || checklist_items.length === 0) return [];
    return checklist_items.map((it) => ({
        key: it.key ?? null,
        label: it.label ?? "",
        checked: false,
        checked_at: null,
    }));
};

const createWeekFromTemplate = async ({ t, plan, weekNumber, enabledReason }) => {
    // 1) roadmap week
    const roadmapWeek = await BrandRoadmapWeek.findOne({
        where: { roadmap_id: plan.roadmap_id, week_number: weekNumber },
        transaction: t,
    });

    if (!roadmapWeek) {
        return { created: false, reason: "NO_TEMPLATE_WEEK", week: null, tasks: [] };
    }

    // prevent duplicate week creation
    const existing = await BrandPlanWeek.findOne({
        where: { plan_id: plan.id, week_number: weekNumber },
        transaction: t,
    });
    if (existing) {
        return { created: false, reason: "ALREADY_EXISTS", week: existing, tasks: [] };
    }

    // 2) create plan week
    const newPlanWeek = await BrandPlanWeek.create(
        {
            plan_id: plan.id,
            week_id: roadmapWeek.id,
            week_number: roadmapWeek.week_number,
            status: "active",
            enabled_at: new Date(),
            auto_unlock_after_days: 7,
      enabled_reason: enabledReason || "manual_admin",
        },
        { transaction: t }
    );

    // 3) copy roadmap tasks → plan tasks
    const roadmapTasks = await BrandRoadmapTask.findAll({
        where: { week_id: roadmapWeek.id },
        order: [["sort_order", "ASC"]],
        transaction: t,
    });

    const payload = roadmapTasks.map((rt) => ({
        plan_week_id: newPlanWeek.id,
        task_id: rt.id,
        title: rt.title,
        description: rt.description,
        status: "pending",

        // NEW (plan task fields)
        reflection_answer: null,
        checklist_state: initChecklistState(rt.checklist_items),
    }));

    const createdTasks = payload.length
        ? await BrandPlanTask.bulkCreate(payload, { transaction: t, returning: true })
        : [];

    return { created: true, reason: "CREATED", week: newPlanWeek, tasks: createdTasks };
};

// POST /api/brand-plans/ensure
// body: { business_id, service_id }
export const ensureBrandPlanProgress = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { business_id, service_id } = req.body;
        const userId = req.user?.id || null;

        if (!business_id || !service_id) {
            await t.rollback();
            return ApiResponse.badRequest(res, "business_id and service_id are required.");
        }

        // 1) Find existing plan (latest) for this business + service
        let plan = await BrandPlan.findOne({
            where: { business_id, service_id },
            order: [["created_at", "DESC"]],
            transaction: t,
        });

        let planCreated = false;

        // 2) If no plan → create plan
        if (!plan) {
            // pick roadmap (adjust selection if you later map roadmap by service)
            const roadmap = await BrandRoadmap.findOne({
                order: [["created_at", "DESC"]],
                transaction: t,
            });

            if (!roadmap) {
                await t.rollback();
                return ApiResponse.badRequest(res, "No roadmap template found.");
            }

            plan = await BrandPlan.create(
                {
                    business_id,
                    service_id,
                    roadmap_id: roadmap.id,
                    start_date: new Date(), // DATEONLY ok, Sequelize will cast
                    status: "active",
                    created_by: userId, // better: require auth
                },
                { transaction: t }
            );

            planCreated = true;
        }

        // 3) Load weeks for this plan
        const weeks = await BrandPlanWeek.findAll({
            where: { plan_id: plan.id },
            order: [["week_number", "ASC"]],
            transaction: t,
        });

        // 3a) If no weeks → create Week 1
        if (!weeks.length) {
            const r = await createWeekFromTemplate({ t, plan, weekNumber: 1, enabledReason: "manual_admin",  });
            await t.commit();

            return ApiResponse.ok(res, "Plan ensured (week 1 created).", {
                planCreated,
                ensuredWeek: 1,
                weekCreated: r.created,
                reason: r.reason,
                plan,
                week: r.week,
                tasks: r.tasks,
            });
        }

        // 4) Determine latest week
        const lastWeek = weeks[weeks.length - 1];

        // 4a) Check all tasks completed for last week
        const lastWeekTasks = await BrandPlanTask.findAll({
            where: { plan_week_id: lastWeek.id },
            transaction: t,
        });

        const allCompleted =
            lastWeekTasks.length > 0 && lastWeekTasks.every((x) => x.status === "completed");

        // 4b) Check 7 days passed since enabled_at (fallback to plan.start_date)
        const start = lastWeek.enabled_at || plan.start_date;
        const sevenDaysPassed = start ? Date.now() - new Date(start).getTime() >= DAYS(7) : false;

        // 4c) If BOTH true → create next week
        if (allCompleted && sevenDaysPassed) {
            // mark last week completed if not already
            if (lastWeek.status !== "completed") {
                lastWeek.status = "completed";
                lastWeek.completed_at = new Date();
                await lastWeek.save({ transaction: t });
            }

            const nextWeekNumber = lastWeek.week_number + 1;
            const r = await createWeekFromTemplate({ t, plan, weekNumber: nextWeekNumber, enabledReason: "auto_time", });

            await t.commit();
            return ApiResponse.ok(res, "Progress ensured (next week evaluated).", {
                planCreated,
                ensuredWeek: nextWeekNumber,
                weekCreated: r.created,
                reason: r.reason,
                checks: { allCompleted, sevenDaysPassed },
                plan,
                week: r.week,
                tasks: r.tasks,
            });
        }

        // 5) Otherwise nothing to create
        await t.commit();
        return ApiResponse.ok(res, "No new week created.", {
            planCreated,
            ensuredWeek: lastWeek.week_number,
            weekCreated: false,
            reason: "LOCK_CONDITIONS_NOT_MET",
            checks: { allCompleted, sevenDaysPassed },
            plan,
        });
    } catch (err) {
        console.error("ensureBrandPlanProgress error:", err);
        await t.rollback();
        return ApiResponse.serverError(res, "Failed to ensure plan progress.", err);
    }
};

// done
// GET /api/brand-plans/:businessId
export const getBrandPlanForBusiness = async (req, res) => {
    try {
        const { businessId } = req.params;

        if (!businessId) {
            return ApiResponse.badRequest(res, "businessId is required.");
        }

        // 1) Get latest plan for this business (NO auto-create)
        const plan = await BrandPlan.findOne({
            where: { business_id: businessId },
            order: [["created_at", "DESC"]],
        });

        if (!plan) {
            // No plan – return empty payload so frontend can show a message
            return ApiResponse.ok(res, "No brand plan exists for this business.", {
                plan: null,
                phases: [],
            });
        }

        // 2) Load roadmap phases (template structure)
        const phases = await BrandRoadmapPhase.findAll({
            where: { roadmap_id: plan.roadmap_id },
            order: [["phase_order", "ASC"]],
        });

        // 3) Load this plan's weeks + tasks
        //    Include roadmap week using the correct alias: "week"
        const planWeeks = await BrandPlanWeek.findAll({
            where: { plan_id: plan.id },
            include: [
                {
                    model: BrandPlanTask,
                    as: "tasks",
                    include: [
                        {
                            model: BrandRoadmapTask,
                            as: "task", 
                        },
                    ],
                },
                {
                    model: BrandRoadmapWeek,
                    as: "week", // <-- IMPORTANT: matches your association
                    attributes: ["id", "phase_id", "week_number"],
                },
            ],
            order: [["week_number", "ASC"]],
        });

        // 4) Group plan weeks by phase_id (from associated roadmap week)
        const weeksByPhaseId = new Map();

        for (const pw of planWeeks) {
            const phaseId = pw.week?.phase_id;
            if (!phaseId) continue;

            if (!weeksByPhaseId.has(phaseId)) {
                weeksByPhaseId.set(phaseId, []);
            }
            weeksByPhaseId.get(phaseId).push(pw);
        }

        // util: map DB status to UI status
        const mapStatusToUI = (status) => {
            if (status === "pending") return "Not Started";
            if (status === "in_progress") return "In Progress";
            if (status === "completed") return "Completed";
            return "Not Started";
        };

        // 5) Shape phases → weeks → tasks for frontend
        const phasesForUI = phases.map((phase) => {
            const weeksForPhase = (weeksByPhaseId.get(phase.id) || []).sort(
                (a, b) => (a.week_number || 0) - (b.week_number || 0)
            );

            const weeks = weeksForPhase.map((pw) => {
                const weekTasks = (pw.tasks || [])
                    // if you later add sort_order to brand_plan_tasks, sort by it
                    .sort((a, b) => {
                        const sa = a.task?.sort_order ?? 0;
                        const sb = b.task?.sort_order ?? 0;
                        return sa - sb;
                    })
                    .map((pt) => ({
                        id: pt.id,
                        order: pt.task?.sort_order ?? 0,
                        title: pt.title,
                        status: mapStatusToUI(pt.status),

                        rawStatus: pt.status,
                        completed_by: pt.completed_by,
                        completed_at: pt.completed_at,

                        // ✅ from roadmap task template
                        client: pt.task?.client_responsibilities || null,
                        vibe: pt.task?.client_instructions || null,
                        reflectionQ: pt.task?.reflective_question || null,
                        checklist: pt.task?.checklist_items || [],
                        woa: pt.task?.woa_responsibilities || null,

                        // ✅ from plan task instance fields
                        reflection_answer: pt.reflection_answer || "",
                        checklist_state: pt.checklist_state || [],
                    }));
                return {
                    id: pw.id,
                    week_number: pw.week_number,
                    week_status: pw.status,
                    week_enabled_at: pw.enabled_at,
                    auto_unlock_after_days: pw.auto_unlock_after_days,
                    tasks: weekTasks,
                };
            });

            return {
                id: phase.id,
                title: phase.name,
                theme: phase.theme,
                weeks,
            };
        });

        return ApiResponse.ok(res, "Brand plan fetched successfully.", {
            plan,
            phases: phasesForUI,
        });
    } catch (err) {
        console.error("getBrandPlanForBusiness error:", err);
        return ApiResponse.serverError(
            res,
            "Failed to fetch brand plan.",
            err
        );
    }
};

//done
export const updateTaskStatus = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user?.id || null;

        const allowedUiStatuses = ["Not Started", "In Progress", "Completed"];
        const allowedDbStatuses = ["pending", "in_progress", "completed"];

        if (![...allowedUiStatuses, ...allowedDbStatuses].includes(status)) {
            await t.rollback();
            return ApiResponse.badRequest(res, "Invalid status.");
        }

        const task = await BrandPlanTask.findByPk(id, {
            include: [
                {
                    model: BrandPlanWeek,
                    as: "plan_week",
                },
                {
                    // 🔹 join the template task using your association
                    model: BrandRoadmapTask,
                    as: "task",
                },
            ],
            transaction: t,
        });

        if (!task) {
            await t.rollback();
            return ApiResponse.notFound(res, "Plan task not found.");
        }

        // Normalize UI status => DB status
        const normalizedStatus =
            status === "Not Started"
                ? "pending"
                : status === "In Progress"
                    ? "in_progress"
                    : status === "Completed"
                        ? "completed"
                        : status; // already db value

        task.status = normalizedStatus;

        if (normalizedStatus === "completed") {
            task.completed_by = userId;
            task.completed_at = new Date();
        } else {
            // if user moves it back from completed
            task.completed_by = null;
            task.completed_at = null;
        }

        await task.save({ transaction: t });

        // ---- Week completion logic ---- //
        const weekId = task.plan_week_id;
        const planWeek = task.plan_week;

        const allTasks = await BrandPlanTask.findAll({
            where: { plan_week_id: weekId },
            transaction: t,
        });

        const allCompleted = allTasks.every((t) => t.status === "completed");

        if (allCompleted && planWeek.status !== "completed") {
            planWeek.status = "completed";
            planWeek.completed_at = new Date();
            await planWeek.save({ transaction: t });

            // Unlock next week by week_number
            const nextWeek = await BrandPlanWeek.findOne({
                where: {
                    plan_id: planWeek.plan_id,
                    week_number: planWeek.week_number + 1,
                },
                transaction: t,
            });

            if (nextWeek && nextWeek.status === "locked") {
                nextWeek.status = "active";
                nextWeek.enabled_at = new Date();
                nextWeek.enabled_reason = "tasks_completed";
                await nextWeek.save({ transaction: t });
            }
        }

        await t.commit();

        const mapStatusToUI = (s) => {
            if (s === "pending") return "Not Started";
            if (s === "in_progress") return "In Progress";
            if (s === "completed") return "Completed";
            return "Not Started";
        };

        // 🔹 include roadmap task info + sort_order in the response
        const responseTask = {
            id: task.id,
            status: mapStatusToUI(task.status), // for your UI dropdown
            rawStatus: task.status,             // db value if needed
            completed_by: task.completed_by,
            completed_at: task.completed_at,
            plan_week_id: task.plan_week_id,

            roadmap_task: task.task
                ? {
                    id: task.task.id,
                    title: task.task.title,
                    description: task.task.description,
                    sort_order: task.task.sort_order,
                }
                : null,
        };

        return ApiResponse.ok(res, "Task status updated.", responseTask);
    } catch (err) {
        await t.rollback();
        console.error(err);
        return ApiResponse.serverError(
            res,
            "Failed to update task status.",
            err
        );
    }
};

// POST /api/brand-plan-tasks/:id/notes
export const addTaskNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const authId = req.user?.id;
    const authRole = req.user?.role;

    if (!authId || !authRole) {
      return ApiResponse.badRequest(res, "Unauthorized (missing auth user).");
    }

    const planTask = await BrandPlanTask.findByPk(id);
    if (!planTask) return ApiResponse.notFound(res, "Plan task not found.");

    if (!content || !content.trim()) {
      return ApiResponse.badRequest(res, "Note content is required.");
    }

    const created = await BrandTaskNote.create({
      plan_task_id: planTask.id,
      author_id: authId,
      author_type: authRole,
      content: content.trim(),
      is_internal: false,
    });

    // ✅ refetch with user names
    const note = await BrandTaskNote.findByPk(created.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "full_name", "email"] },
        { model: User, as: "editor", attributes: ["id", "full_name", "email"] },
      ],
    });

    return ApiResponse.created(res, "Note added.", note);
  } catch (err) {
    console.error(err);
    return ApiResponse.serverError(res, "Failed to add note.", err);
  }
};

// PATCH /api/brand-plan-tasks/notes/:noteId
export const updateTaskNote = async (req, res) => {
  try {
    const { id } = req.params; // noteId
    const { content } = req.body;

    const authId = req.user?.id || null;
    if (!authId) return ApiResponse.badRequest(res, "Unauthorized.");

    if (!content || !content.trim())
      return ApiResponse.badRequest(res, "Note content is required.");

    const noteRow = await BrandTaskNote.findByPk(id);
    if (!noteRow) return ApiResponse.notFound(res, "Note not found.");

    noteRow.content = content.trim();
    noteRow.edited_by = authId;
    noteRow.edited_at = new Date();
    await noteRow.save();

    const note = await BrandTaskNote.findByPk(noteRow.id, {
      include: [
        { model: User, as: "author", attributes: ["id", "full_name", "email"] },
        { model: User, as: "editor", attributes: ["id", "full_name", "email"] },
      ],
    });

    return ApiResponse.ok(res, "Note updated.", note);
  } catch (err) {
    console.error(err);
    return ApiResponse.serverError(res, "Failed to update note.", err);
  }
};

// GET /api/brand-plan-tasks/:id/notes
export const getTaskNotes = async (req, res) => {
  try {
    const { id } = req.params;

    const planTask = await BrandPlanTask.findByPk(id);
    if (!planTask) return ApiResponse.notFound(res, "Plan task not found.");

    const notes = await BrandTaskNote.findAll({
      where: { plan_task_id: id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "full_name", "email"], // name show karwana hai
        },
        {
          model: User,
          as: "editor",
          attributes: ["id", "full_name", "email"],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    return ApiResponse.ok(res, "Notes fetched.", notes);
  } catch (err) {
    console.error(err);
    return ApiResponse.serverError(res, "Failed to fetch notes.", err);
  }
};


export const updatePlanTask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { reflection_answer, checklist_state } = req.body;

    const task = await BrandPlanTask.findByPk(id, { transaction: t });
    if (!task) {
      await t.rollback();
      return ApiResponse.notFound(res, "Plan task not found.");
    }

    if (reflection_answer !== undefined) {
      task.reflection_answer = String(reflection_answer);
    }

    if (checklist_state !== undefined) {
      if (!Array.isArray(checklist_state)) {
        await t.rollback();
        return ApiResponse.badRequest(res, "checklist_state must be an array.");
      }

      const template = Array.isArray(task.checklist) ? task.checklist : [];

      const normalized = checklist_state.map((item, idx) => ({
        key: item?.key ?? String(idx),
        label: item?.label && String(item.label).trim()
          ? String(item.label).trim()
          : String(template[idx] ?? ""), // ✅ fill from template
        checked: !!item?.checked,
        checked_at: item?.checked ? (item.checked_at || new Date().toISOString()) : null,
      }));

      task.checklist_state = normalized;
    }

    await task.save({ transaction: t });
    await t.commit();

    return ApiResponse.ok(res, "Task updated.", task);
  } catch (err) {
    await t.rollback();
    console.error(err);
    return ApiResponse.serverError(res, "Failed to update task.", err);
  }
};

// Mark task as completed by user - sends email and notifications to admins
export const markTaskAsCompleted = async (req, res) => {
  try {
    const { taskId, taskTitle, userId, userName, businessName } = req.body;

    // Validate required fields
    if (!taskId || !userId) {
      return ApiResponse.badRequest(res, "taskId and userId are required");
    }

    // Notify admins about task completion
    try {
      await notifyAdminsTaskCompleted(businessName, taskTitle, userName, taskId);
    } catch (notifyError) {
      console.error("Error notifying admins:", notifyError);
      // Continue even if notification fails
    }

    return ApiResponse.ok(
      res,
      "Task marked as completed. Admins have been notified.",
      {
        taskId,
        timestamp: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error marking task as completed:", error);
    return ApiResponse.serverError(
      res,
      "Failed to mark task as completed",
      error
    );
  }
};


