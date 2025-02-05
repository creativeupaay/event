import { JwtPayload } from "jsonwebtoken";


interface TokenPayload {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any; 
      admin?:JwtPayload;
      organization?:any;
    }
  }
}