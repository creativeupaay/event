export enum GENDER {
  "MALE" = "MALE",
  "FEMALE" = "FEMALE",
  "OTHER" = "OTHER",
}

export interface userI {
  _id: string;
  name: string;
  email: string;
  interests: string[];
  lookingFor: string[];
  company: string;
  institueName: string;
  courseName: string;
  profession: string;
  position: string;
}
