// controllers/srvcOnboardingSection.controller.js
import { ApiResponse } from "../utils/response.util.js";
import Service from "../models/service.model.js";
import SrvconbOardingQuestionsSection from "../models/srvconbOardingQuestionsSection.model.js";
import PracticeProfile from "../models/ServiceAnswers/SmileSupport/practiceProfile.model.js";
import ConsultTeam from "../models/ServiceAnswers/SmileSupport/consultTeam.model.js";
import ConsultSchedulingDetails from "../models/ServiceAnswers/SmileSupport/consultSchedulingDetails.model.js";
import CommunicationFollowUp from "../models/ServiceAnswers/SmileSupport/communicationFollowUp.model.js";
import AdditionalDetails from "../models/ServiceAnswers/SmileSupport/additionalDetails.model.js";
import BrandAwarenessHistory from "../models/ServiceAnswers/BrandEstablishment/brandAwarenessHistory.model.js";
import BrandPerceptionConfidence from "../models/ServiceAnswers/BrandEstablishment/brandPerceptionConfidence.model.js";
import MessagingDifferentiation from "../models/ServiceAnswers/BrandEstablishment/messagingDifferentiation.model.js";
import VisionAspirations from "../models/ServiceAnswers/BrandEstablishment/visionAspirations.model.js";
import FullArchImplantsFaqs from "../models/ServiceAnswers/SmileSupport/fullArchImplantsFaqs.model.js";
import AppointmentConsultationFaqs from "../models/ServiceAnswers/SmileSupport/appointmentConsultationFaqs.model.js";
import SingleImplantFaqs from "../models/ServiceAnswers/SmileSupport/singleImplantFaqs.model.js";

// POST: Create a service section
export const createServiceSection = async (req, res) => {
  try {
    const { service_id, section_name, section_title, section_description, section_order, is_active } = req.body;

    // Validate if service exists
    const service = await Service.findByPk(service_id);
    if (!service) {
      return ApiResponse.badRequest(res, "Service not found.");
    }

    // Create section
    const newSection = await SrvconbOardingQuestionsSection.create({
      service_id,
      section_name,
      section_title,
      section_description,
      section_order,
      is_active
    });

    return ApiResponse.ok(res, "Service section created successfully.", newSection);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to create Service section.", error);
  }
};

// GET: Get sections by service_id
export const getServiceSectionsByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Validate if service exists
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return ApiResponse.badRequest(res, "Service by Service Id not found.");
    }

    const sections = await SrvconbOardingQuestionsSection.findAll({
      where: { service_id: serviceId },
      order: [["section_order", "ASC"]]
    });

    return ApiResponse.ok(res, "service sections fetched successfully.", sections);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch service sections.", error);
  }
};

// ===============================
// GET Service PROGRESS
// ===============================
export const getServiceProgress = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const business_id = req.business?.id;

    if (!business_id) {
      return ApiResponse.badRequest(res, "Business ID not found");
    }

    // Fetch sections for this service
    const sections = await SrvconbOardingQuestionsSection.findAll({
      where: { service_id: serviceId },
      order: [["section_order", "ASC"]],
    });

    if (!sections || sections.length === 0) {
      return ApiResponse.notFound(res, "No sections found for this service");
    }

    // Check completion status for each section
    const sectionProgress = await Promise.all(
      sections.map(async (section) => {
        let hasData = false;

        switch (section.section_name) {
          case "practice_profile":
            const practiceProfile = await PracticeProfile.findOne({ where: { business_id } });
            hasData = !!practiceProfile;
            break;

          case "consult_scheduling_details":
            const consultScheduling = await ConsultSchedulingDetails.findOne({ where: { business_id } });
            hasData = !!consultScheduling;
            break;

          case "consult_team":
            const consultTeam = await ConsultTeam.findOne({ where: { business_id } });
            hasData = !!consultTeam;
            break;

          case "communication_followup":
            const commFollowUp = await CommunicationFollowUp.findOne({ where: { business_id } });
            hasData = !!commFollowUp;
            break;


          case "additional_details":
            const additionalDetails = await AdditionalDetails.findOne({ where: { business_id } });
            hasData = !!additionalDetails;
            break;

          case "full_arch_implants_faqs":
            const fullArchImplantFAQs = await FullArchImplantsFaqs.findOne({ where: { business_id } });
            hasData = !!fullArchImplantFAQs;
            break;

          case "appointment_consultation_faqs":
            const appointmentConsultationFAQs = await AppointmentConsultationFaqs.findOne({ where: { business_id } });
            hasData = !!appointmentConsultationFAQs;
            break;

          case "single_implant_faqs":
            const singleImplantFAQs = await SingleImplantFaqs.findOne({ where: { business_id } });
            hasData = !!singleImplantFAQs;
            break;

          case "brand_awareness_history":
            const brandAwarenessHistory = await BrandAwarenessHistory.findOne({ where: { business_id } });
            hasData = !!brandAwarenessHistory;
            break;

          case "brand_perception_confidence":
            const brandPerceptionConfidence = await BrandPerceptionConfidence.findOne({ where: { business_id } });
            hasData = !!brandPerceptionConfidence;
            break;

          case "messaging_differentiation":
            const messagingDifferentiation = await MessagingDifferentiation.findOne({ where: { business_id } });
            hasData = !!messagingDifferentiation;
            break;

          case "vision_aspirations":
            const visionAspirations = await VisionAspirations.findOne({ where: { business_id } });
            hasData = !!visionAspirations;
            break;

          case "final_thoughts":
            const finalThoughts = await VisionAspirations.findOne({ where: { business_id } });
            hasData = ! !(
              finalThoughts &&
              (finalThoughts.brand_dream_summary || finalThoughts.additional_notes)
            );
            break;

          default:
            hasData = false;
        }

        return {
          section_id: section.id,
          section_name: section.section_name,
          section_title: section.section_title,
          section_order: section.section_order,
          is_completed: hasData,
        };
      })
    );

    // Sort just in case
    const orderedSections = sectionProgress.sort((a, b) => a.section_order - b.section_order);
    // Calculate step number like your old function
    let stepNumber = 1;
    let previousSectionsCompleted = true;

    for (let i = 0; i < orderedSections.length; i++) {
      const currentSection = orderedSections[i];

      if (!currentSection.is_completed) {
        previousSectionsCompleted = false;
        break;
      }

      if (previousSectionsCompleted && currentSection.is_completed) {
        stepNumber = i + 2;
      }
    }

    const allCompleted = orderedSections.every((section) => section.is_completed);
    if (allCompleted) stepNumber += 1;

    return ApiResponse.ok(res, "Service Page progress retrieved successfully", {
      step_number: stepNumber,
      sections: orderedSections,
      total_sections: orderedSections.length,
      completed_sections: orderedSections.filter((s) => s.is_completed).length,
    });

  } catch (err) {
    return ApiResponse.serverError(res, "Failed to retrieve Service progress", err);
  }
};
