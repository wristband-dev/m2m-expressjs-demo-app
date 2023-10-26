'use strict';

const express = require('express');

const publicController = require('../controllers/public-controller');

const router = express.Router();

router.get('/data', publicController.getPublicData);

module.exports = router;
