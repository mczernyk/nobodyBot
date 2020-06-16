var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require('./config.js');
var jokes = require('./jokes.js');

var T = new Twit(config);

console.log('config', config)

let current = 0
function random_from_array(jokes){
  let joke = jokes[current];
  current ++
  if (current === jokes.length){
    current = 0
  }
  return joke
}

function upload_random_image(jokes){
  console.log('Opening an image...');
  var joke = random_from_array(jokes);
  var joke_path = path.join( __dirname, '/images/' + joke.image)
  var joke_text = joke.text
  console.log('jokePAth', joke_path)
  console.log('jokeTExt', joke_text)
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
    jokes.forEach(function(f) {
      images.push(f);
    });

    setInterval(function(){
      upload_random_image(images);
    }, 1000 * 60 * 60 * 3);
  }
});
