#!/usr/bin/env node
var sys = require('sys'),
    path = require('path'),
    fs = require('fs'),
    multipart = require('./lib/multipart'),
    lrucache = require('./lib/lrucache'),
    magick = require('./lib/magick'),
    naturalSort = require('./lib/natsort').naturalSort,
    router = require('./deps/node-router/lib/node-router');

var ROOT = path.join(__dirname, 'ROOT'),
    STATIC_URL = '/_media/static';

var SLASH_RE = /\//g,
    ENCODED_PIPE_RE = /%7C/g,
    MULTIPLE_SLASHES_RE = /\/+/g,
    UNTITLED_FOLDER_RE = /untitled folder ?(\d+)?/;

var cache = lrucache.cache(1024),
    server = router.getServer();

function encodeGuid(guid) {
  var encoded = encodeURIComponent(guid.replace(SLASH_RE, '|'));
  return encoded.replace(ENCODED_PIPE_RE, '/');
};

function urlJoin() {
  var joined = Array.prototype.join.call(arguments, '/');
  return joined.replace(MULTIPLE_SLASHES_RE, '/');
};

server.get(/^\/favicon.ico/, function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/octet-stream'});
  res.close();
});

server.get(/^\/static\/(.*)$/, function (req, res, match) {
  req.url = decodeURIComponent(match);
  router.staticDirHandler(ROOT, '/static/')(req, res);
});

server.get(/^(\/.*)$/, function (req, res, match) {
  function getFolder(p, guid) {
    function gotFolder(guid, dirs, files) {
      var isRoot = guid === '/',
          dirname = path.dirname(guid);

      res.simpleJson(200, {
        type: 'Folder',
        guid: guid,
        name: isRoot ? '/' : path.basename(guid),
        parentFolder: isRoot ? null : (dirname === '.' ? '/' : dirname),
        childFolders: dirs,
        files: files
      });
    };

    fs.readdir(p, function (err, entries) {
      if (err) throw err;
      if (entries.length < 1) gotFolder(guid, [], []);
      else {
        var dirs = [], files = [],
            ent = path.join(ROOT, guid, entries.pop());

        fs.stat(ent, function (err, stats) {
          if (err) throw err;

          var basename = path.basename(ent);
          if (!(/^\./.test(basename))) {
            if (stats.isFile()) files.push(path.join(guid, basename));
            else dirs.push(path.join(guid, basename));
          }

          if (entries.length < 1) {
            var sortedDirs = dirs.sort(naturalSort),
                sortedFiles = files.sort(naturalSort);
            gotFolder(guid, sortedDirs, sortedFiles)
          } else {
            ent = path.join(ROOT, guid, entries.pop());
            fs.stat(ent, arguments.callee);
          }
        });
      }
    });
  };

  function getFile(p, guid) {
    cache.get(guid, function (dimensions) {
      var safeGuid = encodeGuid(guid);
      var data = {
        type: 'File',
        guid: guid,
        name: path.basename(guid),
        folder: path.dirname(guid),
        url: urlJoin(STATIC_URL, safeGuid)
      };

      if (dimensions) {
        data.width = dimensions.width;
        data.height = dimensions.height;
        res.simpleJson(200, data);
      } else {
        var image = magick.image(p);
        image.dimensions(function (width, height) {
          cache.set(guid, { width: width, height: height }, function () {
            res.simpleJson(200, data);
          });
        });
      }
    });
  };

  var guid = decodeURIComponent(match),
      p = path.join(ROOT, guid);

  path.exists(p, function (exists) {
    if (!exists) res.notFound();
    fs.stat(p, function (err, stats) {
      if (err) throw err;
      if (stats.isFile()) getFile(p, guid);
      else if (stats.isDirectory()) getFolder(p, guid);
      else router.notFound(req, res);
    });
  });
});

server.post(/^(\/.*)$/, function (req, res, match) {
  var guid = decodeURIComponent(match);

  if (/^application\/json/.test(req.headers['content-type'])) {
    req.setBodyEncoding('utf8');
    req.addListener('data', function (json) {
      var name = 'untitled folder',
          nextSlot = -1,
          dirname = path.dirname(guid),
          p = path.join(ROOT, dirname),
          data = JSON.parse(json);

      fs.readdir(p, function (err, entries) {
        if (err) throw err;
        var nextSlot = -1
        for (var idx=0; idx < entries.length; idx++) {
          var match = entries[idx].match(UNTITLED_FOLDER_RE);
          if (!match) continue;
          if (!match[1]) {
            nextSlot = 0;
            continue;
          }
          var currSlot = parseInt(match[1]),
              lastSlot = nextSlot;
          if (currSlot > nextSlot) nextSlot = currSlot;
          if (nextSlot != lastSlot+1) {
            nextSlot = lastSlot;
            break;
          }
        }

        if (++nextSlot > 0) name = 'untitled folder ' + nextSlot;

        fs.mkdir(path.join(p, name), 0755, function (err) {
          if (err) throw err;
          data.guid = path.join(dirname, name);
          data.name = name;
          res.simpleJson(201, data);
        });
      });
    });
  } else {
    req.setBodyEncoding('binary');

    var stream = new multipart.Stream(req),
        filedata = '', filename = '';

    stream.addListener('partBegin', function (part) {
      if (part.name === 'Filedata') {
        filename = part.filename;
        stream.addListener('body', function (chunk) {
          filedata += chunk;
        });
      }
    });

    stream.addListener('complete', function() {
      var p = path.join(ROOT, guid, filename);

      fs.writeFile(p, filedata, encoding='binary', function (err) {
        var image = magick.image(p);

        image.dimensions(function (width, height) {
          cache.set(guid, { width: width, height: height }, function () {
            var data = JSON.stringify({
              type: 'File',
              guid: path.join(guid, filename),
              url: urlJoin(STATIC_URL, encodeGuid(guid)),
              name: filename,
              folder: guid,
              width: width,
              height: height
            });

            res.simpleHtml(201, " \
              <!DOCTYPE html><html><head><title></title></head><body><script>(function(){ \
                if (window.parent && \
                    window.parent.MediaLibrary && \
                    window.parent.MediaLibrary.sendAction) { \
                    window.parent.MediaLibrary.sendAction('uploadComplete', this, { data: '" + data + "' }); \
                } \
              })();</script></body></html>");
          });
        });
      })
    });
  }
});

server.put(/^(\/.*)$/, function (req, res, match) {
  var guid = decodeURIComponent(match),
      p = path.join(ROOT, guid);

  req.setBodyEncoding('utf8');
  req.addListener('data', function (json) {
    var data = JSON.parse(json);

    if (data.name !== path.basename(guid)) {
      var newGuid = path.join(path.dirname(data.guid), data.name),
          p2 = path.join(ROOT, newGuid);

      fs.rename(p, p2, function () {
        var safeGuid = encodeGuid(guid);
        data.guid = newGuid;
        data.url = urlJoin(STATIC_URL, safeGuid);
        res.simpleJson(200, data);
      });
    } else if (data.type === 'File') {
      if (data.folder !== path.dirname(guid)) {
        var newGuid = path.join(data.folder, data.name),
            p2 = path.join(ROOT, newGuid);

        fs.rename(p, p2, function () {
          var safeGuid = encodeGuid(guid);
          data.guid = newGuid;
          data.url = urlJoin(STATIC_URL, safeGuid);
          res.simpleJson(200, data);
        });
      } else {
        var image = magick.image(p);
        image.dimensions(function (width, height) {
          if (data.width < width || data.height < height) {
              image.thumbnail(data.width, data.height, function(newWidth, newHeight) {
              cache.set(guid, { width: newWidth, height: newHeight }, function () {
                data.width = newWidth;
                data.height = newHeight;
                res.simpleJson(200, data);
              });
            });
          } else res.simpleJson(200, data);
        });
      }
    }
  });
});

server.listen(8080);
