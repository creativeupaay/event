export interface userI {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  interests: string[];
  lookingFor: string[];
  company: string;
  institueName: string;
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
