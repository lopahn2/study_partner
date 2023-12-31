import express from "express";
import sqlCon from "../db/sqlCon.js";
import verifyToken from "../middlewares/accessControl.js";
const conn = sqlCon();
const router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  res.render("main");
});

router.get("/preMain", async function (req, res, next) {
  console.log("hello");
  res.redirect("/main");
});
router.get("/main", async function (req, res, next) {
  res.render("main");
});
router.get("/problem", async function (req, res, next) {
  res.render("problem");
});
export default router;
