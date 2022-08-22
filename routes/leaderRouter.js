const express = require('express');
const leaderRouter = express.Router();
leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('GET all leaders');
})
.post((req, res) => {
    res.end(`POST/create new leader ${req.body.name} with ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT not supported for /leaders');
})
.delete((req, res) => {
    res.end('DELETE all');
});

leaderRouter.route('/:leaderID')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('content-type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`GET leader ${req.params.leaderID}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST is not supported /leaders/${req.params.leaderID}` )
})
.put((req, res) => {
    res.end(`Updating leader ${req.body.name} with ID ${req.params.leaderID}, description ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`DELETE leader ${req.params.leaderID}`);
});

module.exports = leaderRouter;