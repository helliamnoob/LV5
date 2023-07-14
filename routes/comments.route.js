const express = require("express");
const { Op } = require("sequelize");
const { Posts, Comments, Users } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// 댓글 작성 API (authMiddleware: 사용자 인증)
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  try {
    // 게시글 조회
    const post = await Posts.findOne({ where: { postId } });
    if (!post) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }

    // 댓글 데이터 유효성 검사
    if (!comment || typeof comment !== "string") {
      return res
        .status(412)
        .json({ errorMessage: "댓글의 형식이 올바르지 않습니다." });
    }

    // 새로운 댓글 작성
    await Comments.create({
      UserId: userId,
      PostId: postId,
      comment,
    });

    return res.status(201).json({ message: "댓글 작성에 성공하였습니다." });
  } catch (error) {
    console.error(error);

    // 예외 종류에 따라 에러 메시지 설정
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(403)
        .json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
    }

    return res
      .status(400)
      .json({ errorMessage: "댓글 작성에 실패하였습니다." });
  }
});

// 댓글 조회 API
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;

  try {
    // 댓글 조회
    const comments = await Comments.findAll({
      attributes:['comment','commentId'],
      where: { PostId: postId },
    });

    if (comments.length !== 0) {
      const results = comments.map(comments => {
  
        return {
          comment: comments.comment,
          commentId: comments.commentId
        };
      });
      res.status(200).json({ results })
    } else {
      res.json({ message: "댓글이 존재하지 않습니다." });
    }

    //return res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ errorMessage: "댓글 조회에 실패하였습니다." });
  }
});

// 댓글 상세 조회 API
router.get("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    // 댓글 조회
    const comment = await Comments.findOne({
      where: { commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }

    return res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ errorMessage: "댓글 상세 조회에 실패하였습니다." });

  }
});

// 댓글 수정 API (authMiddleware: 사용자 인증)
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { commentId } = req.params;
  const { comment } = req.body;

  try {
    // 댓글 조회
    const existingComment = await Comments.findOne({ where: { commentId } });
    if (!existingComment) {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }

    // 사용자 인증 및 권한 확인
    if (existingComment.UserId !== userId) {
      return res
        .status(403)
        .json({ message: "댓글을 수정할 권한이 없습니다." });
    }

    // 댓글 수정
    await Comments.update({ comment }, { where: { commentId } });

    return res.status(200).json({ message: "댓글 수정에 성공하였습니다." });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ errorMessage: "댓글 수정에 실패하였습니다." });
  }
});

// 댓글 삭제 API (authMiddleware: 사용자 인증)
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { commentId } = req.params;

  try {
    // 댓글 조회
    const existingComment = await Comments.findOne({ where: { commentId } });
    if (!existingComment) {
      return res.status(404).json({ message: "댓글이 존재하지 않습니다." });
    }

    // 사용자 인증 및 권한 확인
    if (existingComment.UserId !== userId) {
      return res
        .status(403)
        .json({ message: "댓글을 삭제할 권한이 없습니다." });
    }

    // 댓글 삭제
    await Comments.destroy({ where: { commentId } });

    return res.status(200).json({ message: "댓글 삭제에 성공하였습니다." });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ errorMessage: "댓글 삭제에 실패하였습니다." });
  }
});

module.exports = router;
