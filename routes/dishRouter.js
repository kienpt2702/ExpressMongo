const express = require("express");
const Dishes = require('../Models/dishes');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
const authenticate = require('../authenticate');
const {verifyUser} = require("../authenticate");


dishRouter.route ("/")
    .get(authenticate.verifyUser, async(req, res, next) => {
        try{
            const dishes = await Dishes.find({}).populate('comments.author');
            res.status(200).json(dishes);
        }
        catch (err){
            next(err);
        }
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.create(req.body)
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, err => next(err))
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Dishes.remove({})
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, err => next(err))
            .catch(err => next(err));
    });
dishRouter.route("/:dishID")
    .get(authenticate.verifyUser, async(req, res, next) => {
        try{
            const dish = await Dishes.findById(req.params.dishID).populate('comments.author');
            res.status(200).json(dish);
        }catch (err){
            res.json(err);
        }

    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST is not supported for /dishes/${req.params.dishID}`);
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishID, {$set: req.body}, {new: true})
            .then(dish => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishID)
            .then(resp => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            })
            .catch(err => next(err));
    });
dishRouter.route('/:dishID/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishID)
            .then(dish => {
                if (dish == null) {
                    err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            })
            .catch(err => next(err));
    })
    .post(verifyUser, async (req, res, next) => {
        try {
            const dish = await Dishes.findById(req.params.dishID);
            if(!dish) res.status(404);
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            const updated = await dish.save();
            res.status(200);
        }catch (err) {
            next(err);
        }

    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end(`PUT is not supported at /dishes/${req.params.dishID}/comments`);
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishID)
            .then(dish => {
                if (dish == null) {
                    err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    return next(err);
                }
                dish.comments = [];
                dish.save()
                    .then(dish => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })
                    .catch(err => next(err));
            })
    });
dishRouter.route('/:dishID/comments/:commentID')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishID)
            .then(dish => {
                if(dish == null){
                    err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    return next(err);
                }
                if(dish.comments.id(req.params.commentID) == null){
                    err = new Error('Comment ' + req.params.commentID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentID));
            })
            .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST is not supported at /dishes/${req.params.dishID}/comments/${req.params.commentID}`);
    })
    .put((req, res, next) => {
        Dishes.findById(req.params.dishID)
            .then(dish => {
                if(dish == null){
                    err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    return next(err);
                }
                if(dish.comments.id(req.params.commentID) == null){
                    err = new Error('Comment ' + req.params.commentID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                if(req.body.rating) dish.comments.id(req.params.commentID).rating = req.body.rating;
                if(req.body.comment) dish.comments.id(req.params.commentID).comment = req.body.comment;
                dish.save()
                    .then(dish => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })
                    .catch(err => next(err));
            })
            .catch(err => next(err));
    })
    .delete((req, res, next) => {
        Dishes.findById(req.params.dishID)
            .then(dish => {
                if(dish == null){
                    err = new Error(`Dish ${req.params.dishID} not found`);
                    err.status = 404;
                    return next(err);
                }
                if(dish.comments.id(req.params.commentID) == null){
                    err = new Error('Comment ' + req.params.commentID + ' not found');
                    err.status = 404;
                    return next(err);
                }
                dish.comments.id(req.params.commentID).remove();
                dish.save()
                    .then(dish => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })
            })
            .catch(err => next(err));
    })
module.exports = dishRouter;
