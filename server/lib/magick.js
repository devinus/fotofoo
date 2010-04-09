var childProcess = require('child_process');

var Magick = {};

Magick.Image = function (path) {
  if (!path) throw Error("Must provide an image path");
  this._path = path;
  this._WHITESPACE_RE = /(\s)/g;
};

Magick.Image.prototype = {
  dimensions: function (callback) {
    this._run(['identify', '-format', '"%w,%h"'], function (output) {
      var dim = output.trim().split(',');
      callback(parseInt(dim[0]), parseInt(dim[1]));
    });
  },

  thumbnail: function(width, height, callback) {
    var image = this;
    this._run(['mogrify', '-thumbnail', width + 'x' + height], function (output) {
      image.dimensions(function (width, height) {
        callback(width, height);
      });
    });
  },

  _run: function (args, callback) {
    var shellPath = this._path.replace(this._WHITESPACE_RE, '\\$1'),
        cmd = ['gm', args.join(' '), shellPath].join(' ');
    childProcess.exec(cmd, function (err, stdout, stderr) {
      if (err) throw err;
      callback(stdout);
    });
  }
};

exports.image = function (path, callback) {
  return new Magick.Image(path);
};
