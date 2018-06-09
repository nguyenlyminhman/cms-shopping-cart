const express = require('express');
const adminRouter = express.Router();
let Page = require('../models/page');
let { removeSpace } = require('../common/slugHelper');

//[2018.06.01] get dashboard admin
adminRouter.get('/', (req, res) => {
    res.render('index', { ptitle: 'Admin home page...' });
});
//[2018.06.01] get page management 
adminRouter.get('/page', (req, res) => {
    Page.find({}).sort({ 'title': 1 }).exec((err, data) => {
        res.render('page/admin/page', {
            ptitle: 'Page management...',
            breadscrum: 'Page Management',
            page: data
        });
    })

});
//[2018.06.01] get the add new page form
adminRouter.get('/page/add-page', (req, res) => {
    res.render('page/admin/add-page', {
        ptitle: 'Add new page...',
        breadscrum: 'Add new',
        title: '',
        slug: '',
        content: ''
    });
});
//[2018.06.01] post the new page info to database.
adminRouter.post('/page/add-page', (req, res) => {
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('slug', 'Slug must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();
    let { title, slug, content } = req.body;
    let errors = req.validationErrors();
    if (errors) {
        res.render('page/admin/add-page', {
            ptitle: 'Add new page...',
            breadscrum: 'Add new',
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({ slug: removeSpace(slug) }, (err, page) => {
            if (page) {
                req.flash('danger', 'Slug was exist.');
                res.render('page/admin/add-page', {
                    ptitle: 'Add new page...',
                    breadscrum: 'Add new',
                    errors: errors,
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                let page = new Page({
                    title: title,
                    slug: removeSpace(slug),
                    content: content,
                    sorting: 0
                });
                page.save(err => {
                    if (err) {
                        return console.log(err + '');
                    }
                    req.flash('success', 'Page added')
                    res.render('page/admin/add-page', {
                        ptitle: 'Add new page...',
                        breadscrum: 'Add new',
                        errors: errors,
                        title: '',
                        slug: '',
                        content: ''
                    });
                });
            }
        })
    }

});
//[2018.06.01] get the editting page form
adminRouter.get('/page/edit', (req, res) => {
    res.render('page/admin/edit-page', {
        ptitle: 'Editting page ',
        breadscrum: 'Editting: page id here'
    });
});
//[2018.06.01] export the admin router 
module.exports = adminRouter