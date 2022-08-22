const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['https://localhost:3000'];
const corsOptionsDelegate = (req, cb) => {
    const corsOptions = {};
    whitelist.includes(req.header('Origin')) ? corsOptions.origin = true : corsOptions.origin = false;
    cb(null, corsOptions);
}

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);