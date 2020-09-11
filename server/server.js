const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const port = 8001;

router.get(`/`, function (req, res) {
  res.sendFile('./public/index.html', {
    root: '/Users/jamessheppard/Node.js-Meme-Scraper-UpLeveled-2020',
  });
});

app.use(express.static('./public/memes'));

app.use('/', router);
app.listen(process.env.port || `${port}`);
console.log(`Server is running at localhost:${port}.`);
