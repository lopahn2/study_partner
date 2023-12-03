import express from "express";
import sqlCon from "../db/sqlCon.js";
import verifyToken from "../middlewares/accessControl.js";
import pdf2md from "@opendocsg/pdf2md";
import multer from "multer";
const conn = sqlCon();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* GET home page. */
router.post("/upload", verifyToken, upload.single("pdfFile"), (req, res) => {
  // 업로드된 파일은 req.file.buffer에 저장됨
  console.log("hi");
  const pdfBuffer = req.file.buffer;
  console.log(pdfBuffer);
  pdf2md(pdfBuffer)
    .then((text) => {
      return res.status(200).json({ text });
    })
    .catch((err) => {
      console.error(err);
    });
  // 여기에서 필요한 처리를 수행하고 클라이언트에 응답을 보낼 수 있음
});

export default router;
