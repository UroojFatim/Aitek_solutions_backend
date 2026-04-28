import express from "express";
import {
  getAllOpportunities,
  createOpportunity,
  createAppointment,
  updateAppointment,
  createTask,
  updateTask,
  createNote,
  createConversation,
  updateConversation,
  sendMessage,
  getAllPipelines,
  createContact,
  getConversation,
  getMessages,
  getAllConversations,
  logOutboundCall,
  getAllContact,
  getAllOwners,
  updateContact,
  updateOpportunityStage,
  getContactById,
  addTags,
  removeTags,
  getAllNotes,
  deleteNote,
  getAllTasks,
  deleteTask,
  updateTaskCompleted,
  getAllCalendars,
  deleteAppointment,
  getAppointmentsForContact,
  updateOpportunity,
} from "../controllers/ghl.controller.js";

const router = express.Router();

/* ---------------------- OPPORTUNITIES ROUTES ---------------------- */
router.get("/opportunities/:locationId/:pipeline_id", getAllOpportunities);
router.post("/opportunities", createOpportunity);
router.put("/opportunities/:id", updateOpportunity);
// router.put("/opportunities/:id", updateOpportunityStage);

/* ------------------------- PIPELINES ROUTES ------------------------ */
router.get("/pipelines/:locationId", getAllPipelines);

/* ------------------------- APPOINTMENTS ROUTES ------------------------ */
router.post("/appointments/create", createAppointment);
router.put("/appointments/update", updateAppointment);
router.post("/appointments/delete", deleteAppointment);
router.get("/appointments/:contactId", getAppointmentsForContact);

/* ------------------------- CALENDARS ROUTES ------------------------ */
router.get("/calendars/:locationId", getAllCalendars);

/* --------------------------- TAGS ROUTES ----------------------- */
router.post("/contact/tags/add", addTags);
router.post("/contact/tags/remove", removeTags);

/* --------------------------- TASK ROUTES ----------------------- */
router.get("/tasks/:contactId", getAllTasks);
router.post("/tasks/create", createTask);
router.put("/tasks/:taskId/:contactId", updateTask);
router.post("/tasks/delete", deleteTask);
router.post("/tasks/update-completed", updateTaskCompleted);

/* --------------------------- NOTES ROUTES ----------------------- */
router.get("/notes/:contactId", getAllNotes);
router.post("/notes/create", createNote);
router.post("/notes/delete", deleteNote);

/* --------------------------- CONVERSATION ROUTES ----------------------- */
router.post("/conversation", createConversation);
router.put("/conversation/:conversationId", updateConversation);
router.get("/conversation/:conversationId", getConversation);
router.get("/conversations/:locationId", getAllConversations);

/* --------------------------- MESSAGE ROUTES ----------------------- */
router.post("/conversations/messages/send-message", sendMessage);
router.post("/conversations/messages/get-messages", getMessages);

/* --------------------------- CALL ROUTES ----------------------- */
router.post("/conversations/calls/outbound-call-log", logOutboundCall);
// router.post("/conversations/call", addAnOutboundMessage);

/* --------------------------- CONTACT ROUTES ----------------------- */
router.post("/contact", createContact);
router.put("/contact", updateContact);
router.get("/contacts", getAllContact);
router.get("/contact/:contactId", getContactById);

/* --------------------------- USERS/OWNERS ROUTES ----------------------- */
router.get("/users/:locationId", getAllOwners);

export default router;
