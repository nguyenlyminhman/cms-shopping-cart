const express = require('express');
const userRouter = express.Router();


userRouter.get('/', (req,res)=>{
    res.render('index', {title: 'e-commerce home page'})
});


module.exports = userRouter;