const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res, next) => {
    const locale = req.params.locale;
    const goTo = req.get('referer');
    res.cookie('nodepop-locale', locale, { maxAge: 1000 * 60 * 60 * 24 * 20 });
    res.redirect(goTo);
});

module.exports = router;