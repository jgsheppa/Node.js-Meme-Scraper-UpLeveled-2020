const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const generate = require('project-name-generator');

const mainUrl = 'https://memegen.link/examples';

//Arrays used to find and replace text,
//in order to create custom memes

const myMemeTexts = [
  `This_is_Bobby/he_does_drugs`,
  `This_morning_I_woke_up/and_pooped_my_pants`,
  `goat/life`,
  `I_got_a_promotion/cause_my_boss_choked`,
  `surfs_up/brah`,
  `These_are_old_men/they_drink_whiskey`,
  `Imma_eat/you`,
  `I_am_hungry`,
  `Baby,_burger_king_is_the_best`,
  'Your_future/friend',
];

axios
  .get(mainUrl)
  .then((response) => {
    download(
      makeMeme(
        concatURLs(parseHTML(response.data)),
        extractMemeText(parseHTML(response.data)),
        myMemeTexts,
      ),
    );
  })
  .catch((err) => {
    console.log(err);
  });

// Downloads images with URLs and asigns
// unique names to .jpg files
async function download(concatArray) {
  // Writes name of new directory and creates it
  const newFolderName = generate().dashed;

  //Saves images to new folder
  fs.mkdir(`./${newFolderName}`, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `New folder, ${newFolderName}, established, beginning download.`,
      );
    }
  });

  //Creates unique folders for images
  for (let i = 0; i < 10; i++) {
    const response = await fetch(concatArray[i]);
    const buffer = await response.buffer();
    const newFileName = generate().dashed;
    fs.writeFile(`./${newFolderName}/${newFileName}.jpg`, buffer, () => {
      if (i < 9) {
        console.log('Downloading...');
      } else if (i === 9) {
        console.log('Finished!');
      }
    });
  }
}

//Takes in the URLs with original meme text
// and returns new URLs with desired meme text
const makeMeme = (urls, webText, myText) => {
  const newUrls = [];
  for (let i = 0; i < webText.length; i++) {
    newUrls.push(urls[i].replace(webText[i], myText[i]));
  }
  return newUrls;
};

// Concatentates unique path of images to the main URL
const concatURLs = (array) => {
  const urlArray = [];
  const baseUrl = 'https://api.memegen.link/images';
  for (let i = 0; i < array.length; i++) {
    urlArray.push(baseUrl + array[i].toString());
  }
  return urlArray;
};

// Parses HTML and returns an array of
// the attribute src within a given class
const parseHTML = (html) => {
  const $ = cheerio.load(html);
  const urlMeme = $('.meme-img');
  return createMemeArray(urlMeme);
};

// Creates array using object of information from website
const createMemeArray = (meme) => {
  const memeArray = [];
  for (let i = 0; i < 10; i++) {
    memeArray.push(meme[i].attribs.src);
  }
  return memeArray;
};

function extractMemeText(meme) {
  const memeTextArray = [];
  let memeInfo;
  //Takes information from URL needed to change the meme's text
  for (let i = 0; i < meme.length; i++) {
    memeInfo = meme[i]
      .slice(1)
      .split('.')
      .shift()
      .split('/')
      .slice(1)
      .join('/');
    memeTextArray.push(memeInfo);
  }
  return memeTextArray;
}
