const express = require('express');
const adminRouter = express.Router();
const mkdir = require('mkdirp');
const resizeImage = require('resize-img');
const fse = require('fs-extra')
let Page = require('../models/page');
let Category = require('../models/category');
let Product = require('../models/product');
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
//[2018.06.11] export the admin router 
adminRouter.get('/category', (req, res) => {
    Category.find({}).sort({ 'sorting': 1 }).exec((err, data) => {
        res.render('page/admin/category', {
            ptitle: 'Page management...',
            breadscrum: 'Page Management',
            page: data
        });
    })
})
//[2018.06.01] get the add new page form
adminRouter.get('/category/add-category', (req, res) => {
    res.render('page/admin/add-category', {
        ptitle: 'Add category...',
        breadscrum: 'Add new',
        name: '',
        slug: ''
    });
});
//[2018.06.01] post the new page info to database.
adminRouter.post('/category/add-category', (req, res) => {
    req.checkBody('name', 'Category name must have a value.').notEmpty();
    req.checkBody('slug', 'Slug must have a value.').notEmpty();
    let { name, slug } = req.body;
    let errors = req.validationErrors();
    if (errors) {
        res.render('page/admin/add-category', {
            ptitle: 'Add new page...',
            breadscrum: 'Add new',
            errors: errors,
            name: name,
            slug: slug
        });
    } else {
        Category.findOne({ slug: removeSpace(slug) }, (err, cate) => {
            if (cate) {
                req.flash('danger', 'Slug was exist.');
                res.render('page/admin/add-page', {
                    ptitle: 'Add new page...',
                    breadscrum: 'Add new',
                    errors: errors,
                    name: name,
                    slug: slug
                });
            } else {
                let cate = new Category({
                    name: name,
                    slug: removeSpace(slug)
                });
                cate.save(err => {
                    if (err) {
                        return console.log(err + '');
                    }
                    req.flash('success', 'Category added')
                    res.render('page/admin/add-category', {
                        ptitle: 'Add new category...',
                        breadscrum: 'Add new',
                        errors: errors,
                        name: '',
                        slug: ''
                    });
                });
            }
        })
    }
});
//[2018.06.01] get the editting page form
adminRouter.get('/category/edit/:id', (req, res) => {
    //[2018.06.10] get the page information form
    let { id } = req.params;
    Category.findById(id, (err, cate) => {
        res.render('page/admin/edit-category', {
            ptitle: 'Category | Edit...',
            breadscrum: 'Category _id: ' + cate._id,
            id: cate._id,
            name: cate.name,
            slug: cate.slug
        });
    })

});
//[2018.06.10] get the editting page form
adminRouter.post('/category/edit/:id', (req, res) => {
    //check null value
    req.checkBody('name', 'Category name must have a value.').notEmpty();
    req.checkBody('slug', 'Slug must have a value.').notEmpty();
    let errors = req.validationErrors();
    //get value from edit form
    let { id, name, slug } = req.body;
    //send error to edit-page.
    if (errors) {
        res.render('page/admin/edit-category', {
            ptitle: 'Category | Edit...',
            breadscrum: 'Category _id: ' + id,
            id: id,
            errors: errors,
            name: name,
            slug: slug
        });
    } else {
        //get slug base on its _id to compare to the slug get from form. 
        Category.findOne({ _id: id }, (err, cate) => {
            //the slug was change
            if (cate.slug !== slug) {
                //Find new slug in database.
                Category.findOne({ slug: slug }, (err, cate) => {
                    //If exist
                    if (cate) {
                        //send to edit page.
                        req.flash('danger', 'Slug was exist.');
                        res.render('page/admin/edit-category', {
                            ptitle: 'Category | Edit...',
                            breadscrum: 'Category _id: ' + id,
                            errors: errors,
                            id: id,
                            name: name,
                            slug: slug
                        });
                    } else {
                        //Find the page base on its id.
                        Category.findById({ _id: id }, (err, cate) => {
                            if (err)
                                console.log(err + '');
                            //assign new value    
                            cate.name = name;
                            cate.slug = slug;
                            //save to database.
                            cate.save(err => {
                                if (err) {
                                    return console.log(err + '');
                                }
                                req.flash('success', 'Page updated')
                                res.render('page/admin/edit-category', {
                                    ptitle: 'Category || Edit...',
                                    breadscrum: 'Edit...',
                                    errors: errors,
                                    id: id,
                                    name: name,
                                    slug: slug
                                });
                            });
                        })
                    }
                });
                //the slug is the same id.
            } else {
                //the slug is not change
                Category.findById({ _id: id }, (err, cate) => {
                    if (err)
                        console.log(err + '');
                    cate.name = name;
                    cate.slug = slug;
                    cate.save(err => {
                        if (err) {
                            return console.log(err + '');
                        }
                        req.flash('success', 'Category name has updated')
                        res.render('page/admin/edit-category', {
                            ptitle: 'Category || Edit...',
                            breadscrum: 'Edit...',
                            errors: errors,
                            id: id,
                            name: name,
                            slug: slug
                        });
                    });
                })

            }
        }
        )
    }
})

adminRouter.get('/category/delete/:id', (req, res) => {
    let { id } = req.params;
    Category.findByIdAndRemove({ _id: id }, (err, cate) => {
        if (err)
            console.log(err + '');
        req.flash('success', 'Page removed');
        // res.redirect('/admin/page')
        Category.find({}).sort({ 'name': 1 }).exec((err, data) => {
            res.render('page/admin/category', {
                ptitle: 'Category management...',
                breadscrum: 'Category Management',
                page: data
            });
        })
    })
})
//[2018/06/23] building the product router.
adminRouter.get('/product', (req, res) => {
    Product.find({}).exec((err, data) => {
        res.render('page/admin/product', {
            ptitle: 'CMS || Product',
            breadscrum: 'Product Management',
            product: data
        });
    });
});
//[2018.06.24] get the add new product form
adminRouter.get('/product/add-product', (req, res) => {
    Category.find().exec((err, data) => {
        res.render('page/admin/add-product', {
            ptitle: 'CMS || Product',
            breadscrum: 'Add new',
            cate: data,
            name: '',
            slug: '',
            price: '',
            desc: ''
        });
    })
});
//[2018.06.01] post the new page info to database.
adminRouter.post('/product/add-product', (req, res) => {

    let imageFiles = typeof req.files.images !== "undefined" ?  req.files.images.name : "";
    req.checkBody('category', 'Category must have a value.').notEmpty();
    req.checkBody('name', 'Product name must have a value.').notEmpty();
    req.checkBody('slug', 'Slug must have a value.').notEmpty();
    req.checkBody('price', 'Price must have a number.').isDecimal();
    req.checkBody('description', 'Description must have a value.').notEmpty();
    // req.checkBody('images', 'Image must have a value.').notEmpty();
    
    let { category, name, slug, price, description, images } = req.body;
    console.log(images)
    let errors = req.validationErrors();
    
    if (errors) {
        Category.find().exec((err, data) => {
            res.render('page/admin/add-product', {
                ptitle: 'CMS || Product',
                breadscrum: 'Add new',
                cate: data,
                errors: errors,
                name: name,
                slug: slug,
                price: price,
                desc: description
            });
        });
    } else {
        Product.findOne({ slug: removeSpace(slug) }, (err, product) => {
            if (product) {
                req.flash('danger', 'Slug was exist.');
                Category.find().exec((err, data) => {
                    res.render('page/admin/add-product', {
                        ptitle: 'CMS || Product',
                        breadscrum: 'Add new',
                        cate: data,
                        errors: errors,
                        name: name,
                        slug: slug,
                        price: price,
                        desc: description
                    });
                });
            } else {
                let product = new Product({
                    name: name,
                    slug: removeSpace(slug),
                    desc: description,
                    category: category,
                    price: price,
                    image: images
                });
                product.save(err => {
                    if (err) {
                        return console.log(err + '');
                    }
                    req.flash('success', 'Product added')
                    Category.find().exec((err, data) => {
                        res.render('page/admin/add-product', {
                            ptitle: 'CMS || Product',
                            breadscrum: 'Add new',
                            cate: data,
                            errors: errors,
                            name: '',
                            slug: '',
                            price: '',
                            desc: ''
                        });
                    });
                });
            }
        })
    }
    
});

adminRouter.get('/product/delete/:id', (req, res) => {
    let { id } = req.params;
    Product.findByIdAndRemove({ _id: id }, (err, cate) => {
        if (err)
            console.log(err + '');
        req.flash('success', 'Product removed');
        // res.redirect('/admin/page')
        Product.find({}).sort({ 'name': 1 }).exec((err, data) => {
            res.render('page/admin/product', {
                ptitle: 'Product management...',
                breadscrum: 'Product Management',
                product: data
            });
        })
    })
})
//[2018.06.01] export the admin router 
module.exports = adminRouter