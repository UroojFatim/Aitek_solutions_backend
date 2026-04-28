import ghl from "../services/ghl.service.js";
import { ApiResponse } from "../utils/response.util.js";

/* ---------------------- OPPORTUNITIES CONTROLLERS ---------------------- */
export const getAllOpportunities = async (req, res) => {
  const { locationId, pipeline_id } = req.params;
  try {
    const response = await ghl.opportunities.searchOpportunity({
      locationId: locationId,
    });
    response.opportunities = response.opportunities.filter(
      (opportunity) => opportunity.pipelineId === pipeline_id
    );
    return ApiResponse.ok(res, "Opportunities fetched successfully.", response);
  } catch (err) {
    return ApiResponse.serverError(res, "Failed to fetch response.", err);
  }
};

export const createOpportunity = async (req, res) => {
  try {
    const payload = req.body.payload || req.body;

    const {
      pipelineId,
      locationId,
      name,
      pipelineStageId,
      status,
      contactId,
      monetaryValue,
      ownerId,
      assignedTo: assignedToFromBody,
      source,
    } = payload;

    const assignedTo = assignedToFromBody || ownerId || undefined;

    const body = {
      pipelineId,
      locationId,
      name,
      pipelineStageId,
      status,
      contactId,
      monetaryValue,
      ...(assignedTo && { assignedTo }),
      ...(source && { source }),
      // ...(customFields.length > 0 && { customFields }),
    };

    const response = await ghl.opportunities.createOpportunity(body);

    return ApiResponse.ok(res, "Opportunity created successfully.", response);
  } catch (error) {
    console.error("createOpportunity error:", error?.response?.data || error);
    return ApiResponse.serverError(res, "Failed to create opportunity.", error);
  }
};

export const updateOpportunity = async (req, res) => {
  try {
    const payload = req.body.payload || req.body;

    const {
      pipelineId,
      name,
      pipelineStageId,
      status,
      monetaryValue,
      ownerId,
      assignedTo: assignedToFromBody,
      source,
    } = payload;

    // 🔹 prefer assignedTo from body, else ownerId
    const assignedTo = assignedToFromBody || ownerId || undefined;

    const { id } = req.params;

    const body = {
      pipelineId,
      name,
      pipelineStageId,
      status,
      monetaryValue,
      ...(assignedTo && { assignedTo }),
      ...(source && { source }),
    };

    const response = await ghl.opportunities.updateOpportunity({ id }, body);

    return ApiResponse.ok(res, "Opportunity updated successfully.", response);
  } catch (error) {
    console.error("updateOpportunity error:", error?.response?.data || error);
    return ApiResponse.serverError(res, "Failed to update opportunity.", error);
  }
};

export const updateOpportunityStage = async (req, res) => {
  const opportunityId = req.params.id;
  const { pipelineStageId, status } = req.body.payload || req.body;
  try {
    const response = await ghl.opportunities.updateOpportunity(
      {
        id: opportunityId, // opportunityId
      },
      {
        pipelineStageId: pipelineStageId,
        status: status,
      }
    );
    return ApiResponse.ok(res, "Opportunity updated successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to update opportunity.", error);
  }
};

/* ---------------------- PIPELINES CONTROLLERS ---------------------- */
export const getAllPipelines = async (req, res) => {
  const { locationId } = req.params;
  try {
    const response = await ghl.opportunities.getPipelines({
      locationId: locationId,
    });
    return ApiResponse.ok(res, "Pipelines fetched successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch pipelines.", error);
  }
};

/* ---------------------- APPOINTMENTS CONTROLLERS ---------------------- */
export const createAppointment = async (req, res) => {
  const {
    title,
    meetingLocationType,
    appointmentStatus,
    calendarId,
    locationId,
    contactId,
    startTime,
    endTime,
  } = req.body.payload || req.body;

  try {
    const response = await ghl.calendars.createAppointment({
      title,
      meetingLocationType, // "custom" | "zoom" | "google_meet" etc.
      appointmentStatus, // "confirmed" | "pending" | ...
      calendarId,
      locationId,
      contactId,
      startTime,
      endTime,
    });
    return ApiResponse.ok(res, "Appointment created successfully.", response);
  } catch (error) {
    console.error("createAppointment error:", error?.response?.data || error);
    return ApiResponse.serverError(res, "Failed to create appointment.", error);
  }
};

export const updateAppointment = async (req, res) => {
  const { eventId } = req.body;
  const {
    title,
    meetingLocationId,
    meetingLocationType,
    appointmentStatus,
    calendarId,
    startTime,
    endTime,
  } = req.body;
  try {
    const response = await ghl.calendars.editAppointment(
      {
        eventId: eventId,
      },
      {
        title: title,
        meetingLocationType: meetingLocationType,
        meetingLocationId: meetingLocationId,
        appointmentStatus: appointmentStatus,
        calendarId: calendarId,
        startTime: startTime,
        endTime: endTime,
      }
    );
    return ApiResponse.ok(res, "Appointment edited successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to edit appointment.", error);
  }
};

export const deleteAppointment = async (req, res) => {
  const { eventId } = req.body;
  try {
    const response = await ghl.calendars.deleteEvent({
      eventId: eventId,
    });
    return ApiResponse.ok(res, "Appointment deleted successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to delete appointment.", error);
  }
};

/* ---------------------- OPPORTUNITIES CONTROLLERS ---------------------- */
export const createTask = async (req, res) => {
  const { contactId, payload } = req.body;
  try {
    const response = await ghl.contacts.createTask(
      {
        contactId: contactId,
      },
      {
        title: payload.title,
        body: payload.body,
        dueDate: payload.dueDate,
        completed: payload.completed,
        assignedTo: payload.assignedTo,
      }
    );
    return ApiResponse.ok(res, "Task created successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to create task.", error);
  }
};

export const updateTask = async (req, res) => {
  const { title, body, dueDate, completed, assignedTo } = req.body;
  const { taskId, contactId } = req.params;
  try {
    const response = await ghl.contacts.updateTask(
      {
        contactId: contactId,
        taskId: taskId,
      },
      {
        title: title,
        body: body,
        dueDate: dueDate,
        completed: completed,
        assignedTo: assignedTo,
      }
    );
    return ApiResponse.ok(res, "Task updated successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to update task.", error);
  }
};

export const updateTaskCompleted = async (req, res) => {
  const { taskId, contactId } = req.body;
  try {
    const response = await ghl.contacts.updateTaskCompleted(
      {
        contactId: contactId,
        taskId: taskId,
      },
      {
        completed: true,
      }
    );
    return ApiResponse.ok(res, "Task updated successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to update task.", error);
  }
};

export const getAllTasks = async (req, res) => {
  const { contactId } = req.params;

  try {
    const response = await ghl.contacts.getAllTasks({
      contactId: contactId,
    });
    return ApiResponse.ok(res, "Tasks retrieved successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to retrieve tasks.", error);
  }
};

export const deleteTask = async (req, res) => {
  const { contactId, taskId } = req.body;
  try {
    const response = await ghl.contacts.deleteTask({
      contactId: contactId,
      taskId: taskId,
    });
    return ApiResponse.ok(res, "Task deleted successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to delete task.", error);
  }
};

/* ---------------------- NOTES CONTROLLERS ---------------------- */
export const createNote = async (req, res) => {
  const { contactId, body } = req.body;
  try {
    const response = await ghl.contacts.createNote(
      {
        contactId: contactId,
      },
      {
        body: body,
      }
    );
    return ApiResponse.ok(res, "Note created successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to create note.", error);
  }
};

export const updateNote = async (req, res) => {
  const { userId, body } = req.body;
  const { contactId, id } = req.params;

  try {
    const response = await ghl.contacts.updateNote(
      {
        contactId: contactId,
        id: id,
      },
      {
        userId: userId,
        body: body,
      }
    );
    return ApiResponse.ok(res, "Note updated successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to update note.", error);
  }
};

export const getAllNotes = async (req, res) => {
  const { contactId } = req.params;

  try {
    const response = await ghl.contacts.getAllNotes({
      contactId: contactId,
    });
    return ApiResponse.ok(res, "Notes retrieved successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to retrieve notes.", error);
  }
};

export const deleteNote = async (req, res) => {
  const { contactId, id } = req.body;

  try {
    const response = await ghl.contacts.deleteNote({
      contactId: contactId,
      id: id,
    });
    return ApiResponse.ok(res, "Note deleted successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to delete note.", error);
  }
};

/* ---------------------- CONVERSATIONS CONTROLLERS ---------------------- */
export const createConversation = async (req, res) => {
  const { locationId, contactId } = req.body;
  try {
    const response = await ghl.conversations.createConversation({
      locationId: locationId,
      contactId: contactId,
    });
    return ApiResponse.ok(res, "Conversation created successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "Failed to create conversation.",
      error
    );
  }
};

export const updateConversation = async (req, res) => {
  const { locationId, unreadCount, starred, feedback } = req.body;
  const { conversationId } = req.params;
  try {
    const response = await ghl.conversations.updateConversation(
      {
        conversationId: conversationId,
      },
      {
        locationId: locationId,
        unreadCount: unreadCount,
        starred: starred,
        feedback: feedback,
      }
    );
    return ApiResponse.ok(res, "Conversation updated successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "Failed to update conversation.",
      error
    );
  }
};

export const getConversation = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const response = await ghl.conversations.getConversation({
      conversationId: conversationId,
    });
    return ApiResponse.ok(
      res,
      "Conversation retrieved successfully.",
      response
    );
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "Failed to retrieve conversation.",
      error
    );
  }
};

export const sendMessage = async (req, res) => {
  const {
    conversationId,
    contactId,
    type = "SMS",
    message,
    status = "pending",
  } = req.body;

  // Validation
  if (!conversationId) {
    return ApiResponse.badRequest(res, "conversationId is required.");
  }
  if (!contactId) {
    return ApiResponse.badRequest(res, "contactId is required.");
  }
  if (!message) {
    return ApiResponse.badRequest(res, "message is required.");
  }

  try {
    const response = await ghl.conversations.sendANewMessage({
      type: type,
      contactId: contactId,
      message: message,
    });
    return ApiResponse.ok(res, "Message sent successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to send message.", error);
  }
};

export const getMessages = async (req, res) => {
  const {
    conversationId,
    lastMessageId,
    limit = 20,
    type = "TYPE_SMS",
  } = req.body;
  try {
    const response = await ghl.conversations.getMessages({
      conversationId: conversationId,
      lastMessageId: lastMessageId,
      limit: limit,
      type: type,
    });
    return ApiResponse.ok(res, "Message sent successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to send message.", error);
  }
};

export const getAllConversations = async (req, res) => {
  const { locationId } = req.params;

  try {
    const response = await ghl.conversations.searchConversation({
      locationId: locationId,
      limit: 100,
    });
    return ApiResponse.ok(
      res,
      "Conversations retrieved successfully.",
      response
    );
  } catch (error) {
    return ApiResponse.serverError(error, "Failed to create contact.");
  }
};

/* ---------------------- CONTACTS CONTROLLERS ---------------------- */
export const getContactForCall = async (req, res) => {
  const { contactId } = req.params;
  try {
    const response = await highLevel.contacts.getContact({
      contactId: contactId,
    });
    return ApiResponse.ok(res, "Contact fetched successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch contact.", error);
  }
};

export const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      locationId, // required
    } = req.body;

    if (!name || !locationId) {
      return ApiResponse.badRequest(res, "name and locationId are required.");
    }

    // Derive firstName / lastName from full name (simple split)
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

    // Build minimal payload for GHL
    const payload = {
      name,
      locationId,
      firstName,
      lastName,
    };

    if (email) payload.email = email;
    if (phone) payload.phone = phone;

    // 🔹 Call GHL contact create with minimal fields
    const response = await ghl.contacts.createContact(payload);

    // Expect response.data or similar depending on SDK – most SDKs return the contact object directly
    return ApiResponse.ok(res, "Contact created successfully.", response);
  } catch (error) {
    const ghlErrorData = error?.response?.data;
    console.error("GHL createContact ERROR ===>");
    console.error("Status:", error?.response?.status);
    console.error("Data:", JSON.stringify(ghlErrorData, null, 2));

    return ApiResponse.serverError(
      res,
      "Failed to create contact.",
      ghlErrorData || error.message
    );
  }
};

export const getAllContact = async (req, res) => {
  const { locationId } = req.body;

  try {
    const response = await ghl.contacts.searchContactsAdvanced({
      locationId: locationId,
    });
    return ApiResponse.ok(res, "Contact fetched successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch contacts.", error);
  }
};

export const updateContact = async (req, res) => {
  const { contactId, email, phone, tags } = req.body;
  try {
    const response = await ghl.contacts.updateContact(
      {
        contactId: contactId,
      },
      {
        email: email,
        phone: phone,
        tags: tags,
      }
    );
    return ApiResponse.ok(res, "Contact updated successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to updated contacts.", error);
  }
};

export const getContactById = async (req, res) => {
  const { contactId } = req.params;
  try {
    const response = await ghl.contacts.getContact({
      contactId: contactId,
    });
    return ApiResponse.ok(res, "Contact fetched successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch contact.", error);
  }
};

/* ---------------------- TAGS CONTROLLERS ---------------------- */
export const addTags = async (req, res) => {
  const { contactId, tags } = req.body;
  try {
    const response = await ghl.contacts.addTags(
      {
        contactId: contactId,
      },
      {
        tags: tags,
      }
    );
    return ApiResponse.ok(res, "Tags added successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to add tags.", error);
  }
};

export const removeTags = async (req, res) => {
  const { contactId, tags } = req.body;
  try {
    const response = await ghl.contacts.removeTags(
      {
        contactId: contactId,
      },
      {
        tags: tags,
      }
    );
    return ApiResponse.ok(res, "Tags removed successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to remove tags.", error);
  }
};

/* ---------------------- ADDITIONAL CONTROLLERS ---------------------- */
export const logOutboundCall = async (req, res) => {
  try {
    const {
      locationId,
      contactId,
      to,
      from,
      callSid,
      duration,
      startedAt,
      endedAt,
      notes,
      conversationId,
      conversationProviderId, // optional: your GHL call provider ID
    } = req.body;

    // Minimal payload – adjust based on your provider & docs
    const payload = {
      locationId,
      contactId,
      type: "Call",
      direction: "outbound",
      conversationId: conversationId,
      conversationProviderId, // if you have a custom provider
      altId: callSid, // link back to Twilio call
      date: startedAt, // when the call started
      call: {
        from,
        to,
        duration,
        startedAt,
        endedAt,
        status: "completed",
        notes,
      },
    };

    // POST /conversations/messages/outbound
    const response = await ghl.conversations.addAnOutboundMessage(payload);

    return res.json({
      success: true,
      message: "Outbound call logged to GHL.",
      data: response,
    });
  } catch (err) {
    console.error(
      "Error logging outbound call:",
      err?.response?.data || err.message || err
    );

    return res.status(500).json({
      success: false,
      message: "Failed to log outbound call to GHL.",
      details: err?.response?.data || err.message || err,
    });
  }
};

export const getAllOwners = async (req, res) => {
  const { locationId } = req.params;
  try {
    const response = await ghl.users.getUserByLocation({
      locationId: locationId,
    });
    return ApiResponse.ok(res, "Owners fetched successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to fetch owners.", error);
  }
};

export const getAllCalendars = async (req, res) => {
  const { locationId } = req.params;
  try {
    const response = await ghl.calendars.getCalendars({
      locationId: locationId,
    });
    return ApiResponse.ok(res, "Tags removed successfully.", response);
  } catch (error) {
    return ApiResponse.serverError(res, "Failed to remove tags.", error);
  }
};

export const getAppointmentsForContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const response = await ghl.contacts.getAppointmentsForContact({
      contactId: contactId,
    });
    return ApiResponse.ok(
      res,
      "Appointments for Contact fetched successfully.",
      response
    );
  } catch (error) {
    return ApiResponse.serverError(
      res,
      "Failed to fetch appointments for Contact.",
      error
    );
  }
};
