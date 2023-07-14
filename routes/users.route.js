const express = require("express");
const jwt = require("jsonwebtoken");
const {Users} = require("../models");
const router = express.Router();


//회원가입 API
router.post("/signup", async(req, res) => {
    const{nickname, password, confirm} =req.body;
    const isExitsUser = await Users.findOne({
        where: {
            nickname: nickname,
        }
    });
    if(isExitsUser){
        return res.status(412).json({ message: "이미 존재하는 아이디 입니다."});
    }
    if(password !== confirm) {
        return res.status(412).json({ message: "비밀번호가 일치하지 않습니다."});
    }

    //사용자 테이블에 데이터 삽입
    const user = await Users.create({nickname,password});

    return res.status(201).json({ message: "회원가입에 성공하였습니다."})
})
// 로그인 API
router.post("/login", async(req,res)=> {
    const { nickname, password} = req.body;
    const user = await Users.findOne({
        where: {nickname}
    });

    if(!user){
        return res.status(412).json({message: "해당하는 사용자가 존재하지 않습니다."});
    }
    if(user.password !== password){
        return res.status(400).json({message:"로그인에 실패하였습니다."});
    }

    const token = jwt.sign(
        {userId: user.userId}
    , "customized_secret_key");

    //쿠키발급
    res.cookie("Authorization", `Bearer ${token}`);
    //response 할당
    return res.status(200).json({"token": token})
});


module.exports = router;