'use strict';

const express = require('express');

const errorHandler = require('./middleware/error-handler');
const publicRoutes = require('./routes/public-routes');
const protectedRoutes = require('./routes/protected-routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/public', publicRoutes);
app.use('/api/protected', protectedRoutes);
app.use(errorHandler);

module.exports = app;
