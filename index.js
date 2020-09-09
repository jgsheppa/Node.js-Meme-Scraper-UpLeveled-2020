const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const generate = require('project-name-generator');

const mainUrl = 'https://memegen.link/examples';

axios
  .get(mainUrl)
  .then((response) => {
    download(concatURLs(parseHTML(response.data)));
  })
  .catch((err) => {
    console.log(err);
  });

/* Parses HTML and returns an array of 
the attribute src within a given class */
const parseHTML = (html) => {
  const $ = cheerio.load(html);
  const urlMeme = $('.meme-img');
  return createMemeArray(urlMeme);
};

// Creates array using object of information from website
const createMemeArray = (meme) => {
  let memeArray = [];
  for (let i = 0; i < 10; i++) {
    memeArray.push(meme[i].attribs.src);
  }
  return memeArray;
};

/* Downloads images with URLs and asigns 
unique names to .jpg files */
async function download(concatArray) {
  const nameArray = [
    'bender',
    'tenguy',
    'afraid',
    'apcr',
    'older',
    'aag',
    'atis',
    'tried',
    'biw',
    'stew',
  ];

  //Writes name of new directory and creates it
  const newFileName = generate().dashed;
  fs.mkdir(`./${newFileName}`, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(`New directory established, beginning download.`);
    }
  });

  for (let i = 0; i < concatArray.length; i++) {
    const response = await fetch(concatArray[i]);
    const buffer = await response.buffer();
    fs.writeFile(`./${newFileName}/${nameArray[i]}.jpg`, buffer, () => {
      if (i < 9) {
        console.log('Downloading...');
      } else if (i === 9) {
        console.log('Finished!');
      }
    });
  }
}

// Concatentates unique path of images to the main URL
const concatURLs = (array) => {
  let urlArray = [];
  const baseUrl = 'https://api.memegen.link/images';
  for (let i = 0; i < array.length; i++) {
    urlArray.push(baseUrl + array[i].toString());
  }
  return urlArray;
};
