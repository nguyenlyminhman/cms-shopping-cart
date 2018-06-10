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
    Page.find({}).sort({ 'sorting': 1 }).exec((err, data) => {
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
//[2018.06.10] post to reorder page
adminRouter.post('/page/reorder', (req, res) => {
    let ids = req.body;
    let count = 0;
    for (var i = 0; i < ids.id.length; i++) {
        var id = ids.id[i];
        count++;
        (function (count) {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save(err => {
                    if (err) {
                        return console.log(err + '');
                    }
                })
            })
        })(count);
    }
});
//[2018.06.01] get the editting page form
adminRouter.get('/page/edit/:id', (req, res) => {
    //[2018.06.10] get the page information form
    let { id } = req.params;
    Page.findById(id, (err, page) => {
        res.render('page/admin/edit-page', {
            ptitle: 'Page | Edit ',
            breadscrum: 'Page _id: ' + page._id,
            id: page._id,
            title: page.title,
            slug: page.slug,
            content: page.content
        });
    })

});

//[2018.06.10] get the editting page form
adminRouter.post('/page/edit/:id', (req, res) => {
    //check null value
    req.checkBody('title', 'Title must have a value.').notEmpty();
    req.checkBody('slug', 'Slug must have a value.').notEmpty();
    req.checkBody('content', 'Content must have a value.').notEmpty();
    let errors = req.validationErrors();
    //get value from edit form
    let { id, title, slug, content } = req.body;
    //send error to edit-page.
    if (errors) {
        res.render('page/admin/edit-page/' + id, {
            ptitle: 'Page | Edit',
            breadscrum: 'Page _id: ' + id,
            id: id,
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        //get slug base on its _id to compare to the slug get from form. 
        Page.findOne({ _id: id }, (err, page) => {
            //the slug was change
            if (page.slug !== slug) {
                //Find new slug in database.
                Page.findOne({ slug: slug }, (err, page) => {
                    //If exist
                    if (page) {
                        //send to edit page.
                        req.flash('danger', 'Slug was exist.');
                        res.render('page/admin/edit-page', {
                            ptitle: 'Page | Edit',
                            breadscrum: 'Page _id: ' + id,
                            errors: errors,
                            id: id,
                            title: title,
                            slug: slug,
                            content: content
                        });
                    } else {
                        //Find the page base on its id.
                        Page.findById({ _id: id }, (err, page) => {
                            if (err)
                                console.log(err + '');
                            //assign new value    
                            page.title = title;
                            page.slug = slug;
                            page.content = content
                            //save to database.
                            page.save(err => {
                                if (err) {
                                    return console.log(err + '');
                                }
                                req.flash('success', 'Page updated')
                                res.render('page/admin/edit-page', {
                                    ptitle: 'Add new page...',
                                    breadscrum: 'Add new',
                                    errors: errors,
                                    id: id,
                                    title: title,
                                    slug: slug,
                                    content: content
                                });
                            });
                        })
                    }
                });
                //the slug is the same id.
            } else {
                //the slug is not change
                Page.findById({ _id: id }, (err, page) => {
                    if (err)
                        console.log(err + '');
                    page.title = title;
                    page.slug = slug;
                    page.content = content
                    page.save(err => {
                        if (err) {
                            return console.log(err + '');
                        }
                        req.flash('success', 'Page updated')
                        res.render('page/admin/edit-page', {
                            ptitle: 'Add new page...',
                            breadscrum: 'Add new',
                            errors: errors,
                            id: id,
                            title: title,
                            slug: slug,
                            content: content
                        });
                    });
                })

            }
        }
        )
    }

})

adminRouter.get('/page/delete/:id', (req, res) => {
    let { id } = req.params;
    Page.findByIdAndRemove({ _id: id }, (err, page) => {
        if (err)
            console.log(err + '');
        req.flash('success', 'Page removed');
        // res.redirect('/admin/page')
        Page.find({}).sort({ 'sorting': 1 }).exec((err, data) => {
            res.render('page/admin/page', {
                ptitle: 'Page management...',
                breadscrum: 'Page Management',
                page: data
            });
        })
    })
})

//[2018.06.01] export the admin router 
module.exports = adminRouter