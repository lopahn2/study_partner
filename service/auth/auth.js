import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sqlCon from "../../db/sqlCon.js";
const conn = sqlCon();
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_TOKEN_URL = process.env.GOOGLE_TOKEN_URL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GOOGLE_TOKEN_DECOMPOSITION_URL =
  process.env.GOOGLE_TOKEN_DECOMPOSITION_URL;

export const signUp = async (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  // client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
  // 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  // 아까 등록한 redirect_uri
  // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
  // 필수 옵션.
  url += "&response_type=code";
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  // url += "&scope=email profile";
  url += "&scope=email";
  // 완성된 url로 이동
  // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
  res.redirect(url);
};

export const signIn = async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);
  try {
    // 첫 번째 비동기 작업
    const resp = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const idToken = resp.data.id_token;
    axios
      .get(`${GOOGLE_TOKEN_DECOMPOSITION_URL}?id_token=${idToken}`)
      .then(async (response) => {
        const email = response.data.email;
        const pwd = response.data.sub;
        const user = {
          email,
          pwd,
        };
        const isSigned = await conn.execute(
          "SELECT * FROM user_auth_info WHERE email = ?",
          [email]
        );
        console.log(isSigned[0]);
        if (isSigned[0].length == 0) {
          await conn.execute("INSERT INTO user_auth_info VALUES (?,?,?,?,?)", [
            null,
            email,
            pwd,
            null,
            null,
          ]);
        }
        // JWT 토큰 생성
        const token = jwt.sign(user, process.env.SECRET);
        console.log(token);

        return res.render("preMain", { token });
      });
  } catch (e) {
    console.log(e);
    return res.json(e);
  }
};
