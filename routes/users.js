var express = require('express');
var router = express.Router();
const Users = require('../Models/users');
const passport = require('passport');
const authenticate = require('../authenticate');
const {authenticateLocal} = require("../authenticate");

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, async function (req, res, next) {
    const users = await Users.find({});
    res.json(users);
});

router.post('/signup', async (req, res, next) => {
    try {
        //const newUser = new Users({admin: req.body.admin, username: req.body.username});
        const {username} = req.body;
        const newUser = await Users.register(new Users({admin: req.body.admin, username: username.trim()}), req.body.password);

        if(req.body.firstname) newUser.firstname = req.body.firstname;
        if(req.body.lastname) newUser.lastname = req.body.lastname;
        await newUser.save();
        passport.authenticate('local')(req, res, () => {
            res.status(200).json({user: req.body.username});
        });
    } catch (err) {
        next(err);
    }
});

router.post('/login', authenticateLocal , (req, res) => {
    const token = authenticate.getToken({_id: req.user._id});
    res.status(200).json({success: true, token});
});
router.post('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/facebook/token', passport.authenticate('facebook-token', {session: false}), (req, res) => {
    if(req.user) {
        const token = authenticate.getToken({_id: req.user._id});
        res.status(200).json({success: true, token});
    }
});
module.exports = router;
