// controllers/onboardingSteps.controller.js
import OnboardingSteps from "../models/onboardingSteps.model.js";
import OnboardingSections from "../models/onboardingSections.model.js";
import OnboardingQuestions from "../models/onboardingQuestions.model.js";
import { ValidationError, UniqueConstraintError } from "sequelize";

// Add these imports at the top of your controller file
import BusinessDetails from "../models/businessDetails.model.js";
import DoctorsDetails from "../models/doctorsDetails.model.js";
import CultureDetails from "../models/cultureDetails.model.js";
import TeamDetails from "../models/teamDetails.model.js";
import EmployeeDetails from "../models/employeeDetails.model.js";
import PricingDetails from "../models/pricingDetails.model.js";
import MarketPerception from "../models/marketPerception.model.js";
import MarketAnalysis from "../models/marketAnalysis.model.js";
import CompetitorDetails from "../models/competitorDetails.model.js";

import BusinessOnboarding from "../models/businessOnboarding.model.js";

import Business from "../models/business.model.js";
import User from "../models/user.model.js";

import { ApiResponse } from "../utils/response.util.js";
import { UserRole } from "../enums/index.js";
import { getAdminNotificationEmail } from "../helpers/emailTemplates.js";
import { sendEmail } from "../services/email.service.js";
import { sendNotification, sendBulkNotification } from "../utils/notification.util.js";
import { notifyAdminsStepCompleted } from "../utils/adminNotification.util.js";

// Get all onboarding steps (ordered by step_order)
export const getAllOnboardingSteps = async (req, res) => {
  try {
    const steps = await OnboardingSteps.findAll({
      attributes: [
        "id",
        "step_name",
        "step_title",
        "step_subtitle",
        "step_description",
        "step_order",
      ],
      order: [["step_order", "ASC"]],
    });

    return ApiResponse.ok(
      res,
      "Onboarding steps retrieved successfully",
      steps
    );
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Get onboarding step details with sections and questions
export const getOnboardingStepDetails = async (req, res) => {
  const { stepId } = req.params;

  try {
    // Find the onboarding step with its sections and questions
    const stepDetails = await OnboardingSteps.findByPk(stepId, {
      include: [
        {
          model: OnboardingSections,
          as: "sections",
          where: { is_active: true },
          attributes: [
            "id",
            "section_name",
            "section_title",
            "section_description",
            "section_order",
          ],
          include: [
            {
              model: OnboardingQuestions,
              as: "questions",
              where: { is_active: true },
              attributes: [
                "id",
                "field_name",
                "label",
                "field_type",
                "placeholder",
                "is_required",
                "display_order",
                "options",
                "yup_validation",
              ],
            },
          ],
          order: [
            ["section_order", "ASC"],
            [
              { model: OnboardingQuestions, as: "questions" },
              "display_order",
              "ASC",
            ],
          ],
        },
      ],
    });

    if (!stepDetails) {
      return ApiResponse.notFound(res, "Onboarding step not found");
    }

    return ApiResponse.ok(
      res,
      "Onboarding step details retrieved successfully",
      stepDetails
    );
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// =============================================================================
// BUSINESS DETAILS
// =============================================================================
export const saveBusinessDetails = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await BusinessDetails.findOne({
      where: { business_id: businessId },
    });

    if (existingRecord) {
      return ApiResponse.badRequest(res, "Business details already exist");
    }

    const savedRecord = await BusinessDetails.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(
      res,
      "Business details saved successfully",
      savedRecord
    );
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save business details", err);
  }
};

// =============================================================================
// DOCTORS DETAILS
// =============================================================================
export const saveDoctorDetails = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const dataArray = Array.isArray(data) ? data : [data];
    const results = [];

    for (const doctorData of dataArray) {
      let existingRecord = null;

      if (doctorData.email_address) {
        existingRecord = await DoctorsDetails.findOne({
          where: {
            business_id: businessId,
            email_address: doctorData.email_address,
          },
        });
      }

      if (existingRecord) {
        return ApiResponse.badRequest(
          res,
          `Doctor with email ${doctorData.email_address} already exists`
        );
      }

      const savedRecord = await DoctorsDetails.create({
        ...doctorData,
        business_id: businessId,
      });

      results.push(savedRecord);
    }

    return ApiResponse.ok(
      res,
      "Doctor details saved successfully",
      Array.isArray(data) ? results : results[0]
    );
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save doctor details", err);
  }
};

// =============================================================================
// CULTURE DETAILS
// =============================================================================
export const saveCultureDetails = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await CultureDetails.findOne({
      where: { business_id: businessId },
    });

    if (existingRecord) {
      return ApiResponse.badRequest(res, "Culture details already exist");
    }

    const savedRecord = await CultureDetails.create({
      ...data,
      business_id: businessId,
    });

  
    try {
      await notifyAdminsStepCompleted(
        businessId,
        "Initial Intake",
        req.user?.full_name
      );
    } catch (notificationError) {
      console.error("Failed to notify admins about step completion:", notificationError);
   
    }

    return ApiResponse.ok(
      res,
      "Culture details saved successfully",
      savedRecord
    );
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save culture details", err);
  }
};
// =============================================================================
// TEAM DETAILS
// =============================================================================
export const saveTeamDetails = async (req, res) => {
  const businessId = req.business.id;
  const { team_members, ...teamData } = req.body;

  try {
    const existingTeamRecord = await TeamDetails.findOne({
      where: { business_id: businessId },
    });

    if (existingTeamRecord) {
      return ApiResponse.badRequest(res, "Team details already exist");
    }

    const savedTeamRecord = await TeamDetails.create({
      ...teamData,
      business_id: businessId,
    });

    let employeeResults = [];

    if (team_members && Array.isArray(team_members)) {
      for (const employeeData of team_members) {
        const savedEmployee = await EmployeeDetails.create({
          ...employeeData,
          team_details_id: savedTeamRecord.id,
        });

        employeeResults.push(savedEmployee);
      }
    }

    return ApiResponse.ok(res, "Team details saved successfully", {
      team: savedTeamRecord,
      employees: employeeResults,
    });
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save team details", err);
  }
};

// =============================================================================
// PRICING DETAILS
// =============================================================================
export const savePricingDetails = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await PricingDetails.findOne({
      where: { business_id: businessId },
    });

    if (existingRecord) {
      return ApiResponse.badRequest(res, "Pricing details already exist");
    }

    const savedRecord = await PricingDetails.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(
      res,
      "Pricing details saved successfully",
      savedRecord
    );
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save pricing details", err);
  }
};

// =============================================================================
// MARKET PERCEPTION
// =============================================================================
export const saveMarketPerception = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await MarketPerception.findOne({
      where: { business_id: businessId },
    });

    if (existingRecord) {
      return ApiResponse.badRequest(res, "Market perception already exists");
    }

    const savedRecord = await MarketPerception.create({
      ...data,
      business_id: businessId,
    });

    
    try {
      await notifyAdminsStepCompleted(
        businessId,
        "Positioning & Clarity",
        req.user?.full_name
      );
    } catch (notificationError) {
      console.error("Failed to notify admins about step completion:", notificationError);
      // Don't fail the entire request if notification fails
    }

    return ApiResponse.ok(
      res,
      "Market perception saved successfully",
      savedRecord
    );
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(
      res,
      "Failed to save market perception",
      err
    );
  }
};
// =============================================================================
// MARKET ANALYSIS
// =============================================================================
export const saveMarketAnalysis = async (req, res) => {
  const businessId = req.business.id;
  const { competitors, ...marketData } = req.body;

  try {
    const existingMarketRecord = await MarketAnalysis.findOne({
      where: { business_id: businessId },
    });

    if (existingMarketRecord) {
      return ApiResponse.badRequest(res, "Market analysis already exists");
    }

    const savedMarketRecord = await MarketAnalysis.create({
      ...marketData,
      business_id: businessId,
    });

    let competitorResults = [];

    if (competitors && Array.isArray(competitors)) {
      for (const competitorData of competitors) {
        const savedCompetitor = await CompetitorDetails.create({
          ...competitorData,
          market_analysis_id: savedMarketRecord.id,
        });

        competitorResults.push(savedCompetitor);
      }
    }

    return ApiResponse.ok(res, "Market analysis saved successfully", {
      market_analysis: savedMarketRecord,
      competitors: competitorResults,
    });
  } catch (err) {
    if (
      err instanceof ValidationError ||
      err instanceof UniqueConstraintError
    ) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save market analysis", err);
  }
};

// Get onboarding step information for a specific business
export const getOnboardingStepsOfBusiness = async (req, res) => {
  const { stepId, businessId } = req.params;

  try {
    // First, verify the business exists
    const business = await Business.findByPk(businessId);
    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    // Get the onboarding step with its sections and questions
    const stepDetails = await OnboardingSteps.findByPk(stepId, {
      attributes: [
        "id",
        "step_name",
        "step_title",
        "step_subtitle",
        "step_description",
        "step_order",
      ],
      include: [
        {
          model: OnboardingSections,
          as: "sections",
          where: { is_active: true },
          attributes: ["id", "section_name", "section_order"],
          include: [
            {
              model: OnboardingQuestions,
              as: "questions",
              where: { is_active: true },
              attributes: ["field_name", "label", "field_type", "options"],
              order: [["display_order", "ASC"]],
            },
          ],
          order: [["section_order", "ASC"]],
        },
      ],
    });

    if (!stepDetails) {
      return ApiResponse.notFound(res, "Onboarding step not found");
    }

    // Get section details with questions and answers
    const sectionsData = await Promise.all(
      stepDetails.sections.map(async (section) => {
        let sectionData = null;
        let additionalData = null;

        switch (section.section_name) {
          case "business_details":
            sectionData = await BusinessDetails.findOne({
              where: { business_id: businessId },
            });
            break;

          case "doctors_details":
            sectionData = await DoctorsDetails.findOne({
              where: { business_id: businessId },
            });
            break;

          case "team_details":
            sectionData = await TeamDetails.findOne({
              where: { business_id: businessId },
            });
            if (sectionData) {
              const employees = await EmployeeDetails.findAll({
                where: { team_details_id: sectionData.id, is_active: true },
                order: [["created_at", "ASC"]],
              });

              const teamMembersQuestion = section.questions.find(
                (q) => q.field_name === "team_members"
              );
              if (teamMembersQuestion && teamMembersQuestion.options) {
                additionalData = employees.map((employee) => ({
                  id: employee.id,
                  details: teamMembersQuestion.options.map((q) => ({
                    question: q.label,
                    answer: employee[q.field] || null,
                  })),
                }));
              } else {
                additionalData = employees;
              }
            }
            break;

          case "market_analysis":
            sectionData = await MarketAnalysis.findOne({
              where: { business_id: businessId },
            });
            if (sectionData) {
              const competitors = await CompetitorDetails.findAll({
                where: { market_analysis_id: sectionData.id, is_active: true },
                order: [["created_at", "ASC"]],
              });

              const competitorsQuestion = section.questions.find(
                (q) => q.field_name === "competitors"
              );
              if (competitorsQuestion && competitorsQuestion.options) {
                additionalData = competitors.map((competitor) => ({
                  id: competitor.id,
                  details: competitorsQuestion.options.map((q) => {
                    const fieldName =
                      q.field === "patient_types" ? "target_patients" : q.field;
                    return {
                      question: q.label,
                      answer: competitor[fieldName] || null,
                    };
                  }),
                }));
              } else {
                additionalData = competitors;
              }
            }
            break;

          case "culture_details":
            sectionData = await CultureDetails.findOne({
              where: { business_id: businessId },
            });
            break;

          case "pricing_details":
            sectionData = await PricingDetails.findOne({
              where: { business_id: businessId },
            });
            break;

          case "market_perception":
            sectionData = await MarketPerception.findOne({
              where: { business_id: businessId },
            });
            break;

          default:
            sectionData = null;
        }

        // Create an array of questions with their answers
        const questionsWithAnswers = section.questions.map((question) => ({
          question: question.label,
          field_name: question.field_name,
          field_type: question.field_type,
          options: question.options,
          answer: sectionData ? sectionData[question.field_name] : null,
        }));

        // Prepare the section response
        const sectionResponse = {
          id: section.id,
          section_name: section.section_name,
          section_order: section.section_order,
          questions: questionsWithAnswers,
        };

        // Add additional data if it exists
        if (additionalData) {
          if (section.section_name === "team_details") {
            sectionResponse.employees = additionalData;
          } else if (section.section_name === "market_analysis") {
            sectionResponse.competitors = additionalData;
          }
        }

        return sectionResponse;
      })
    );

    // Sort sections by section_order
    const sortedSectionsData = sectionsData.sort(
      (a, b) => a.section_order - b.section_order
    );

    const response = {
      step: {
        id: stepDetails.id,
        name: stepDetails.step_name,
        title: stepDetails.step_title,
        subtitle: stepDetails.step_subtitle,
        description: stepDetails.step_description,
        order: stepDetails.step_order,
      },
      sections: sortedSectionsData,
    };

    return ApiResponse.ok(
      res,
      "Onboarding step details retrieved successfully",
      response
    );
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Upsert onboarding section details for a specific business (admin)
export const updateOnboardingSectionOfBusiness = async (req, res) => {
  const { sectionName, businessId } = req.params;
  const payload = req.body || {};

  try {
    const business = await Business.findByPk(businessId);
    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    switch (sectionName) {
      case "business_details": {
        const [record, created] = await BusinessDetails.findOrCreate({
          where: { business_id: businessId },
          defaults: { ...payload, business_id: businessId },
        });

        if (!created) {
          await record.update(payload);
        }

        return ApiResponse.ok(res, "Business details saved successfully", record);
      }

      case "doctors_details": {
        const dataArray = Array.isArray(payload) ? payload : [payload];
        const results = [];

        for (const doctorData of dataArray) {
          if (!doctorData || Object.keys(doctorData).length === 0) continue;

          const [record, created] = await DoctorsDetails.findOrCreate({
            where: {
              business_id: businessId,
              email_address: doctorData.email_address,
            },
            defaults: { ...doctorData, business_id: businessId },
          });

          if (!created) {
            await record.update(doctorData);
          }

          results.push(record);
        }

        return ApiResponse.ok(res, "Doctor details saved successfully", results);
      }

      case "culture_details": {
        const [record, created] = await CultureDetails.findOrCreate({
          where: { business_id: businessId },
          defaults: { ...payload, business_id: businessId },
        });

        if (!created) {
          await record.update(payload);
        }

        return ApiResponse.ok(res, "Culture details saved successfully", record);
      }

      case "team_details": {
        const { team_members, ...teamData } = payload;

        const [teamRecord, created] = await TeamDetails.findOrCreate({
          where: { business_id: businessId },
          defaults: { ...teamData, business_id: businessId },
        });

        if (!created) {
          await teamRecord.update(teamData);
        }

        let employees = [];
        if (Array.isArray(team_members)) {
          await EmployeeDetails.destroy({ where: { team_details_id: teamRecord.id } });
          for (const employeeData of team_members) {
            const employee = await EmployeeDetails.create({
              ...employeeData,
              team_details_id: teamRecord.id,
            });
            employees.push(employee);
          }
        }

        return ApiResponse.ok(res, "Team details saved successfully", {
          team: teamRecord,
          employees,
        });
      }

      case "pricing_details": {
        const [record, created] = await PricingDetails.findOrCreate({
          where: { business_id: businessId },
          defaults: { ...payload, business_id: businessId },
        });

        if (!created) {
          await record.update(payload);
        }

        return ApiResponse.ok(res, "Pricing details saved successfully", record);
      }

      case "market_perception": {
        const [record, created] = await MarketPerception.findOrCreate({
          where: { business_id: businessId },
          defaults: { ...payload, business_id: businessId },
        });

        if (!created) {
          await record.update(payload);
        }

        return ApiResponse.ok(res, "Market perception saved successfully", record);
      }

      case "market_analysis": {
        const { competitors, ...marketData } = payload;

        const [marketRecord, created] = await MarketAnalysis.findOrCreate({
          where: { business_id: businessId },
          defaults: { ...marketData, business_id: businessId },
        });

        if (!created) {
          await marketRecord.update(marketData);
        }

        let competitorResults = [];
        if (Array.isArray(competitors)) {
          await CompetitorDetails.destroy({ where: { market_analysis_id: marketRecord.id } });
          for (const competitorData of competitors) {
            const competitor = await CompetitorDetails.create({
              ...competitorData,
              market_analysis_id: marketRecord.id,
            });
            competitorResults.push(competitor);
          }
        }

        return ApiResponse.ok(res, "Market analysis saved successfully", {
          market_analysis: marketRecord,
          competitors: competitorResults,
        });
      }

      default:
        return ApiResponse.badRequest(res, "Unsupported section name");
    }
  } catch (err) {
    return ApiResponse.serverError(
      res,
      "Failed to update onboarding section for business",
      err
    );
  }
};
