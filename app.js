var fs = require('fs');
var path = require('path');
var Twit = require('twit');
var config = require('./config.js');
var cron = require('node-cron');
var products = require('./products.js');
var dads = require('./dads.js');



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

    console.log('used prod', usedProducts)
    console.log('product', product)

    return product
  } else {
    if (usedProducts.length === products.length){
      usedProducts = []
    }
    console.log('hit error or dupe')

    random_from_array_product(products)
  }
}

let usedDads = []
function random_from_array(dads){
  let dad = dads[Math.floor(Math.random() * dads.length)]

  if (!usedDads.includes(dad.edition)){
    usedDads.push(dad.edition)

    return dad
  } else {
    if (usedDads.length === dads.length){
      usedDads = []
    }
    random_from_array(dads)
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

const upload_random_image = (dads) => {
  console.log('Opening an image...');

  var newDad = random_from_array(dads);
  var dad_path = path.join( __dirname, '/dads/' + newDad.image)
  var dad_text = `${newDad.name} \r\n\r\n mint your Dad at https://www.dadbro.xyz`
  var b64content = fs.readFileSync(dad_path, { encoding: 'base64' });

  console.log('Uploading an image...');

  T.post('media/upload', { media_data: b64content }, function (err, data, response) {
    if (err){
      console.log('ERROR uploading image:');
      console.log(err);
    }
    else {
      console.log("dad_text", dad_text)
      console.log("dad_image", dad_path)
      console.log('image uploaded!');
      console.log('Now tweeting it...');

      T.post('media/metadata.create', {
        media_id: data.media_id_string,
                alt_text: {
                    text: newDad.name
                }
      }, (err, data, response) => {
        console.log('tweeting')

        T.post('statuses/update', {
          status: dad_text,
          media_ids: new Array(data.media_id_string)
        }, function(err, data, response) {
            if (err){
              console.log('ERROR during posting.');
              console.log(err);
            }
            else{
              console.log('Posted an image!');
              console.log("The tweet says: " + dad_text);
            }
          }
        );
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

    cron.schedule('00 11 * * *', () => {
      upload_random_image_product(productImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });

    cron.schedule('00 19 * * *', () => {
      upload_random_image_product(productImages);
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });
  }
});

fs.readdir(__dirname + '/dads', function(err, files) {
  if (err){
    console.log(err);
  }
  else{
    var dadImages = [];

    dads.forEach(function(f) {
      dadImages.push(f);
    });


    cron.schedule('00 15 * * *', () => {
      upload_random_image(dadImages)
    }, {
      scheduled: true,
      timezone: "America/New_York"
    });
  }
});


