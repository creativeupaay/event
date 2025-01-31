import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";

// submitting the user info and putting it in the database
export const submitFormData = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
