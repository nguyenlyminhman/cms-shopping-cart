const express = require('express');
const userRouter = express.Router();


userRouter.get('/', (req,res)=>{
    let slug='';
    let title='';
    let content='';
    res.render('index', {
        title: title,
        slug: slug,
        content: content,
    })
});


module.exports = userRouter;