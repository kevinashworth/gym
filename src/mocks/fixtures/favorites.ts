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

export const favorites: RawLocations = [
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
    has_campaign: false,
    address: "114 South 850 East, Lehi Utah",
  },
  {
    uuid: "d131134e-9369-4d6e-9c13-73f197761d66",
    name: "Macey's Lehi",
    distance: 12.269665110261032,
    thumbnail: null,
    has_campaign: true,
    address: "760 East Main Street, Lehi Utah",
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
    uuid: "66db827c-f3a0-431e-ba0c-5bbea06e4472",
    name: "Elevated Grounds Coffee and Espresso",
    distance: 14.624036010739589,
    thumbnail:
      "https://gotyou-test.s3.amazonaws.com/media/location/66db827c-f3a0-431e-ba0c-5bbea06e4472/WX20230706-110535.png",
    has_campaign: false,
    address: "333 South 520 West #190, Lindon UT",
  },
];
