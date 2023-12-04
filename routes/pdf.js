import express from "express";
import sqlCon from "../db/sqlCon.js";
import verifyToken from "../middlewares/accessControl.js";
import pdf2md from "@opendocsg/pdf2md";
import multer from "multer";
import dotenv from "dotenv";
import axios from "axios";
import OpenAIApi from "openai";
import Configuration from "openai";

dotenv.config();
const conn = sqlCon();
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const gptURL = process.env.GPT_COMPLETION_REQUEST_URL;

const configuration = new Configuration({
  apiKey: process.env.GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);
const questions = [];
router.post("/upload", upload.single("pdfFile"), (req, res) => {
  // 업로드된 파일은 req.file.buffer에 저장됨
  const pdfBuffer = req.file.buffer;
  pdf2md(pdfBuffer)
    .then(async (text) => {
      const messages = [
        {
          role: "system",
          content:
            "Create 10 multiple-choice questions based on the text provided by the user. The text is in markdown format, and the concepts follow the categories of markdown. For example, in the case of # School ## Student ### younghwan ## Teacher ### Jason, it means that there are Student and Teacher under School, younghwan under Student, and Jason under Teacher. Multiple-choice questions should have only one correct answer, and there should be 5 options for each question. Also, since the questions need to be used on the server, you must provide them in JSON format.",
        },
        { role: "user", content: `${text}` },
      ];
      console.log("문제가 생성중입니다.");
      // const completion = await openai.chat.completions.create({
      //   messages,
      //   model: "gpt-4",
      // });
      // questions.push(JSON.parse(completion.choices[0].message.content));
      questions.push([
        {
          question:
            "What is the main purpose of design in software development process?",
          options: [
            "To apply various techniques and principles to define a system in enough detail for its physical realization",
            "To code the software",
            "To troubleshoot the software",
            "To sell the software",
            "To use the software",
          ],
          answer:
            "To apply various techniques and principles to define a system in enough detail for its physical realization",
        },
        {
          question: "What does design process convert in software development?",
          options: [
            "The design of the software to code",
            "The 'what' of the requirements to the 'how' of design",
            "The bugs in the software to solutions",
            "The software to a physical product",
            "The needs of the user to software features",
          ],
          answer: "The 'what' of the requirements to the 'how' of design",
        },
      ]);
      return res.status(200).json({ data: "success" });
    })
    .catch((err) => {
      console.error(err);
    });
  // 여기에서 필요한 처리를 수행하고 클라이언트에 응답을 보낼 수 있음
});

router.get("/problem", async (req, res) => {
  console.log("hello");
  console.log(questions);
  const data = {
    title: "Study Partner",
    data: questions[0],
  };

  res.render("problem.html", { data });
});
export default router;
