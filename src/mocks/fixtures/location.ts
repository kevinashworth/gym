type Location = {
  name: string;
  uuid: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  business_phone: string | null;
  business_hours: any;
  website: string | null;
  support_email: string | null;
  description: string | null;
  category: any;
  business_logo: string | null;
  photo_1: string | null;
  photo_2: string | null;
  photo_3: string | null;
  photo_4: string | null;
  photo_5: string | null;
  photo_6: string | null;
  photo_7: string | null;
  photo_8: string | null;
  photo_9: string | null;
  photo_10: string | null;
  twitter_link: string;
  facebook_link: string;
  instagram_link: string;
  google_maps_link: string;
  external_thumbnail_1: string | null;
  campaigns: {
    uuid: string;
    name: string;
    campaign_type: string;
    reward: number;
    first_time_bonus: number;
  }[];
  communities: any;
  average_rating: number;
  is_favorite: boolean;
  // latitude: string;
  // longitude: string;
  // google_place_id: string;
  // verified: string | null;
  // special_hours: any;
  // gmb_data: any | null;
  // stripe_customer_id: string | null;
  // stripe_subscription_id: string | null;
  // verified_by: number | null;
  // verification_image_1: string | null;
  // verification_image_2: string | null;
  // merchant_uuid?: string;
  // merchant: string | null;
  // createdDateTime: string;
  // modifiedDateTime: string;
  // deletedDateTime: string | null;
  // deleted: boolean;
  // nickname: string;
  // meta: unknown | null;
  // token_balance: {
  //   token_balance_get: number;
  //   token_balance_gyt: number;
  // };
};

const location: Location = {
  name: "R K Cycle Center",
  uuid: "7bf25c72-abc0-4d38-a55f-8269c6a99064",
  address1: "99 South 600 West Street",
  address2: "",
  city: "Lindon",
  state: "Utah",
  zip: "84042",
  business_phone: "+1 801-796-7400",
  business_hours: null,
  website: null,
  support_email: null,
  description:
    "Utah County's premier modern brewery, offering great food, fun, and beer in a nostalgic Harley Davidson factory setting. A unique destination for craft-beer enthusiasts in Lehi, Utah.",
  category: [],
  // business_logo: null,
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
  external_thumbnail_1: null,
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
  average_rating: 4.428571428571429,
  is_favorite: true,
};

type Keys = keyof Location;

const photos: Keys[] = [
  "photo_1",
  "photo_2",
  "photo_3",
  "photo_4",
  "photo_5",
  "photo_6",
  "photo_7",
  "photo_8",
  "photo_9",
  "photo_10",
];

export { location, type Location, photos };
