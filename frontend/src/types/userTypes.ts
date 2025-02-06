export enum GENDER {
  "MALE" = "MALE",
  "FEMALE" = "FEMALE",
  "OTHER" = "OTHER",
}

export interface userI {
  _id: string;
  name: string;
  email: string;
  gender: GENDER;
  interests: string[];
}
