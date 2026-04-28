// controllers/brandRoadmap.controller.js
import sequelize from "../config/database.config.js";
import BrandRoadmap from "../models/BrandEstablishment/brandRoadmap.model.js";
import BrandPhase from "../models/BrandEstablishment/brandRoadmapPhase.model.js";
import BrandWeek from "../models/BrandEstablishment/brandRoadmapWeek.model.js";
import BrandTask from "../models/BrandEstablishment/brandRoadmapTask.model.js";
import { ApiResponse } from "../utils/response.util.js";

// --- New 12-month roadmap definition --- //
const BRAND_ESTABLISHMENT_ROADMAP = {
  name: "WOA 12-Month Brand Establishment & Authority Plan",
  description:
    "Objective: Build a dominant, lasting brand through strategic storytelling, content, community presence, and authority positioning.",
  total_months: 12,
  total_weeks: 42, // we are defining weeks 1–42
  phases: [
    // ---------------- PHASE 1 ---------------- //
    {
      phase_order: 1,
      name: "3 Months – Foundation & Visibility",
      theme: "Lay the story, visuals, and local awareness foundation.",
      start_week: 1,
      end_week: 12,
      weeks: [
        {
          week_number: 1,
          title: "Kickoff & Brand Story Workshop",
          deliverable: "Kickoff & Brand Story Workshop",
          woa_responsibilities: "Facilitate story session, draft brand narrative.",
          client_responsibilities:
            "Share personal/professional journey, approve draft story.",
          client_instructions:
            "This is your Netflix documentary moment. Tell us why you do what you do – raw, real, unfiltered.",
          checklist_items: [
            "Share your backstory.",
            "Highlight why full-arch cases excite you.",
            "Approve draft narrative.",
          ],
          reflective_question:
            "If your journey as a dentist was turned into a movie, what would the title be?",
        },
        {
          week_number: 2,
          title: "Visual Identity Development",
          deliverable: "Visual Identity Development",
          woa_responsibilities:
            "Design colors, fonts, templates, and photo guidelines.",
          client_responsibilities:
            "Provide logos/photos, approve visual direction.",
          client_instructions:
            "Dig through your digital attic. Old logos, headshots—send it all.",
          checklist_items: ["Upload logos/photos.", "Approve mood board."],
          reflective_question:
            "If you could pick any color to represent your office brand, what would it be and why?",
        },
        {
          week_number: 3,
          title: "Market Landscape Research",
          deliverable: "Market Landscape Research",
          woa_responsibilities:
            "Compile local media, billboard, radio, and event options.",
          client_responsibilities:
            "Share insider knowledge of outlets and events.",
          client_instructions:
            "Give us the cheat codes to your city—where do your patients’ eyes and ears really go?",
          checklist_items: [
            "List local events.",
            "Note top radio/TV outlets.",
          ],
          reflective_question:
            "Have you ever driven by a billboard that made you laugh out loud or stick in your brain? What was it?",
        },
        {
          week_number: 4,
          title: "Competitor Scan",
          deliverable: "Competitor Scan",
          woa_responsibilities: "Analyze competitors’ ads and tone.",
          client_responsibilities:
            "Share observations about competitors’ presence.",
          client_instructions:
            "Spy time. Tell us who’s dominating (or flopping) locally.",
          checklist_items: [
            "List top 2 competitors.",
            "Share screenshots.",
          ],
          reflective_question:
            "What’s the cringiest dental ad you’ve ever seen in your town?",
        },
        {
          week_number: 5,
          title: "Doctor Highlight Reel Prep",
          deliverable: "Doctor Highlight Reel Prep",
          woa_responsibilities: "Script and storyboard a 60-second video.",
          client_responsibilities:
            "Approve storyline, schedule filming.",
          client_instructions:
            "Hollywood called… you’re the star! Approve the script and make time.",
          checklist_items: [
            "Approve script.",
            "Confirm filming date.",
          ],
          reflective_question:
            "If your life had a trailer, what one line MUST be included?",
        },
        {
          week_number: 6,
          title: "Doctor Highlight Reel Shoot",
          deliverable: "Doctor Highlight Reel Shoot",
          woa_responsibilities: "Film and edit brand video.",
          client_responsibilities:
            "Be available for shoot, provide testimonials.",
          client_instructions:
            "Smile and shine. Bonus: bring a raving patient to cameo.",
          checklist_items: [
            "Be present for filming.",
            "Line up 1–2 patients.",
          ],
          reflective_question:
            "If you could invite one celebrity to cameo in your highlight reel, who would it be?",
        },
        {
          week_number: 7,
          title: "Testimonial Collection Kickoff",
          deliverable: "Testimonial Collection Kickoff",
          woa_responsibilities:
            "Provide testimonial templates and video team.",
          client_responsibilities:
            "Identify patients, secure consent.",
          client_instructions:
            "Your happiest patients are your best marketers. Pick the ones who rave about you.",
          checklist_items: [
            "Select 3–5 patients.",
            "Get consent.",
          ],
          reflective_question:
            "Which of your patients would happily shout your name from a rooftop if we asked?",
        },
        {
          week_number: 8,
          title: "Content Calendar Draft",
          deliverable: "Content Calendar Draft",
          woa_responsibilities: "Develop 90-day content calendar.",
          client_responsibilities:
            "Review and approve schedule.",
          client_instructions:
            "This is meal prep for your brand. Approve before we serve.",
          checklist_items: [
            "Review calendar draft.",
            "Approve content themes.",
          ],
          reflective_question:
            "If your office Instagram had a ‘series’ like Netflix, what would it be called?",
        },
        {
          week_number: 9,
          title: "Community Presence #1",
          deliverable: "Community Presence #1",
          woa_responsibilities:
            "Recommend sponsorship and event opportunities.",
          client_responsibilities:
            "Select event, commit to participation.",
          client_instructions:
            "Be seen where it matters. Choose one event that fits your vibe.",
          checklist_items: [
            "Choose event.",
            "Assign staff lead.",
          ],
          reflective_question:
            "What’s one quirky local event you’d secretly love to sponsor just for fun?",
        },
        {
          week_number: 10,
          title: "Launch Initial Socials",
          deliverable: "Launch Initial Socials",
          woa_responsibilities: "Publish first content pieces.",
          client_responsibilities:
            "Engage with posts, share content.",
          client_instructions:
            "The algorithm loves engagement. Don’t ghost your own posts.",
          checklist_items: [
            "Like/share posts.",
            "Encourage staff engagement.",
          ],
          reflective_question:
            "If you had to write one hashtag that sums up your office culture, what would it be?",
        },
        {
          week_number: 11,
          title: "Review Strategy Refinement",
          deliverable: "Review Strategy Refinement",
          woa_responsibilities:
            "Analyze testimonial and content performance.",
          client_responsibilities:
            "Give feedback on results.",
          client_instructions:
            "We’ll bring the numbers. You bring enthusiasm.",
          checklist_items: null,
          reflective_question:
            "What post or story has gotten the biggest laugh or buzz in your office recently?",
        },
        {
          week_number: 12,
          title: "Quarterly Review",
          deliverable: "Quarterly Review",
          woa_responsibilities:
            "Present findings and next steps.",
          client_responsibilities:
            "Participate in review, align on adjustments.",
          client_instructions:
            "This is halftime. Be honest—what’s working, what’s not?",
          checklist_items: null,
          reflective_question:
            "If you could grade your brand performance so far, what grade would you give and why?",
        },
      ],
    },

    // ---------------- PHASE 2 ---------------- //
    {
      phase_order: 2,
      name: "6 Months – Authority & Engagement",
      theme: "Turn visibility into authority and sustained engagement.",
      start_week: 13,
      end_week: 24,
      weeks: [
        {
          week_number: 13,
          title: "Patient Story Collection",
          deliverable: "Patient Story Collection",
          woa_responsibilities: "Film and edit testimonials.",
          client_responsibilities:
            "Select patients, request consent.",
          client_instructions:
            "Your patients are your hype squad. Pick wisely.",
          checklist_items: [
            "Identify patients.",
            "Secure consent.",
          ],
          reflective_question:
            "If you could put one patient’s story in a Super Bowl commercial, who would it be?",
        },
        {
          week_number: 14,
          title: "A/B Campaign Design",
          deliverable: "A/B Campaign Design",
          woa_responsibilities: "Draft messaging variations.",
          client_responsibilities:
            "Approve campaign direction.",
          client_instructions:
            "We’ll show you two flavors—pick the one that tastes right.",
          checklist_items: [
            "Review drafts.",
            "Approve direction.",
          ],
          reflective_question:
            "If your practice voice was a character (serious doctor, fun coach, wise mentor), which would it be?",
        },
        {
          week_number: 15,
          title: "A/B Campaign Launch",
          deliverable: "A/B Campaign Launch",
          woa_responsibilities: "Launch and track metrics.",
          client_responsibilities:
            "Promote content in your network.",
          client_instructions:
            "Get your team buzzing. The more they share, the faster it spreads.",
          checklist_items: ["Encourage staff sharing."],
          reflective_question:
            "What’s one marketing ad you’ve personally shared because you loved it?",
        },
        {
          week_number: 16,
          title: "PR Outreach #1",
          deliverable: "PR Outreach #1",
          woa_responsibilities: "Write and send pitches.",
          client_responsibilities:
            "Approve angles, be available.",
          client_instructions:
            "We’ll knock on newsroom doors—you just need to open them when they call back.",
          checklist_items: [
            "Approve pitch angle.",
            "Be available.",
          ],
          reflective_question:
            "If tomorrow’s news headline featured you, what would you want it to say?",
        },
        {
          week_number: 17,
          title: "Community Activation #1",
          deliverable: "Community Activation #1",
          woa_responsibilities: "Secure sponsorship.",
          client_responsibilities:
            "Commit to attend event, provide staff.",
          client_instructions:
            "Show up and shine. Be memorable in the crowd.",
          checklist_items: [
            "Select staff.",
            "Coordinate logistics.",
          ],
          reflective_question:
            "What’s one event you’d love your whole office to crash—just for fun?",
        },
        {
          week_number: 18,
          title: "Long-Form Video Production",
          deliverable: "Long-Form Video Production",
          woa_responsibilities: "Produce and edit feature video.",
          client_responsibilities:
            "Participate in filming.",
          client_instructions:
            "Think Netflix doc, not infomercial. Be raw, real, ready.",
          checklist_items: ["Be present for filming."],
          reflective_question:
            "If your practice had its own Netflix docuseries, what would the title be?",
        },
        {
          week_number: 19,
          title: "Landing Page Buildout",
          deliverable: "Landing Page Buildout",
          woa_responsibilities: "Design landing page.",
          client_responsibilities:
            "Approve design, provide info.",
          client_instructions:
            "This is your digital storefront. Double-check it’s YOU.",
          checklist_items: [
            "Approve draft.",
            "Provide info.",
          ],
          reflective_question:
            "If a new patient landed on your page today, what’s the #1 feeling you’d want them to leave with?",
        },
        {
          week_number: 20,
          title: "Geo-Targeted Ads Launch",
          deliverable: "Geo-Targeted Ads Launch",
          woa_responsibilities: "Deploy ads.",
          client_responsibilities:
            "Provide feedback on creative.",
          client_instructions:
            "If the ad feels off, tell us—we’ll adjust.",
          checklist_items: ["Review creative."],
          reflective_question:
            "What’s one local phrase or inside joke only people in your area would get?",
        },
        {
          week_number: 21,
          title: "Social Ramp-Up",
          deliverable: "Social Ramp-Up",
          woa_responsibilities: "Increase posting frequency.",
          client_responsibilities:
            "Engage with content, encourage staff.",
          client_instructions:
            "Algorithms love engagement. Rally the pack.",
          checklist_items: ["Encourage team interaction."],
          reflective_question:
            "If your office was trending on TikTok, what would the trend be?",
        },
        {
          week_number: 22,
          title: "Thought Leadership Content",
          deliverable: "Thought Leadership Content",
          woa_responsibilities:
            "Draft blog or webinar outline.",
          client_responsibilities:
            "Record or present content.",
          client_instructions:
            "You’re the expert—step into the spotlight.",
          checklist_items: [
            "Approve outline.",
            "Record content.",
          ],
          reflective_question:
            "If you had one message to give to every dentist in the country, what would it be?",
        },
        {
          week_number: 23,
          title: "Community Activation #2",
          deliverable: "Community Activation #2",
          woa_responsibilities: "Plan second event.",
          client_responsibilities:
            "Commit resources, participate.",
          client_instructions:
            "Consistency builds trust. Be present again.",
          checklist_items: [
            "Select event.",
            "Provide staff presence.",
          ],
          reflective_question:
            "What’s one community tradition you’d like your practice to be tied to forever?",
        },
        {
          week_number: 24,
          title: "Mid-Year Review",
          deliverable: "Mid-Year Review",
          woa_responsibilities: "Analyze results.",
          client_responsibilities:
            "Provide feedback and insights.",
          client_instructions:
            "Halfway checkpoint. Pivot if needed.",
          checklist_items: null,
          reflective_question:
            "If your brand was a sports team, what’s your current record? Winning? Rebuilding?",
        },
      ],
    },

    // ---------------- PHASE 3 ---------------- //
    {
      phase_order: 3,
      name: "12 Months – Market Domination & Longevity",
      theme: "Scale authority and lock in long-term market position.",
      start_week: 25,
      end_week: 42,
      weeks: [
        {
          week_number: 25,
          title: "Signature Campaign Concept",
          deliverable: "Signature Campaign Concept",
          woa_responsibilities: "Develop tagline/initiative.",
          client_responsibilities:
            "Approve and align on direction.",
          client_instructions:
            "Your signature move. Approve the unforgettable tagline.",
          checklist_items: ["Approve concept."],
          reflective_question:
            "If your practice had a theme song, what would it be—and why?",
        },
        {
          week_number: 26,
          title: "Signature Campaign Launch",
          deliverable: "Signature Campaign Launch",
          woa_responsibilities: "Roll out campaign.",
          client_responsibilities:
            "Participate and approve.",
          client_instructions:
            "This is your billboard moment—own it.",
          checklist_items: ["Approve creative."],
          reflective_question:
            "If your face was on a billboard, what fun caption would you secretly want under it?",
        },
        {
          week_number: 27,
          title: "Speaking Opportunity #1",
          deliverable: "Speaking Opportunity #1",
          woa_responsibilities: "Pitch doctor for speaking.",
          client_responsibilities:
            "Be available to present.",
          client_instructions:
            "Grab the mic. Market listens to authority.",
          checklist_items: ["Confirm availability."],
          reflective_question:
            "If you could speak on ANY stage (locally or globally), which one would you pick?",
        },
        {
          week_number: 28,
          title: "Tiered Media Planning",
          deliverable: "Tiered Media Planning",
          woa_responsibilities: "Plan ad mix.",
          client_responsibilities:
            "Approve ad buys, share budget.",
          client_instructions:
            "We’ll bring options—you bring the budget call.",
          checklist_items: [
            "Share budget.",
            "Approve placements.",
          ],
          reflective_question:
            "If money were no object, where would you plaster your face first?",
        },
        {
          week_number: 29,
          title: "Billboard/OOH Launch",
          deliverable: "Billboard/OOH Launch",
          woa_responsibilities: "Deploy creative.",
          client_responsibilities:
            "Approve designs, provide headshots.",
          client_instructions:
            "Your face, larger than life. Choose wisely.",
          checklist_items: [
            "Approve design.",
            "Provide headshots.",
          ],
          reflective_question:
            "What’s the most memorable billboard you’ve ever seen—and why?",
        },
        {
          week_number: 30,
          title: "Radio/Podcast Ads Launch",
          deliverable: "Radio/Podcast Ads Launch",
          woa_responsibilities: "Produce and publish ads.",
          client_responsibilities:
            "Record and/or approve audio.",
          client_instructions:
            "Mic check, doc. Patients want to hear you.",
          checklist_items: [
            "Record script.",
            "Approve audio.",
          ],
          reflective_question:
            "What song would you pick as your background track in a radio spot?",
        },
        {
          week_number: 31,
          title: "Community Hero Activation",
          deliverable: "Community Hero Activation",
          woa_responsibilities: "Design initiative.",
          client_responsibilities:
            "Choose cause, participate.",
          client_instructions:
            "Give back big. Pick a cause that matters.",
          checklist_items: [
            "Select cause.",
            "Participate.",
          ],
          reflective_question:
            "If your practice had to sponsor a quirky charity event, what would it be?",
        },
        {
          week_number: 32,
          title: "National Exposure Play",
          deliverable: "National Exposure Play",
          woa_responsibilities: "Submit applications.",
          client_responsibilities:
            "Provide credentials.",
          client_instructions:
            "Bragging rights play. Submit proudly.",
          checklist_items: ["Send credentials."],
          reflective_question:
            "If your practice won an award, what would you want it to be for?",
        },
        {
          week_number: 33,
          title: "Content Repurposing",
          deliverable: "Content Repurposing",
          woa_responsibilities: "Break down video assets.",
          client_responsibilities:
            "Approve clips, share network.",
          client_instructions:
            "Bite-sized fame. Approve, then share widely.",
          checklist_items: ["Approve clips."],
          reflective_question:
            "If you could post one video clip of your team every week, what moment would you choose?",
        },
        {
          week_number: 34,
          title: "Market Report Refresh",
          deliverable: "Market Report Refresh",
          woa_responsibilities: "Re-analyze competitors.",
          client_responsibilities:
            "Provide updated insights.",
          client_instructions:
            "Markets evolve. Tell us what’s new.",
          checklist_items: ["Update on competitor moves."],
          reflective_question:
            "Who’s the dark horse competitor you’re watching most right now?",
        },
        {
          week_number: 35,
          title: "ROI Impact Review",
          deliverable: "ROI Impact Review",
          woa_responsibilities: "Deliver outcomes report.",
          client_responsibilities:
            "Attend review meeting.",
          client_instructions:
            "See the scoreboard. Did we win?",
          checklist_items: ["Attend review."],
          reflective_question:
            "What’s the one result that would make you crack open champagne?",
        },
        {
          week_number: 36,
          title: "Legacy Branding Kit",
          deliverable: "Legacy Branding Kit",
          woa_responsibilities: "Compile media kit.",
          client_responsibilities:
            "Approve final kit.",
          client_instructions:
            "Your trophy case. Approve what lasts.",
          checklist_items: ["Approve kit."],
          reflective_question:
            "If your brand had a museum exhibit, what’s the first artifact we’d display?",
        },
        {
          // The row said "Week 37–52" – we’ll treat this as Week 37
          week_number: 37,
          title: "WOA Expansion Services",
          deliverable: "WOA Expansion Services",
          woa_responsibilities:
            "Introduce next-phase WOA services and options.",
          client_responsibilities:
            "Review and decide engagement level.",
          client_instructions:
            "Graduation day. You’re a local legend.",
          checklist_items: ["Review services."],
          reflective_question:
            "What’s the next mountain you want your practice to climb?",
        },
        {
          week_number: 38,
          title: "Advanced Patient Storytelling Campaign",
          deliverable: "Advanced Patient Storytelling Campaign",
          woa_responsibilities:
            "Develop campaign using multiple patient narratives.",
          client_responsibilities:
            "Identify 2–3 more patients willing to share deeper stories.",
          client_instructions:
            "Level up: move beyond basic testimonials to stories that feel cinematic.",
          checklist_items: [
            "Identify patients.",
            "Provide introductions.",
          ],
          reflective_question:
            "If a documentary crew followed one of your patients for a week, what would the most powerful scene be?",
        },
        {
          week_number: 39,
          title: "Doctor as Influencer Content",
          deliverable: "Doctor as Influencer Content",
          woa_responsibilities:
            "Produce short-form videos with doctor insights.",
          client_responsibilities:
            "Commit to recording quick tips or reflections.",
          client_instructions:
            "Step into influencer mode—short, smart, shareable advice clips.",
          checklist_items: [
            "Record short clips.",
            "Approve edits.",
          ],
          reflective_question:
            "If you could give one piece of advice to your younger self as a dentist, what would it be?",
        },
        {
          week_number: 40,
          title: "Office Culture Campaign",
          deliverable: "Office Culture Campaign",
          woa_responsibilities:
            "Create campaign around staff personalities and office culture.",
          client_responsibilities:
            "Select fun staff stories or behind-the-scenes moments.",
          client_instructions:
            "Show the human side—patients love the personalities behind the scrubs.",
          checklist_items: [
            "Nominate team members.",
            "Share funny/heartwarming stories.",
          ],
          reflective_question:
            "If your office team had a sitcom, what would the title be?",
        },
        {
          week_number: 41,
          title: "Community Legacy Project",
          deliverable: "Community Legacy Project",
          woa_responsibilities:
            "Design initiative that cements practice reputation in community.",
          client_responsibilities:
            "Choose a cause or long-term partnership.",
          client_instructions:
            "Think big-picture legacy: how do you want to be remembered locally?",
          checklist_items: [
            "Select cause.",
            "Participate in launch.",
          ],
          reflective_question:
            "What’s one change you’d love to see in your community that your practice could help drive?",
        },
        {
          week_number: 42,
          title: "Annual Brand Celebration & Review",
          deliverable: "Annual Brand Celebration & Review",
          woa_responsibilities:
            "Prepare annual report and celebration event.",
          client_responsibilities:
            "Participate in review and help highlight wins.",
          client_instructions:
            "Celebrate the journey: This is the VICTORY LAP.",
          checklist_items: [
            "Join annual review.",
            "Share reflections with team.",
          ],
          reflective_question:
            "If you had to describe your brand’s year in three words, what would they be?",
        },
      ],
    },
  ],
};

// ---------------- CONTROLLER ---------------- //

export const createBrandEstablishmentRoadmap = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // Check if roadmap already exists by name
    const existing = await BrandRoadmap.findOne({
      where: { name: BRAND_ESTABLISHMENT_ROADMAP.name },
      transaction: t,
    });

    if (existing) {
      await t.rollback();
      return ApiResponse.badRequest(
        res,
        "Brand Establishment roadmap already exists."
      );
    }

    // 1) Create roadmap
    const roadmap = await BrandRoadmap.create(
      {
        name: BRAND_ESTABLISHMENT_ROADMAP.name,
        description: BRAND_ESTABLISHMENT_ROADMAP.description,
        total_weeks: BRAND_ESTABLISHMENT_ROADMAP.total_weeks,
        total_months: BRAND_ESTABLISHMENT_ROADMAP.total_months,
        is_active: true,
      },
      { transaction: t }
    );

    // 2) Create phases, weeks, tasks
    for (const phaseData of BRAND_ESTABLISHMENT_ROADMAP.phases) {
      const phase = await BrandPhase.create(
        {
          roadmap_id: roadmap.id,
          name: phaseData.name,
          theme: phaseData.theme,
          phase_order: phaseData.phase_order,
          start_week: phaseData.start_week,
          end_week: phaseData.end_week,
        },
        { transaction: t }
      );

      for (const weekData of phaseData.weeks) {
        const week = await BrandWeek.create(
          {
            roadmap_id: roadmap.id,
            phase_id: phase.id,
            week_number: weekData.week_number,
            title: weekData.title,
            description: null,
            display_label: `Week ${weekData.week_number}`,
            sort_order: weekData.week_number,
          },
          { transaction: t }
        );

        // One task per week (deliverable)
        await BrandTask.create(
          {
            week_id: week.id,
            title: weekData.deliverable,
            description: null,
            is_mandatory: true,
            sort_order: 1,

            // new fields
            woa_responsibilities: weekData.woa_responsibilities,
            client_responsibilities: weekData.client_responsibilities,
            client_instructions: weekData.client_instructions,
            checklist_items: weekData.checklist_items,
            reflective_question: weekData.reflective_question,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    return ApiResponse.created(
      res,
      "Brand Establishment roadmap created successfully.",
      { roadmap_id: roadmap.id }
    );
  } catch (err) {
    await t.rollback();
    console.error("Error creating Brand Establishment roadmap:", err);
    return ApiResponse.serverError(
      res,
      "Failed to create Brand Establishment roadmap.",
      err
    );
  }
};

/**
 * Request task closure - Client requests to mark a task as completed
 * Sends notification and email to WOA officers/admins
 */
export const requestTaskClosure = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    if (!taskId || !userId) {
      return ApiResponse.badRequest(
        res,
        "Task ID and user ID are required"
      );
    }

    // Get the task with associations
    const task = await BrandPlanTask.findByPk(taskId, {
      include: [
        { model: User, as: "completedBy", attributes: ["id", "full_name", "email"] },
        { model: BrandPlanWeek, attributes: ["week_number"] },
      ],
    });

    if (!task) {
      return ApiResponse.notFound(res, "Task not found");
    }

    // Update task with closure request
    await task.update({
      task_closure_requested: true,
      closure_requested_by: userId,
      closure_requested_at: new Date(),
    });

    // Get the requesting user's details
    const requestingUser = await User.findByPk(userId, {
      attributes: ["id", "full_name", "email"],
    });

    // Get business details for the notification context
    const planWeek = await BrandPlanWeek.findByPk(task.plan_week_id, {
      include: [
        {
          model: BrandPlan,
          include: [
            {
              model: Business,
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    const businessName = planWeek?.BrandPlan?.Business?.name || "Business";

    // Get all WOA admin/super admin users
    let adminUsers = await User.findAll({
      where: {
        role: ["admin", "super admin", "superadmin"],
      },
      attributes: ["id", "email", "full_name"],
    });

    // Fallback if no admins found
    if (!adminUsers || adminUsers.length === 0) {
      console.warn("No WOA admin users found");
      adminUsers = [];
    }

    // Prepare notification data
    const adminIds = adminUsers.map(u => u.id);
    const notificationTitle = "Task Closure Request";
    const notificationMessage = `${requestingUser?.full_name || "Client"} from ${businessName} has requested closure for task: "${task.title}"`;

    // Send notifications to all admins
    if (adminIds.length > 0) {
      await notifyMultipleUsers(
        adminIds,
        notificationTitle,
        notificationMessage,
        {
          data: {
            taskId: task.id,
            businessName,
            taskTitle: task.title,
            requestedBy: requestingUser?.full_name,
            requestedEmail: requestingUser?.email,
          },
          saveToDb: true,
          sendRealtime: true,
        }
      );
    }

    // Send emails to all admins
    if (adminUsers.length > 0) {
      const emailSubject = `[Action Required] Task Closure Request - ${task.title}`;
      const emailHtml = `
        <p>Dear WOA Team,</p>
        <p><strong>${requestingUser?.full_name || "A client"}</strong> from <strong>${businessName}</strong> has requested closure for the following task:</p>
        <ul>
          <li><strong>Task Title:</strong> ${task.title}</li>
          <li><strong>Status:</strong> ${task.status}</li>
          <li><strong>Requested By:</strong> ${requestingUser?.full_name} (${requestingUser?.email})</li>
          <li><strong>Requested At:</strong> ${new Date(task.closure_requested_at).toLocaleString()}</li>
        </ul>
        <p>Please review this request and take appropriate action.</p>
        <p>Best regards,<br/>WOA System</p>
      `;

      const adminEmails = adminUsers.map(u => u.email);
      await sendEmail({
        to: adminEmails,
        subject: emailSubject,
        html: emailHtml,
      });
    }

    return ApiResponse.success(
      res,
      "Task closure request submitted successfully. WOA officers have been notified.",
      {
        taskId: task.id,
        taskTitle: task.title,
        closureRequestedAt: task.closure_requested_at,
      }
    );
  } catch (err) {
    console.error("Error requesting task closure:", err);
    return ApiResponse.serverError(
      res,
      "Failed to request task closure.",
      err
    );
  }
};
