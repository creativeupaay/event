import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";

const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export default login;
