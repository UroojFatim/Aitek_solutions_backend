import OnboardingSections from "../models/onboardingSections.model.js";
import BusinessDetails from "../models/businessDetails.model.js";
import DoctorsDetails from "../models/doctorsDetails.model.js";
import TeamDetails from "../models/teamDetails.model.js";
import CultureDetails from "../models/cultureDetails.model.js";
import MarketAnalysis from "../models/marketAnalysis.model.js";
import PricingDetails from "../models/pricingDetails.model.js";
import MarketPerception from "../models/marketPerception.model.js";
import Business from '../models/business.model.js';
import BusinessOnboarding from '../models/businessOnboarding.model.js';
import OnboardingStep from '../models/onboardingSteps.model.js';
import { OnboardingStatus } from '../enums/onboardingStatus.enum.js';
import { ApiResponse } from '../utils/response.util.js';

export const getSectionProgress = async (req, res) => {
    try {
        const { stepId } = req.params;
        const business_id = req.business?.id;

        if (!business_id) {
            return res.status(400).json({
                success: false,
                message: "Business ID not found",
            });
        }

        // Get all sections for this step
        const sections = await OnboardingSections.findAll({
            where: {
                step_id: stepId,
            },
            order: [["section_order", "ASC"]],
        });

        if (!sections || sections.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sections found for this step",
            });
        }

        // Check data existence in each referenced table
        const sectionProgress = await Promise.all(
            sections.map(async (section) => {
                let hasData = false;

                switch (section.section_name) {
                    case "business_details":
                        const businessData = await BusinessDetails.findOne({
                            where: { business_id },
                        });
                        hasData = !!businessData;
                        break;

                    case "doctors_details":
                        const doctorData = await DoctorsDetails.findOne({
                            where: { business_id },
                        });
                        hasData = !!doctorData;
                        break;

                    case "team_details":
                        const teamData = await TeamDetails.findOne({
                            where: { business_id },
                        });
                        hasData = !!teamData;
                        break;

                    case "culture_details":
                        const cultureData = await CultureDetails.findOne({
                            where: { business_id },
                        });
                        hasData = !!cultureData;
                        break;

                    case "market_analysis":
                        const marketAnalysisData = await MarketAnalysis.findOne({
                            where: { business_id },
                        });
                        // Check if at least one required field is filled
                        hasData = !!marketAnalysisData;
                        break;

                    case "pricing_details":
                        const pricingData = await PricingDetails.findOne({
                            where: { business_id },
                        });
                        // Check if at least one required field is filled
                        hasData = !!pricingData;
                        break;

                    case "market_perception":
                        const perceptionData = await MarketPerception.findOne({
                            where: { business_id },
                        });
                        // Check if at least one required field is filled
                        hasData = !!perceptionData;
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

        // Sort sections by order to ensure sequential checking
        const orderedSections = sectionProgress.sort(
            (a, b) => a.section_order - b.section_order
        );

        // Initialize step number to 1
        let stepNumber = 1;
        let previousSectionsCompleted = true;

        // Check sections in order
        for (let i = 0; i < orderedSections.length; i++) {
            const currentSection = orderedSections[i];

            // If we find an incomplete section, break the loop
            if (!currentSection.is_completed) {
                previousSectionsCompleted = false;
                break;
            }

            // If all previous sections are completed and current section is completed
            if (previousSectionsCompleted && currentSection.is_completed) {
                stepNumber = i + 2; // Add 2 because we start from step 1 and i starts from 0
            }
        }

        // If all sections are completed, add 1 to the final step
        const allCompleted = orderedSections.every(
            (section) => section.is_completed
        );
        if (allCompleted) {
            stepNumber += 1;
        }

        return res.status(200).json({
            success: true,
            data: {
                step_number: stepNumber,
                sections: orderedSections,
                total_sections: orderedSections.length,
                completed_sections: orderedSections.filter((s) => s.is_completed)
                    .length,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getBusinessOnboardingOverview = async (req, res) => {
  try {
    const totalSteps = await OnboardingStep.count();

    if (totalSteps === 0) {
      return res.status(200).json({ message: 'No onboarding steps defined.', data: [] });
    }

    const businesses = await Business.findAll({
      attributes: ['id', 'name', 'status'], 
      include: [
        {
          model: BusinessOnboarding,
          as: 'businessOnboarding',
          attributes: ['status'],
        }
      ],
      order: [['name', 'ASC']]
    });

    const overview = businesses.map((business) => {
      const completedSteps = business.businessOnboarding.filter(
        step => step.status === OnboardingStatus.COMPLETED
      ).length;

      return {
        name: business.name,
        status: business.status, 
        stepsCompleted: `${completedSteps} / ${totalSteps}`
      };
    });

     return ApiResponse.ok(res, 'Business onboarding overview fetched successfully.', overview);
  } catch (error) {
    return ApiResponse.serverError(res, 'Failed to fetch business onboarding overview.', error);
  }
};