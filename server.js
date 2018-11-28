const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const blogPostRouter = require('./blogPostRouter');

app.use('/blog-post', blogPostRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
})