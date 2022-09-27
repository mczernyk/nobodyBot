var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require('./config.js');
var cron = require('node-cron');
var products = require('./products.js');


// to deploy:
// git push heroku master

// heroku UN: nobodyclothingnyc@gmail.com

var T = new Twit(config);

console.log('config', config)


let usedProducts = []
function random_from_array_product(products){
  let product = products[Math.floor(Math.random() * products.length)]
  if (!usedProducts.includes(product.number)){
    usedProducts.push(product.number)
    return product
  } else {
    if (usedProducts.length === products.length){
      usedProducts = []
    }
    console.log('hit error or dupe')
    random_from_array_product(products)
  }
}

function upload_random_image_product(products){
  console.log('Opening an image...');

  var product = random_from_array_product(products);

  var prod_path = path.join( __dirname, '/products/' + product.image[0])
  var prod_path1 = path.join( __dirname, '/products/' + product.image[1])

  var prod_text = product.text
  var b64content = fs.readFileSync(prod_path, { encoding: 'base64' });
  var b64content1 = fs.readFileSync(prod_path1, { encoding: 'base64' });


  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content1 }, function (err, data, response) {
    if (err){
      console.log("There's an issue uploading the left image.");
      console.log(err);
    }
    else {
      console.log('Left image uploaded!');
      console.log('Now tweeting it...');
      let leftID = data.media_id_string

      T.post('media/upload', { media_data: b64content }, function (err, data, response){
        if (err){
            console.log("There's an issue uploading the right image.");
            console.log(err);
        } else {
            console.log('Right image uploaded!');
            let rightID = data.media_id_string;
            let bothImages = ( leftID + "," + rightID );

            console.log("Now tweeting...")

            T.post('statuses/update', {
                status: prod_text,
                media_ids: new Array(bothImages)
            }, function(err, data, response){
                if (err) {
                    console.log("An error has occurred during posting.");
                    console.log(err);
                } else {
                    console.log("Post successful!");
                    console.log("The tweet says: " + prod_text);
                }
            });
        }
      })
    }
  });
}

fs.readdir(__dirname + '/products', function(err, files) {
  if (err){
    console.log(err);
  }
  else{
    var productImages = []

    products.forEach(function(f) {
      productImages.push(f);
    });

    cron.schedule('00 01 * * *', () => {
      upload_random_image_product(productImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });

    cron.schedule('00 09 * * *', () => {
      upload_random_image_product(productImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });

    cron.schedule('00 13 * * *', () => {
      upload_random_image_product(productImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });

    cron.schedule('00 17 * * *', () => {
      upload_random_image_product(productImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });
  }
});
