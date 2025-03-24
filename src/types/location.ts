import { z } from "zod";

export const BusinessHoursSchema = z.object({
  periods: z.array(
    z.object({
      open: z.object({
        day: z.number(),
        time: z.string(),
        hours: z.number(),
        minutes: z.number(),
      }),
      close: z.object({
        day: z.number(),
        time: z.string(),
        hours: z.number(),
        minutes: z.number(),
      }),
    }),
  ),
  open_now: z.boolean(),
  weekday_text: z.array(z.string()),
});

export type BusinessHours = z.infer<typeof BusinessHoursSchema>;

export const CampaignSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  campaign_type: z.string(),
  reward: z.number(),
  first_time_bonus: z.number(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const CampaignsSchema = z.array(CampaignSchema);

export type Campaigns = z.infer<typeof CampaignsSchema>;

export const LocationSchema = z.object({
  name: z.string(),
  uuid: z.string(),
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  business_phone: z.string(),
  business_hours: BusinessHoursSchema,
  website: z.string(),
  support_email: z.string().nullable(),
  description: z.string().nullable(),
  category: z.array(z.number()),
  business_logo: z.string().nullable(),
  photo_1: z.string().nullable(),
  photo_2: z.string().nullable(),
  photo_3: z.string().nullable(),
  photo_4: z.string().nullable(),
  photo_5: z.string().nullable(),
  photo_6: z.string().nullable(),
  photo_7: z.string().nullable(),
  photo_8: z.string().nullable(),
  photo_9: z.string().nullable(),
  photo_10: z.string().nullable(),
  twitter_link: z.string(),
  facebook_link: z.string(),
  instagram_link: z.string(),
  google_maps_link: z.string(),
  external_thumbnail_1: z.string(),
  campaigns: CampaignsSchema,
  communities: z.string().nullable(),
  average_rating: z.number().nullable(),
  is_favorite: z.boolean(),
});

export type Location = z.infer<typeof LocationSchema>;

const typicalBusinessHours = {
  periods: [
    {
      open: {
        day: 0,
        time: "0800",
        hours: 8,
        minutes: 0,
      },
      close: {
        day: 0,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
    {
      open: {
        day: 1,
        time: "0700",
        hours: 7,
        minutes: 0,
      },
      close: {
        day: 1,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
    {
      open: {
        day: 2,
        time: "0700",
        hours: 7,
        minutes: 0,
      },
      close: {
        day: 2,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
    {
      open: {
        day: 3,
        time: "0700",
        hours: 7,
        minutes: 0,
      },
      close: {
        day: 3,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
    {
      open: {
        day: 4,
        time: "0700",
        hours: 7,
        minutes: 0,
      },
      close: {
        day: 4,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
    {
      open: {
        day: 5,
        time: "0700",
        hours: 7,
        minutes: 0,
      },
      close: {
        day: 5,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
    {
      open: {
        day: 6,
        time: "0800",
        hours: 8,
        minutes: 0,
      },
      close: {
        day: 6,
        time: "1700",
        hours: 17,
        minutes: 0,
      },
    },
  ],
  open_now: false,
  weekday_text: [
    "Monday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    "Tuesday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    "Wednesday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    "Thursday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    "Friday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    "Saturday: 8:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    "Sunday: 8:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
  ],
};

const typicalCampaign: Campaign = {
  uuid: "78773b38-a604-4cb8-8391-0f58d761f73c",
  name: "Checkin",
  campaign_type: "CheckIn",
  reward: 0,
  first_time_bonus: 1,
};

const typicalLocation: Location = {
  name: "Lott's Trophies, Awards & Engraving",
  uuid: "9eeae9e7-61af-4942-97b2-7a4869831c0a",
  address1: "224 South 400 West",
  address2: "",
  city: "Lindon",
  state: "UT",
  zip: "84042",
  business_phone: "+1 801-919-4650",
  // business_hours: null,
  business_hours: {
    periods: [
      {
        open: {
          day: 0,
          time: "0800",
          hours: 8,
          minutes: 0,
        },
        close: {
          day: 0,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
      {
        open: {
          day: 1,
          time: "0700",
          hours: 7,
          minutes: 0,
        },
        close: {
          day: 1,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
      {
        open: {
          day: 2,
          time: "0700",
          hours: 7,
          minutes: 0,
        },
        close: {
          day: 2,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
      {
        open: {
          day: 3,
          time: "0700",
          hours: 7,
          minutes: 0,
        },
        close: {
          day: 3,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
      {
        open: {
          day: 4,
          time: "0700",
          hours: 7,
          minutes: 0,
        },
        close: {
          day: 4,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
      {
        open: {
          day: 5,
          time: "0700",
          hours: 7,
          minutes: 0,
        },
        close: {
          day: 5,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
      {
        open: {
          day: 6,
          time: "0800",
          hours: 8,
          minutes: 0,
        },
        close: {
          day: 6,
          time: "1700",
          hours: 17,
          minutes: 0,
        },
      },
    ],
    open_now: false,
    weekday_text: [
      "Monday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
      "Tuesday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
      "Wednesday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
      "Thursday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
      "Friday: 7:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
      "Saturday: 8:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
      "Sunday: 8:00\u202fAM\u2009\u2013\u20095:00\u202fPM",
    ],
  },
  website: "https://lotts.webnode.page/",
  support_email: null,
  description: null,
  // category: [],
  category: [1],
  business_logo:
    "https://gotyou-test.s3.amazonaws.com/media/location/7bf25c72-abc0-4d38-a55f-8269c6a99064/WechatIMG19094.jpg",
  photo_1:
    "https://gotyou-test.s3.amazonaws.com/media/location/9bc2128c-8663-4ee1-ace1-2ca2ea374df4/inside-2.jpg",
  photo_2:
    "https://gotyou-test.s3.amazonaws.com/media/location/9bc2128c-8663-4ee1-ace1-2ca2ea374df4/inside-2.jpg",
  photo_3:
    "https://gotyou-test.s3.amazonaws.com/media/location/7bf25c72-abc0-4d38-a55f-8269c6a99064/bidding-5.png",
  photo_4:
    "https://gotyou-test.s3.amazonaws.com/media/location/9bc2128c-8663-4ee1-ace1-2ca2ea374df4/inside-2.jpg",
  photo_5:
    "https://gotyou-test.s3.amazonaws.com/media/location/9bc2128c-8663-4ee1-ace1-2ca2ea374df4/inside-2.jpg",
  photo_6: null,
  photo_7: null,
  photo_8: null,
  photo_9: null,
  photo_10: null,
  twitter_link: "",
  facebook_link: "",
  instagram_link: "",
  google_maps_link: "",
  external_thumbnail_1:
    "https://lh5.googleusercontent.com/p/AF1QipOMd9Fb3ce_w0QehQbELr9s_ZVK5QDGdjBAGswF=w122-h92-k-no",
  // campaigns: [],
  campaigns: [
    {
      uuid: "78773b38-a604-4cb8-8391-0f58d761f73c",
      name: "Checkin",
      campaign_type: "CheckIn",
      reward: 0,
      first_time_bonus: 1,
    },
    {
      uuid: "ca8532e3-9488-460e-9ae5-1c74eead0f5c",
      name: "referral",
      campaign_type: "Referral",
      reward: 1,
      first_time_bonus: 0,
    },
    {
      uuid: "f9b5a35f-4233-4cef-a257-193a5a5be6b3",
      name: "QRCode Check",
      campaign_type: "QrCodeCheckIn",
      reward: 1,
      first_time_bonus: 1,
    },
    {
      uuid: "63fb3234-6559-4daf-a886-e28e228ccf72",
      name: "OutCheckIn",
      campaign_type: "QrCodeCheckIn",
      reward: 1,
      first_time_bonus: 0,
    },
  ],
  communities: null,
  average_rating: null,
  is_favorite: false,
};

// for testing purposes only
export { typicalLocation, typicalCampaign, typicalBusinessHours };
