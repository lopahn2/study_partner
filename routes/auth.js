import express from "express";
import sqlCon from "../db/sqlCon.js";
import { signUp, signIn } from "../service/auth/auth.js";

import jwt from "jsonwebtoken";

const conn = sqlCon();
const router = express.Router();

router.get("/signUp", signUp);
router.get("/signIn", signIn);
export default router;
