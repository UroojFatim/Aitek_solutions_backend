// models/associations.js
import User from './user.model.js';
import Business from './business.model.js';
import BusinessDetails from './businessDetails.model.js';
import DoctorsDetails from './doctorsDetails.model.js';
import TeamDetails from './teamDetails.model.js';
import EmployeeDetails from './employeeDetails.model.js';
import CultureDetails from './cultureDetails.model.js';
import MarketAnalysis from './marketAnalysis.model.js';
import CompetitorDetails from './competitorDetails.model.js';
import PricingDetails from './pricingDetails.model.js';
import MarketPerception from './marketPerception.model.js';
import Service from './service.model.js';
import BusinessService from './businessService.model.js';
import UserBusiness from './userBusiness.model.js';
import OnboardingSteps from './onboardingSteps.model.js';
import BusinessOnboarding from './businessOnboarding.model.js';
import BusinessDocument from './businessDocument.model.js';
import OnboardingSections from './onboardingSections.model.js';
import OnboardingQuestions from './onboardingQuestions.model.js';
import GhlPipeline from "./ghlPipeline.model.js";
import BusinessPipeline from './businessPipeline.model.js';
import SrvconbOardingQuestionsSection from './srvconbOardingQuestionsSection.model.js';
import SrvcOnboardingQuestions from './srvcOnboardingQuestions.model.js';
import Notification from './notification.model.js';
import AuditLog from './auditLog.model.js';
import UserService from "./userService.model.js";
import BrandRoadmapPhase from './BrandEstablishment/brandRoadmapPhase.model.js';
import BrandRoadmap from './BrandEstablishment/brandRoadmap.model.js';
import BrandRoadmapWeek from './BrandEstablishment/brandRoadmapWeek.model.js';
import BrandRoadmapTask from './BrandEstablishment/brandRoadmapTask.model.js';
import BrandPlanWeek from './BrandEstablishment/brandPlanWeek.model.js';
import BrandPlan from './BrandEstablishment/brandPlan.model.js';
import BrandPlanTask from './BrandEstablishment/brandPlanTask.model.js';
import BrandTaskDocument from './BrandEstablishment/brandTaskDocument.model.js';
import BrandTaskNote from './BrandEstablishment/brandTaskNote.model.js';
import BusinessSheet from './businessSheet.model.js';

BrandTaskDocument.belongsTo(User, {
  foreignKey: "uploaded_by",
  as: "uploader",
});

BrandTaskNote.belongsTo(User, {
  as: "author",
  foreignKey: "author_id",
});

BrandTaskNote.belongsTo(User, {
  as: "editor",
  foreignKey: "edited_by",
});

BrandPlanTask.hasMany(BrandTaskNote, {
  foreignKey: "plan_task_id",
  as: "notes",
});
BrandTaskNote.belongsTo(BrandPlanTask, {
  foreignKey: "plan_task_id",
  as: "plan_task",
});

BrandPlanTask.hasMany(BrandTaskDocument, {
  foreignKey: "plan_task_id",
  as: "documents",
});
BrandTaskDocument.belongsTo(BrandPlanTask, {
  foreignKey: "plan_task_id",
  as: "plan_task",
});

BrandPlanWeek.hasMany(BrandPlanTask, {
  foreignKey: "plan_week_id",
  as: "tasks",
});
BrandPlanTask.belongsTo(BrandPlanWeek, {
  foreignKey: "plan_week_id",
  as: "plan_week",
});

BrandRoadmapTask.hasMany(BrandPlanTask, {
  foreignKey: "task_id",
  as: "plan_tasks",
});
BrandPlanTask.belongsTo(BrandRoadmapTask, {
  foreignKey: "task_id",
  as: "task",
});

BrandPlan.hasMany(BrandPlanWeek, {
  foreignKey: "plan_id",
  as: "weeks",
});
BrandPlanWeek.belongsTo(BrandPlan, {
  foreignKey: "plan_id",
  as: "plan",
});

BrandRoadmapWeek.hasMany(BrandPlanWeek, {
  foreignKey: "week_id",
  as: "plan_weeks",
});
BrandPlanWeek.belongsTo(BrandRoadmapWeek, {
  foreignKey: "week_id",
  as: "week",
});

BrandRoadmapWeek.hasMany(BrandRoadmapTask, {
  foreignKey: "week_id",
  as: "tasks",
});
BrandRoadmapTask.belongsTo(BrandRoadmapWeek, {
  foreignKey: "week_id",
  as: "week",
});

BrandRoadmap.hasMany(BrandRoadmapWeek, {
  foreignKey: "roadmap_id",
  as: "weeks",
});
BrandRoadmapWeek.belongsTo(BrandRoadmap, {
  foreignKey: "roadmap_id",
  as: "roadmap",
});

BrandRoadmapPhase.hasMany(BrandRoadmapWeek, {
  foreignKey: "phase_id",
  as: "weeks",
});
BrandRoadmapWeek.belongsTo(BrandRoadmapPhase, {
  foreignKey: "phase_id",
  as: "phase",
});

BrandRoadmap.hasMany(BrandRoadmapPhase, {
  foreignKey: "roadmap_id",
  as: "phases",
});
BrandRoadmapPhase.belongsTo(BrandRoadmap, {
  foreignKey: "roadmap_id",
  as: "roadmap",
});

// User ↔ Service
User.belongsToMany(Service, {
  through: UserService,
  as: "services",
  foreignKey: "user_id",
});

Service.belongsToMany(User, {
  through: UserService,
  as: "users",
  foreignKey: "service_id",
});

// GHL PIPELINES
Business.belongsToMany(GhlPipeline, {
  through: BusinessPipeline,
  foreignKey: 'business_id',
  as: 'pipelines'
});

GhlPipeline.belongsToMany(Business, {
  through: BusinessPipeline,
  foreignKey: 'pipeline_id',
  as: 'businesses'
});

BusinessPipeline.belongsTo(Business, {
  foreignKey: "business_id",
  as: "business"
});

BusinessPipeline.belongsTo(GhlPipeline, {
  foreignKey: "pipeline_id",
  as: "pipeline"
});


// User - Business many-to-many relationships (through UserBusiness)
User.belongsToMany(Business, {
  through: UserBusiness,
  foreignKey: 'user_id',
  otherKey: 'business_id',
  as: 'businesses'
});

Business.belongsToMany(User, {
  through: UserBusiness,
  foreignKey: 'business_id',
  otherKey: 'user_id',
  as: 'users'
});

// UserBusiness associations
UserBusiness.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

UserBusiness.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// Business - BusinessDetails one-to-one relationship
Business.hasOne(BusinessDetails, {
  foreignKey: 'business_id',
  as: 'details'
});

BusinessDetails.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// Business - DoctorsDetails one-to-many relationship
Business.hasMany(DoctorsDetails, {
  foreignKey: 'business_id',
  as: 'doctors'
});

DoctorsDetails.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// Business - TeamDetails one-to-one relationship
Business.hasOne(TeamDetails, {
  foreignKey: 'business_id',
  as: 'teamDetails'
});

TeamDetails.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// TeamDetails - EmployeeDetails one-to-many relationship
TeamDetails.hasMany(EmployeeDetails, {
  foreignKey: 'team_details_id',
  as: 'employees'
});

EmployeeDetails.belongsTo(TeamDetails, {
  foreignKey: 'team_details_id',
  as: 'teamDetails'
});

// Business - CultureDetails one-to-one relationship
Business.hasOne(CultureDetails, {
  foreignKey: 'business_id',
  as: 'culture'
});

CultureDetails.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// Business - MarketAnalysis one-to-one relationship
Business.hasOne(MarketAnalysis, {
  foreignKey: 'business_id',
  as: 'marketAnalysis'
});

MarketAnalysis.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// MarketAnalysis - CompetitorDetails one-to-many relationship
MarketAnalysis.hasMany(CompetitorDetails, {
  foreignKey: 'market_analysis_id',
  as: 'competitors'
});

CompetitorDetails.belongsTo(MarketAnalysis, {
  foreignKey: 'market_analysis_id',
  as: 'marketAnalysis'
});

// Business - PricingDetails one-to-one relationship
Business.hasOne(PricingDetails, {
  foreignKey: 'business_id',
  as: 'pricing'
});

PricingDetails.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// Business - MarketPerception one-to-one relationship
Business.hasOne(MarketPerception, {
  foreignKey: 'business_id',
  as: 'marketPerception'
});

MarketPerception.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// Business - Service many-to-many relationships (through BusinessService)
Business.belongsToMany(Service, {
  through: BusinessService,
  foreignKey: 'business_id',
  otherKey: 'service_id',
  as: 'services'
});

Service.belongsToMany(Business, {
  through: BusinessService,
  foreignKey: 'service_id',
  otherKey: 'business_id',
  as: 'businesses'
});

// BusinessService associations
Business.hasMany(BusinessService, {
  foreignKey: 'business_id',
  as: 'businessServices'
});

BusinessService.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

Service.hasMany(BusinessService, {
  foreignKey: 'service_id',
  as: 'businessServices'
});

BusinessService.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service'
});

// Business - OnboardingSteps many-to-many relationships (through BusinessOnboarding)
Business.belongsToMany(OnboardingSteps, {
  through: BusinessOnboarding,
  foreignKey: 'business_id',
  otherKey: 'onboarding_step_id',
  as: 'onboardingSteps'
});

OnboardingSteps.belongsToMany(Business, {
  through: BusinessOnboarding,
  foreignKey: 'onboarding_step_id',
  otherKey: 'business_id',
  as: 'businesses'
});

// BusinessOnboarding associations
Business.hasMany(BusinessOnboarding, {
  foreignKey: 'business_id',
  as: 'businessOnboarding'
});

BusinessOnboarding.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

OnboardingSteps.hasMany(BusinessOnboarding, {
  foreignKey: 'onboarding_step_id',
  as: 'businessOnboarding'
});

BusinessOnboarding.belongsTo(OnboardingSteps, {
  foreignKey: 'onboarding_step_id',
  as: 'onboardingStep'
});

// Business Document Associations
Business.hasMany(BusinessDocument, {
  foreignKey: 'business_id',
  as: 'documents'
});

BusinessDocument.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

// BusinessSheet Associations (one sheet per business)
Business.hasMany(BusinessSheet, {
  foreignKey: 'business_id',
  as: 'sheets'
});

BusinessSheet.belongsTo(Business, {
  foreignKey: 'business_id',
  as: 'business'
});

User.hasMany(BusinessDocument, {
  foreignKey: 'uploaded_by',
  as: 'uploadedDocuments'
});

BusinessDocument.belongsTo(User, {
  foreignKey: 'uploaded_by',
  as: 'uploader'
});

// OnboardingSteps - OnboardingSections associations
OnboardingSteps.hasMany(OnboardingSections, {
  foreignKey: 'step_id',
  as: 'sections'
});

OnboardingSections.belongsTo(OnboardingSteps, {
  foreignKey: 'step_id',
  as: 'step'
});

// OnboardingSections - OnboardingQuestions associations
OnboardingSections.hasMany(OnboardingQuestions, {
  foreignKey: 'section_id',
  as: 'questions'
});

OnboardingQuestions.belongsTo(OnboardingSections, {
  foreignKey: 'section_id',
  as: 'section'
});

// OnboardingSteps - OnboardingQuestions associations
OnboardingSteps.hasMany(OnboardingQuestions, {
  foreignKey: 'step_id',
  as: 'questions'
});

OnboardingQuestions.belongsTo(OnboardingSteps, {
  foreignKey: 'step_id',
  as: 'step'
});


// Service - ServiceSections associations
Service.hasMany(SrvconbOardingQuestionsSection, {
  foreignKey: 'service_id',
  as: 'sections'
});

SrvconbOardingQuestionsSection.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'page'
});

// ServiceSections - ServiceQuestions associations
SrvconbOardingQuestionsSection.hasMany(SrvcOnboardingQuestions, {
  foreignKey: 'section_id',
  as: 'questions'
});

SrvcOnboardingQuestions.belongsTo(SrvconbOardingQuestionsSection, {
  foreignKey: 'section_id',
  as: 'section'
});

// Service - ServiceQuestions associations
Service.hasMany(SrvcOnboardingQuestions, {
  foreignKey: 'service_id',
  as: 'questions'
});

SrvcOnboardingQuestions.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'page'
});

// User - Notification associations
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications'
});

Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// AuditLog associations
User.hasMany(AuditLog, {
  foreignKey: 'user_id',
  as: 'auditLogs'
});

AuditLog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});


export {
  User,
  Business,
  BusinessDetails,
  DoctorsDetails,
  TeamDetails,
  EmployeeDetails,
  CultureDetails,
  MarketAnalysis,
  CompetitorDetails,
  PricingDetails,
  MarketPerception,
  Service,
  BusinessService,
  UserBusiness,
  OnboardingSteps,
  BusinessOnboarding,
  BusinessDocument,
  OnboardingSections,
  OnboardingQuestions,
  SrvcOnboardingQuestions,
  SrvconbOardingQuestionsSection,
  Notification,
};