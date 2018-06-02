const express = require('express');
const adminRouter = express.Router();

//[2018.06.01] get dashboard admin
adminRouter.get('/', (req, res) => {
    res.render('index', { title: 'Admin home page...' })
})
//[2018.06.01] get page management 
adminRouter.get('/page', (req, res) => {
    res.render('page/admin/page', {
        title: 'Page management...',
        breadscrum: 'Page Management'
    })
})
//[2018.06.01] get the add new page form
adminRouter.get('/page/add-page', (req, res) => {
    res.render('page/admin/add-page', {
        title: 'Add new page...',
        breadscrum: 'Add new'
    })
})

//[2018.06.01] get the editting page form
adminRouter.get('/page/edit', (req, res) => {
    res.render('page/admin/edit-page', {
        title: 'Editting page ',
        breadscrum: 'Editting: page id here'
    })
})
//[2018.06.01] export the admin router 
module.exports = adminRouter