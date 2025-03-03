export interface userI {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  industry: string[];
  interests: string[];
  lookingFor: string[];
  company: string;
  instituteName: string;
  courseName: string;
  profession: string;
  position: string;
  requestSent: number;
  requestReceived: number;
  status: string;
  contactNumber: string;
  connections: number;
}

export interface userLevelDataI {
  badgeName: string;
  level: number;
  subText: string;
}
