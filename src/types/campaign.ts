import { z } from "zod";

export const CampaignTypeSchema = z.enum([
  "CheckIn",
  "QrCodeCheckIn",
  "Review",
  "Referral",
  "Survey",
]);

export type CampaignType = z.infer<typeof CampaignTypeSchema>;

export const CampaignSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  campaign_type: CampaignTypeSchema,
  reward: z.number(),
  first_time_bonus: z.number(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const CampaignsSchema = z.array(CampaignSchema);

export type Campaigns = z.infer<typeof CampaignsSchema>;
