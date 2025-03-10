// see def raw_locations(locations) in gy_user/helpers/locations.py

export type RawLocation = {
  uuid: string;
  name: string;
  distance: number;
  thumbnail: string | null;
  has_campaign: boolean;
  address: string;
};

export type RawLocations = RawLocation[];

export const suggested: RawLocations = [
  {
    uuid: "813fe353-8e44-4daf-bf1c-85881305eddd",
    name: "Stuff by Steve",
    distance: 13.20720619225606,
    thumbnail: null,
    has_campaign: true,
    address: "1177 W Meadowbrook Ln, Lehi UT",
  },
  {
    uuid: "2ad6a485-6645-4393-87b0-c511b991b4b7",
    name: "Strap Tank Brewery",
    distance: 11.209111283927907,
    thumbnail:
      "https://lh5.googleusercontent.com/p/AF1QipOaKFAD3pgliQ3gvJ72HmfRH8PEDawn2sTsnXEY=w122-h92-k-no",
    has_campaign: false,
    address: "3661 Outlet Pkwy, Lehi UT",
  },
  {
    uuid: "0891909d-51c4-47e1-a99a-4f1111a32638",
    name: "Paco's Tacos",
    distance: 12.208368786873834,
    thumbnail:
      "https://lh5.googleusercontent.com/p/AF1QipOosmqDuqFLoSJQIRnnfJF41aCdkqkHd8foIc3G=w122-h92-k-no",
    has_campaign: true,
    address: "114 South 850 East, Lehi Utah",
  },
  {
    uuid: "d131134e-9369-4d6e-9c13-73f197761d66",
    name: "Macey's Lehi",
    distance: 12.269665110261032,
    thumbnail:
      "https://lh5.googleusercontent.com/p/AF1QipMWXJp9VNn3l-au7_TU41G1Nf92nP-n4bgozCoc=w163-h92-k-no",
    has_campaign: false,
    address: "760 East Main Street, Lehi Utah",
  },
  {
    uuid: "4047f274-985e-48b2-802a-075459b6805f",
    name: "Dutch Bros Coffee",
    distance: 12.917818170136732,
    thumbnail:
      "https://lh5.googleusercontent.com/p/AF1QipOvEGhPVYPy04XEsgyH18XdGTa-0TCsH4MHz439=w80-h106-k-no",
    has_campaign: false,
    address: "442 South Pleasant Grove Boulevard, Pleasant Grove UT",
  },
  {
    uuid: "893fb1bc-c644-4fc7-8dca-6a3ed50ec5d0",
    name: "Bob\u2019s Petlandia",
    distance: 13.615623394375389,
    thumbnail:
      "https://gotyou-test.s3.amazonaws.com/media/location/893fb1bc-c644-4fc7-8dca-6a3ed50ec5d0/dummy1.png",
    has_campaign: false,
    address: "677 N. State St., Lindon UT",
  },
  {
    uuid: "7bf25c72-abc0-4d38-a55f-8269c6a99064",
    name: "R K Cycle Center",
    distance: 14.3306891884711,
    thumbnail:
      "https://gotyou-test.s3.amazonaws.com/media/location/7bf25c72-abc0-4d38-a55f-8269c6a99064/WechatIMG19094.jpg",
    has_campaign: true,
    address: "99 South 600 West Street, Lindon Utah",
  },
  {
    uuid: "9eeae9e7-61af-4942-97b2-7a4869831c0a",
    name: "Lott's Trophies, Awards & Engraving",
    distance: 14.600509474804225,
    thumbnail:
      "https://lh5.googleusercontent.com/p/AF1QipOMd9Fb3ce_w0QehQbELr9s_ZVK5QDGdjBAGswF=w122-h92-k-no",
    has_campaign: false,
    address: "224 South 400 West, Lindon UT",
  },
  {
    uuid: "66db827c-f3a0-431e-ba0c-5bbea06e4472",
    name: "Elevated Grounds Coffee and Espresso",
    distance: 14.624036010739589,
    thumbnail:
      "https://gotyou-test.s3.amazonaws.com/media/location/66db827c-f3a0-431e-ba0c-5bbea06e4472/WX20230706-110535.png",
    has_campaign: false,
    address: "333 South 520 West #190, Lindon UT",
  },
  {
    uuid: "db433d34-1489-474d-9229-42bd4f6ced81",
    name: "Hama Sushi",
    distance: 14.791660764922312,
    thumbnail: null,
    has_campaign: false,
    address: "153 West Crossroads Boulevard Suite E, Saratoga Springs Utah",
  },
];
