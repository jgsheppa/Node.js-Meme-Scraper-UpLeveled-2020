const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const fetch = require('node-fetch');
const generate = require('project-name-generator');

const mainUrl = 'https://memegen.link/examples';

//Arrays used to find and replace text,
//in order to create custom memes
const websiteMemeTexts = [
  'your_text/goes_here',
  `i_don't_know_what_this_meme_is_for/and_at_this_point_i'm_too_afraid_to_ask`,
  `your_text/goes_here`,
  `it's_an_older_meme_sir/but_it_checks_out`,
  `_/aliens`,
  `and_then_i_said/the_exam_will_only_contain_what_we've_covered_in_lectures`,
  `at_least/you_tried`,
  `gets_iced_coffee/in_the_winter`,
  `baby,_you've_got_a_stew_going!`,
  'your_text/goes_here',
];

const myMemeTexts = [
  `This_is_Bobby/he_does_drugs`,
  `This_morning_I_woke_up/and_crapped_my_pants`,
  `Yes/that_goat_is_my_wife`,
  `One_day/a_starship_will_kill_me`,
  `Thiiiiiiissss/Biiiiiiiig`,
  `Reagan/sucks`,
  `Imma_eat/you`,
  `I_found_the/POPPIES`,
  `Baby,_you_just_blue_yourself`,
  'Your_future/husband',
];

axios
  .get(mainUrl)
  .then((response) => {
    download(
      concatURLs(
        makeMeme(parseHTML(response.data), websiteMemeTexts, myMemeTexts),
      ),
    );
  })
  .catch((err) => {
    console.log(err);
  });

// Parses HTML and returns an array of
// the attribute src within a given class
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

// Downloads images with URLs and asigns
// unique names to .jpg files
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

  // Writes name of new directory and creates it
  const newFileName = generate().dashed;
  fs.mkdir(`./${newFileName}`, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(
        `New folder, ${newFileName}, established, beginning download.`,
      );
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

const makeMeme = (urls, webText, myText) => {
  let newUrls = [];
  for (let i = 0; i < webText.length; i++) {
    newUrls.push(urls[i].replace(webText[i], myText[i]));
  }
  return newUrls;
};

/*const findMemeText = (urls) => {
  let newUrls = [];
  for (const value of urls) {
    for (let j = 1; value.length; j++) {
      if (value.charAt(i) === '/' && value.charAt(j) === '.') {
        newUrls.push(value.slice(j));
      }
    }
  }
  return newUrls;
};
*/
