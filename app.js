const express = require("express");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users.route");
const postRouter = require("./routes/posts.route");
const commentsRouter = require("./routes/comments.route");
const likeRouter = require("./routes/likes.route");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [userRouter, postRouter, commentsRouter, likeRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
})