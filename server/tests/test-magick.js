var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    magick = require('../lib/magick');

function copyFile(orig, dest, callback) {
  var readStream = fs.createReadStream(orig);
  var writeStream = fs.createWriteStream(dest);
  readStream.addListener('data', function (data) {
    if (!writeStream.write(data)) readStream.pause();
  });
  readStream.addListener('end', function () {
     writeStream.close();
     callback();
  });
  writeStream.addListener('drain', function () {
    readStream.resume();
  });
};

var test_file = path.join(__dirname, 'test.jpg'),
    test_file_copy = path.join(__dirname, 'test_copy.jpg');

copyFile(test_file, test_file_copy, function () {
  var image = magick.image(test_file_copy);
  image.dimensions(function (width, height) {
    assert.strictEqual(width, 1920, 'original image width != 1920');
    assert.strictEqual(height, 1200, 'original height width != 1200');
    image.thumbnail(width/10, height/10, function (width, height) {
      assert.strictEqual(width, 192, 'new image width != 192');
      assert.strictEqual(height, 120, 'new height width != 120');
    });
  });
});
