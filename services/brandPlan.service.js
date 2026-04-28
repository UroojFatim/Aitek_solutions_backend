// services/brandPlan.service.js
import { Op } from "sequelize";
import BrandPlanWeek from "../models/BrandEstablishment/brandPlanWeek.model.js";
import BrandPlanTask from "../models/BrandEstablishment/brandPlanTask.model.js";

export const autoUnlockWeeksForPlan = async (planId) => {
  const weeks = await BrandPlanWeek.findAll({
    where: { plan_id: planId },
    order: [["week_number", "ASC"]],
  });

  const now = new Date();

  for (let i = 1; i < weeks.length; i++) {
    const current = weeks[i];
    if (current.status !== "locked") continue;

    const prev = weeks[i - 1];
    if (!prev.enabled_at) continue;

    const autoDays = current.auto_unlock_after_days || 7;
    const unlockDate = new Date(prev.enabled_at);
    unlockDate.setDate(unlockDate.getDate() + autoDays);

    if (now >= unlockDate) {
      current.status = "active";
      current.enabled_at = current.enabled_at || now;
      current.enabled_reason = "auto_time";
      await current.save();
    }
  }
};
