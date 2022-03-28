var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require('./config.js');
var cron = require('node-cron');
var jokes = require('./jokes.js');
var memes = require('./memes.js');



// to deploy:
// git push heroku <branchname>:master

// heroku UN: raddadsbottwitter@gmail.com

var T = new Twit(config);

console.log('config', config)

let usedJokes = []

let imagesGM = [
  '01.png',
  '02.png',
  '03.png',
  '04.png',
  '05.png',
  '06.png',
  '07.png',
  '08.png',
  '09.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  '14.png',
  '15.png',
  '16.png',
  '17.png',
  '18.png',
  '19.png',
  '20.png',
  '21.png',
  '22.png',
  '23.png',
  '24.png',
  '25.png',
  '26.png',
  '27.png',
  '28.png',
  '29.png',
  '30.png',
  '31.png',
  '32.png',
  '33.png',
  '34.png',
  '35.png',
  '36.png',
  '37.png',
  '38.png',
  '39.png',
  '40.png',
  '41.png',
  '42.png',
  '43.png',
  '44.png',
  '45.png',
  '46.png',
  '47.png'
]

let imagesArray = [
  '01.png',
  '02.png',
  '03.png',
  '04.png',
  '05.png',
  '06.png',
  '07.png',
  '08.png',
  '09.png',
  '10.png',
  '11.png',
  '12.png',
  '13.png',
  '14.png',
  '15.png',
  '16.png',
  '17.png',
  '18.png',
  '19.png',
  '20.png',
  '21.png',
  '22.png',
  '23.png',
  '24.png',
  '25.png',
  '26.png',
  '27.png',
  '28.png',
  '29.png',
  '30.png',
  '31.png',
  '32.png',
  '33.png',
  '34.png',
  '35.png',
  '36.png',
  '37.png',
  '38.png',
  '39.png',
  '40.png',
  '41.png',
  '42.png',
  '43.png',
  '44.png',
  '45.png',
  '46.png',
  '47.png',
  '48.png',
  '49.png',
  '50.png',
  '51.png',
  '52.png',
  '53.png',
  '54.png',
  '55.png',
  '56.png',
  '57.png',
  '58.png',
  '59.png',
  '60.png',
  '61.png',
  '62.png',
  '63.png',
  '64.png',
  '65.png',
  '66.png',
  '67.png',
  '68.png',
  '69.png',
  '70.png',
  '71.png',
  '72.png',
  '73.png',
  '74.png',
  '75.png',
  '76.png',
  '77.png',
  '78.png',
  '79.png',
  '80.png',
  '81.png'
]



function random_from_array(jokes){
  let joke = jokes[Math.floor(Math.random() * jokes.length)]
  if (!usedJokes.includes(joke.number)){
    usedJokes.push(joke.number)
    return joke
  } else {
    if (usedJokes.length === jokes.length){
      usedJokes = []
    }
    random_from_array(jokes)
  }
}

function upload_random_image(jokes){
  let image = imagesArray[Math.floor(Math.random() * imagesArray.length)]

  console.log('Opening an image...');
  var joke = random_from_array(jokes);
  var joke_path = path.join( __dirname, '/images/' + image)
  var joke_text = joke.text
  var b64content = fs.readFileSync(joke_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        status: joke_text,
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}

let usedMemes = []
function random_from_array_meme(memes){
  let meme = memes[Math.floor(Math.random() * memes.length)]
  if (!usedMemes.includes(meme.number)){
    usedMemes.push(meme.number)
    return meme
  } else {
    if (usedMemes.length === memes.length){
      usedMemes = []
    }
    random_from_array_meme(memes)
  }
}

function upload_random_image_meme(memes){
  console.log('Opening an image...');
  var meme = random_from_array_meme(memes);
  var joke_path = path.join( __dirname, '/memes/' + meme.image)
  var joke_text = meme.text
  var b64content = fs.readFileSync(joke_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        status: joke_text,
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}

function upload_gm_image(){
  let image = imagesGM[Math.floor(Math.random() * imagesGM.length)]

  console.log('Opening an image...');
  var joke_path = path.join( __dirname, '/imagesGM/' + image)
  var joke_text = "gm 🤝 \r\n\r\n#gm #raddadsnft #solana #SolanaNFTs #SolanaNFT #NFT #NFTS"
  var b64content = fs.readFileSync(joke_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR:');
      console.log(err);
    }
    else{
      console.log('Image uploaded!');
      console.log('Now tweeting it...');

      T.post('statuses/update', {
        status: joke_text,
        media_ids: new Array(data.media_id_string)
      },
        function(err, data, response) {
          if (err){
            console.log('ERROR:');
            console.log(err);
          }
          else{
            console.log('Posted an image!');
          }
        }
      );
    }
  });
}

fs.readdir(__dirname + '/images', function(err, files) {
  if (err){
    console.log(err);
  }
  else{
    var images = [];
    var memeImages = []

    jokes.forEach(function(f) {
      images.push(f);
    });

    memes.forEach(function(f) {
      memeImages.push(f);
    });


    setInterval(function(){
      upload_random_image(images);
    }, 1000 * 60 * 60 * 8);

    cron.schedule('9 18 * * *', () => {
      upload_random_image_meme(memeImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });

    cron.schedule('6 9 * * *', () => {
      upload_gm_image()
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });
  }
});
