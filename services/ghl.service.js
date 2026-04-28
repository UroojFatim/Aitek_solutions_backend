import { HighLevel } from "@gohighlevel/api-client";

const ghl = new HighLevel({
  privateIntegrationToken: process.env.GHL_SUB_ACCESS_TOKEN,
});

export default ghl;
