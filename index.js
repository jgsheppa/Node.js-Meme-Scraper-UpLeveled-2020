const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');

const mainUrl = 'https://memegen.link/examples';

axios
  .get(mainUrl)
  .then((response) => {
    parseHTML(response.data);
    download();
  })
  .catch((err) => {
    console.log(err);
  });

const parseHTML = (html) => {
  const $ = cheerio.load(html);
  const urlMeme = $('.meme-img');
  console.log(createMemeArray(urlMeme));
};

const createMemeArray = (meme) => {
  let memeArray = [];
  for (let i = 0; i < 10; i++) {
    memeArray.push(meme[i].attribs.src);
  }
  return memeArray;
};

async function download() {
  const baseUrl =
    'https://api.memegen.link/images/tenguy/your_text/goes_here.jpg?preview=true&watermark=none';
  const response = await fetch(baseUrl);
  const buffer = await response.buffer();
  fs.writeFile(`./memes/image.jpg`, buffer, () =>
    console.log('finished downloading!'),
  );
}
