const express = require("express");
const { Op } = require("sequelize");
const { Posts } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


// 게시글 조회 api
router.get("/posts", async (req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: ['postId', 'UserId', 'title', 'content', 'like', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        if (posts.length !== 0) {
            const results = posts.map(post => {
        
              return {
                postId: post.postId,
                title: post.title,
                content: post.content,
                like: post.like,
              };
            });
            res.status(200).json({ results })
          } 
          else {
            res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
          }

    } catch (error) {
        console.error(error);
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});

// 게시글 상세 조회 api
router.get("/posts/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const posts = await Posts.findOne({
            //attributes: ['postId', 'UserId', 'title', 'like', 'content', 'createdAt'],
            where: { postId }
        });
            if (posts.length !== 0) {
                const results = posts;
                res.status(200).json({ results })
            }
    } catch (error) {
        console.error(error);
        return res.status(400).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
});


// 게시글 작성 api (authMiddleware: 사용자 인증)
router.post("/posts", authMiddleware, async (req, res) => {
    //게시글을 생성하는 사용자의 정보를 가지고 올 것.
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    try {
        //유효성 검사
        if (!res.locals.user) {
            return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
        }

        // 게시글 데이터 유효성 검사
        if (!title) {
            return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다." });
        }

        if (!content) {
            return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다." });
        }

        // 새로운 게시물 생성
        const createPost = await Posts.create({
            UserId: userId,
            title,
            content
        });

        return res.status(201).json({ data: "게시글 작성에 성공하였습니다." });
    } catch (error) {
        console.error(error);

        // 예외 종류에 따라 에러 메시지 설정
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
        }

        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});



// 게시글 수정 api
router.put("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const { title, content } = req.body;

    try {
        // 수정할 게시글 조회
        const post = await Posts.findOne({ where: { postId } });
        // 게시글이 존재하지 않을 경우 또는 유저아이디가 맞지 않을 경우 에러 메시지를 보냄
        if (!post) {
            return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        } else if (post.UserId !== userId) {
            return res.status(401).json({ message: "권한이 없습니다." });
        }
        // 게시글의 권한을 확인, 게시글을 수정
        await Posts.update(
            { title, content }, // title, game_title, genre, content 수정
            {
                where: {
                    [Op.and]: [{ postId }, { UserId: userId }]
                }
            }
        );
        return res.status(200).json({ message: "게시글이 수정되었습니다." });
    } catch (error) {
        console.error(error);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
        }

        return res.status(400).json({ errorMessage: "게시글 작성에 실패하였습니다." });
    }
});


// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    try {
        // 삭제할 게시글 조회
        const post = await Posts.findOne({ where: { postId } });

        if (!post) {
            return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
        } else if (post.UserId !== userId) {
            return res.status(401).json({ message: "권한이 없습니다." });
        }

        // 게시글 삭제 권한을 확인, 게시글 삭제
        await Posts.destroy({
            where: {
                [Op.and]: [{ postId }, { UserId: userId }]
            }
        });
        return res.status(200).json({ data: "게시글이 삭제되었습니다." });
    } catch (error) {
        console.error(error);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
        }

        return res.status(400).json({ errorMessage: "게시글 삭제에 실패하였습니다." });
    }
})



module.exports = router;