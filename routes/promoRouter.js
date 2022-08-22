const express = require('express');
const Promos = require('../Models/promotions');
const promoRouter = express.Router();

promoRouter.route('/')
    .get(async (req, res) => {
        try {
            const promo = await Promos.find();
            res.status(200).json(promo);
        } catch (err) {
            res.json(err);
        }

    })
    .post(async (req, res, next) => {
        try {
            const promo = await Promos.create(req.body);
            res.status(200).json(promo);
        } catch (err) {
            next(err);
        }
    })
    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT is not supported');
    })
    .delete((req, res) => {
        res.end('DELETE all promos');
    });
promoRouter.route('/:promoID')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('content-type', 'text/plain');
        next();
    })
    .get((req, res) => {
        res.end(`GET promo ${req.params.promoID}`);
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end('POST is not supported');
    })
    .put((req, res) => {
        res.end(`Update promo ${req.params.promoID} with ${req.body.description}`);
    })
    .delete((req, res) => {
        res.end(`DELETE promo ${req.params.promoID}`);
    });
module.exports = promoRouter;
