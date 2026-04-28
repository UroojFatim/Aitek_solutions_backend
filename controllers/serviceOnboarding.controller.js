import { ValidationError, UniqueConstraintError } from "sequelize";
import { ApiResponse } from "../utils/response.util.js";
import Service from "../models/service.model.js";
import SrvconbOardingQuestionsSection from "../models/srvconbOardingQuestionsSection.model.js";
import SrvcOnboardingQuestions from "../models/srvcOnboardingQuestions.model.js";
import PracticeProfile from "../models/ServiceAnswers/SmileSupport/practiceProfile.model.js";
import ConsultSchedulingDetails from "../models/ServiceAnswers/SmileSupport/consultSchedulingDetails.model.js";
import ConsultTeam from "../models/ServiceAnswers/SmileSupport/consultTeam.model.js";
import CommunicationFollowUp from "../models/ServiceAnswers/SmileSupport/communicationFollowUp.model.js";
import AdditionalDetails from "../models/ServiceAnswers/SmileSupport/additionalDetails.model.js";
import BrandAwarenessHistory from "../models/ServiceAnswers/BrandEstablishment/brandAwarenessHistory.model.js";
import BrandPerceptionConfidence from "../models/ServiceAnswers/BrandEstablishment/brandPerceptionConfidence.model.js";
import MessagingDifferentiation from "../models/ServiceAnswers/BrandEstablishment/messagingDifferentiation.model.js";
import VisionAspirations from "../models/ServiceAnswers/BrandEstablishment/visionAspirations.model.js";
import BusinessService from "../models/businessService.model.js";
import { BusinessServiceStatus } from "../enums/serviceStatus.enum.js";
import { notifyAdminsServiceCompleted } from "../utils/adminNotification.util.js";
import FullArchImplantsFaqs from "../models/ServiceAnswers/SmileSupport/fullArchImplantsFaqs.model.js";
import AppointmentConsultationFaqs from "../models/ServiceAnswers/SmileSupport/appointmentConsultationFaqs.model.js";
import SingleImplantFaqs from "../models/ServiceAnswers/SmileSupport/singleImplantFaqs.model.js";
import Business from "../models/business.model.js";

const SECTION_MODEL_MAP = {
  practice_profile: PracticeProfile,
  consult_scheduling_details: ConsultSchedulingDetails,
  consult_team: ConsultTeam,
  communication_followup: CommunicationFollowUp,
  additional_details: AdditionalDetails,
  full_arch_implants_faqs: FullArchImplantsFaqs,
  appointment_consultation_faqs: AppointmentConsultationFaqs,
  single_implant_faqs: SingleImplantFaqs,
  brand_awareness_history: BrandAwarenessHistory,
  brand_perception_confidence: BrandPerceptionConfidence,
  messaging_differentiation: MessagingDifferentiation,
  vision_aspirations: VisionAspirations,
  final_thoughts: VisionAspirations,
};

// Helper function to update service status to ONBOARDING
async function updateServiceStatusToOnboarding(businessId, serviceName) {
  try {
    // Find the service by name
    const service = await Service.findOne({
      where: { name: serviceName }
    });

    if (!service) {
      console.warn(`Service with name "${serviceName}" not found`);
      return;
    }

    // Update the business service status
    await BusinessService.update(
      { status: BusinessServiceStatus.ONBOARDING },
      {
        where: {
          business_id: businessId,
          service_id: service.id
        }
      }
    );

  } catch (error) {
    console.error(`Failed to update service status for ${serviceName}:`, error);
  }
}

// GET Service DETAILS WITH SECTIONS & QUESTIONS
export const getServiceDetails = async (req, res) => {
  const { serviceId } = req.params;

  try {
    const serviceDetails = await Service.findByPk(serviceId, {
      include: [
        {
          model: SrvconbOardingQuestionsSection,
          as: "sections",
          where: { is_active: true },
          attributes: [
            'id',
            'section_name',
            'section_title',
            'section_description',
            'section_order'
          ],
          include: [
            {
              model: SrvcOnboardingQuestions,
              as: "questions",
              where: { is_active: true },
              attributes: [
                'id',
                'field_name',
                'label',
                'field_type',
                'placeholder',
                'is_required',
                'display_order',
                'options',
                'yup_validation',
                'default_value'
              ],
            },
          ],
          order: [
            ["section_order", "ASC"],
            [{ model: SrvcOnboardingQuestions, as: "questions" }, "display_order", "ASC"],
          ],
        },
      ],
    });

    if (!serviceDetails) {
      return ApiResponse.notFound(res, "Service Details not found");
    }

    return ApiResponse.ok(res, "Service Page details retrieved successfully", serviceDetails);
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// ===============================
// SAVE SECTION DATA
// ===============================

// 24 / 7 SMILE SUPPORT SECTION

// PRACTICE PROFILE
export const savePracticeProfile = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await PracticeProfile.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Practice profile already exists");
    }

    const savedRecord = await PracticeProfile.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Practice profile saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save practice profile", err);
  }
};

// CONSULT SCHEDULING DETAILS
export const saveConsultSchedulingDetails = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await ConsultSchedulingDetails.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Consult scheduling details already exist");
    }

    const savedRecord = await ConsultSchedulingDetails.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Consult scheduling details saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save consult scheduling details", err);
  }
};

// CONSULT TEAM 
export const saveConsultTeam = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await ConsultTeam.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Consult team details already exist");
    }

    const savedRecord = await ConsultTeam.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Consult team details saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save consult team details", err);
  }
};

// COMMUNICATION & FOLLOW-UP
export const saveCommunicationFollowUp = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await CommunicationFollowUp.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Communication & follow-up details already exist");
    }

    const savedRecord = await CommunicationFollowUp.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Communication & follow-up saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save communication & follow-up details", err);
  }
};

// ADDITIONAL DETAILS
export const saveAdditionalDetails = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await AdditionalDetails.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Additional details already exist");
    }

    const savedRecord = await AdditionalDetails.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Additional details saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save additional details", err);
  }
};

// FULL ARCH IMPLANTS FAQS
export const saveFullArchImplantsFaqs = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await FullArchImplantsFaqs.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Full Arch Implants FAQs details already exist");
    }

    const savedRecord = await FullArchImplantsFaqs.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Full Arch Implants FAQs saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save full arch implants FAQs details", err);
  }
};

// APPOINTMENT & CONSULTATION FAQS
export const saveAppointmentConsultationFaqs = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await AppointmentConsultationFaqs.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Appointment and Consultation FAQs details already exist");
    }

    const savedRecord = await AppointmentConsultationFaqs.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Appointment and Consultation FAQs saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save appointment and consultation FAQs details", err);
  }
};

// Single Implant FAQs
export const saveSingleImplantFaqs = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await SingleImplantFaqs.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Single Implant FAQs already exist");
    }

    const savedRecord = await SingleImplantFaqs.create({
      ...data,
      business_id: businessId,
    });

    try {
      await notifyAdminsServiceCompleted(
        businessId,
        "24/7 Smile Support",
        req.user?.full_name
      );

      // Update service status to ONBOARDING
      await updateServiceStatusToOnboarding(businessId, "24/7 Smile Support");
    } catch (notificationError) {
      console.error("Failed to notify admins about service completion:", notificationError);
    }

    return ApiResponse.ok(res, "Single Implant FAQs saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save single implant FAQs", err);
  }
};



// BRAND ESTABLISHMENT SECTION

// Brand Awareness History
export const saveBrandAwarenessHistory = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await BrandAwarenessHistory.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Brand Awareness History already exist");
    }

    const savedRecord = await BrandAwarenessHistory.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Brand Awareness History saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save Brand Awareness History", err);
  }
};

// Brand Perception Confidence
export const saveBrandPerceptionConfidence = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await BrandPerceptionConfidence.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Brand Perception Confidence already exist");
    }

    const savedRecord = await BrandPerceptionConfidence.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Brand Perception Confidence saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save Brand Perception Confidence", err);
  }
};

// Messaging Differentiation
export const saveMessagingDifferentiation = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    const existingRecord = await MessagingDifferentiation.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Messaging Differentiation already exist");
    }

    const savedRecord = await MessagingDifferentiation.create({
      ...data,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Messaging Differentiation saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save Messaging Differentiation", err);
  }
};

// Vision Aspirations
export const saveVisionAspirations = async (req, res) => {
  const businessId = req.business.id;
  const {
    admired_gold_standard_brand,
    brand_face_preference,
    rebranding_excitement,
    visibility_fears,
    market_domination_impact,
  } = req.body;

  try {
    const existingRecord = await VisionAspirations.findOne({ where: { business_id: businessId } });
    if (existingRecord) {
      return ApiResponse.badRequest(res, "Vision Aspirations already exist");
    }

    const savedRecord = await VisionAspirations.create({
      admired_gold_standard_brand,
      brand_face_preference,
      rebranding_excitement,
      visibility_fears,
      market_domination_impact,
      business_id: businessId,
    });

    return ApiResponse.ok(res, "Vision Aspirations saved successfully", savedRecord);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save Vision Aspirations", err);
  }
};

// Final Thoughts
export const saveFinalThoughts = async (req, res) => {
  const businessId = req.business.id;
  const data = req.body;

  try {
    let existingRecord = await VisionAspirations.findOne({
      where: { business_id: businessId },
    });

    if (existingRecord) {
      // check if both fields are already filled
      if (existingRecord.brand_dream_summary && existingRecord.additional_notes) {
        return ApiResponse.badRequest(res, "Final Thoughts already exist");
      }

      // update only missing fields
      existingRecord = await existingRecord.update({
        brand_dream_summary:
          existingRecord.brand_dream_summary || data.brand_dream_summary,
        additional_notes:
          existingRecord.additional_notes || data.additional_notes,
      });

      try {
        await notifyAdminsServiceCompleted(
          businessId,
          "Brand Establishment",
          req.user?.full_name
        );

        // Update service status to ONBOARDING
        await updateServiceStatusToOnboarding(businessId, "Brand Establishment");
      } catch (notificationError) {
        console.error("Failed to notify admins about service completion:", notificationError);
      }

      return ApiResponse.ok(
        res,
        "Final Thoughts updated successfully",
        existingRecord
      );
    }

    // if record does not exist → create new
    const savedRecord = await VisionAspirations.create({
      ...data,
      business_id: businessId,
    });

    try {
      await notifyAdminsServiceCompleted(
        businessId,
        "Brand Establishment",
        req.user?.full_name
      );

      // Update service status to ONBOARDING
      await updateServiceStatusToOnboarding(businessId, "Brand Establishment");
    } catch (notificationError) {
      console.error("Failed to notify admins about service completion:", notificationError);
    }

    return ApiResponse.ok(
      res,
      "Final Thoughts saved successfully",
      savedRecord
    );
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to save Final Thoughts", err);
  }
};



// ===============================
// GET SERVICE PAGE DATA FOR BUSINESS
// ===============================
export const getServiceOnboardingForBusiness = async (req, res) => {
  const { serviceId, businessId } = req.params;
  try {
    const business = await Business.findByPk(businessId);
    if (!business) {
      return ApiResponse.notFound(res, "Business not found");
    }

    const serviceDetails = await Service.findByPk(serviceId, {
      include: [
        {
          model: SrvconbOardingQuestionsSection,
          as: "sections",
          where: { is_active: true },
          attributes: ["id", "section_name", "section_order"],
          include: [
            {
              model: SrvcOnboardingQuestions,
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

    if (!serviceDetails) {
      return ApiResponse.notFound(res, "Service not found");
    }

    const sectionsData = await Promise.all(
      serviceDetails.sections.map(async (section) => {
        let sectionData = null;

        switch (section.section_name) {
          case "practice_profile":
            sectionData = await PracticeProfile.findOne({ where: { business_id: businessId } });
            break;
          case "consult_scheduling_details":
            sectionData = await ConsultSchedulingDetails.findOne({ where: { business_id: businessId } });
            break;
          case "consult_team":
            sectionData = await ConsultTeam.findOne({ where: { business_id: businessId } });
            break;
          case "communication_followup":
            sectionData = await CommunicationFollowUp.findOne({ where: { business_id: businessId } });
            break;
          case "additional_details":
            sectionData = await AdditionalDetails.findOne({ where: { business_id: businessId } });
            break;
          case "full_arch_implants_faqs":
            sectionData = await FullArchImplantsFaqs.findOne({ where: { business_id: businessId } });
            break;
          case "appointment_consultation_faqs":
            sectionData = await AppointmentConsultationFaqs.findOne({ where: { business_id: businessId } });
            break;
          case "single_implant_faqs":
            sectionData = await SingleImplantFaqs.findOne({ where: { business_id: businessId } });
            break;
          
          case "brand_awareness_history":
            sectionData = await BrandAwarenessHistory.findOne({ where: { business_id: businessId } });
            break;
          case "brand_perception_confidence":
            sectionData = await BrandPerceptionConfidence.findOne({ where: { business_id: businessId } });
            break;
          case "messaging_differentiation":
            sectionData = await MessagingDifferentiation.findOne({ where: { business_id: businessId } });
            break;
          case "vision_aspirations":
            sectionData = await VisionAspirations.findOne({ where: { business_id: businessId } });
            break;
          case "final_thoughts":
            sectionData = await VisionAspirations.findOne({ where: { business_id: businessId } });
            break;
          default:
            sectionData = null;
        }

        return {
          id: section.id,
          section_name: section.section_name,
          section_order: section.section_order,
          questions: section.questions.map((q) => ({
            field_name: q.field_name,
            question: q.label,
            field_type: q.field_type,
            options: q.options,
            answer: sectionData ? sectionData[q.field_name] : null,
          })),
        };
      })
    );

    const sortedSections = sectionsData.sort((a, b) => a.section_order - b.section_order);

    return ApiResponse.ok(res, "Service data retrieved successfully", {
      service: {
        id: serviceDetails.id,
        name: serviceDetails.name,
        title: serviceDetails.description,
      },
      sections: sortedSections,
    });
  } catch (err) {
    return ApiResponse.serverError(res, "Server error", err);
  }
};

// Editing the sections answers method
export const updateSectionAnswers = async (req, res) => {
  const { businessId, sectionId } = req.params;
  const { answers } = req.body || {};

  if (!answers || typeof answers !== "object") {
    return ApiResponse.badRequest(res, "Body must include { answers: { ... } }");
  }

  try {
    // 1) Find the section to learn its canonical section_name
    const section = await SrvconbOardingQuestionsSection.findByPk(sectionId, {
      attributes: ["id", "section_name"],
    });

    if (!section) {
      return ApiResponse.notFound(res, `Section not found for id "${sectionId}"`);
    }

    const sectionName = section.section_name;
    const Model = SECTION_MODEL_MAP[sectionName];
    if (!Model) {
      return ApiResponse.badRequest(res, `Unsupported section "${sectionName}"`);
    }

    // 2) Upsert by business_id
    const [row, created] = await Model.findOrCreate({
      where: { business_id: businessId },
      defaults: { business_id: businessId, ...answers },
    });

    if (!created) {
      await row.update(answers);
    }

    return ApiResponse.ok(
      res,
      created ? "Section created successfully" : "Section updated successfully",
      row
    );
  } catch (err) {
    if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
      return ApiResponse.badRequest(res, "Validation error", err);
    }
    return ApiResponse.serverError(res, "Failed to upsert section answers", err);
  }
};
