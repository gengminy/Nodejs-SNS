const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = null;
    res.locals.followerCount = 0;
    res.locals.follwingCount = 0;
    res.locals.follwerIdList = [];
    next();
});

router.get('/profile', (req, res) => {
    res.render('profile', {title: '내 정보 - nodebird'});
});

router.get('/join', (req, res) => {
    res.render('join', {title: '회원가입 - nodebird'});
});

router.get('/', (req, res, next) => {
    const twits = [];
    res.render('main', {
        title: 'NodeBird',
        twits,
    });
});

module.exports = router;
