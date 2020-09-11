const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const url = '/Users/jamessheppard/Node.js-Meme-Scraper-UpLeveled-2020/public/';
router.get(`${url}`, function (req, res) {
  res.sendFile('index.html');
});

app.use('/', router);

const localHost = 8001;
app.listen(process.env.port || `${localHost}`);
console.log(`Server is running at localhost:${localHost}.`);
