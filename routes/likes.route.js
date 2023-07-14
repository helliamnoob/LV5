const express = require('express');
const router = express.Router();
const { Users , Posts, Likes } = require('../models');
const { Op } = require('sequelize');
const authMiddleware = require("../middlewares/auth-middleware");

//게시글 좋아요 조회
router.get('/like', authMiddleware, async (req, res) => {
    // posts/like 로 하니까 게시판의 posts/:postId 로 읽혀져서 api url 바꿈
  const { userId } = res.locals.user;

  const posts = await Likes.findAll({
    where: { UserId: userId },
    include: [
      {
        model: Posts,
        include: [
          {
            model: Users,
            attributes: ['nickname'],
          },
        ],
      },
    ],
    order: [[Posts, 'like', 'DESC']],
    attributes: [],
  });

  return res.status(200).json({ posts });
});

//게시글 좋아요 
router.put('/posts/:postId/like', authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const { userId } = res.locals.user;
  
    const post = await Posts.findOne({ where: { postId: postId } });
  
    const like = await Likes.findOne({
      where: {
        [Op.and]: [{ PostId: postId }, { UserId: userId }],
      },
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        errorMessage: '해당 게시글을 찾을 수 없습니다.',
      });
    } else if (!like) {
      await Posts.update({ like: post.like + 1 }, { where: { postId: post.postId } });
  
      await Likes.create({
        PostId: postId,
        UserId: userId,
      });
      return res.status(200).json({ message: '게시글에 좋아요를 눌렀습니다.' });
    } else if (like) {
      await Posts.update({ like: post.like - 1 }, { where: { postId: post.postId } });
  
      await Likes.destroy({
        where: {
          [Op.and]: [{ PostId: postId }, { UserId: userId }],
        },
      });
  
      return res.status(400).json({
        errorMessage: '좋아요가 취소되었습니다.',
      });
    }
  });
  
  
  module.exports = router;