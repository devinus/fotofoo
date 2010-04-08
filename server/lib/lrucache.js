var LRUCache = {};

LRUCache.Cache = function(maxsize) {
  this._keys = [];
  this._items = {};
  this._expires = {};
  this._size = 0;
  this._maxsize = maxsize || 1024;
  if (this._maxsize < 2) throw "max size must be > 2";
};

LRUCache.Cache.prototype = {
  set: function (key, value, callback) {
    var keys = this._keys,
        items = this._items,
        expires = this._expires;
        size = this._size,
        maxsize = this._maxsize;

    if (size >= maxsize) { // make room
      keys.sort(function (a, b) {
        if (expires[a] > expires[b]) return -1;
        if (expires[a] < expires[b]) return 1;
        return 0;
      });

      size--;
      delete expires[keys[size]];
      delete items[keys[size]];
    }

    keys[size] = key;
    items[key] = value;
    expires[key] = new Date();
    size++;

    this._keys = keys;
    this._items = items;
    this._expires = expires;
    this._size = size;

    if (callback) return callback(size);
  },

  get: function (key, callback) {
    var item = this._items[key];
    if (item) this._expires[key] = new Date();
    if (callback) return callback(item);
    return item;
  }
};

exports.cache = function (maxsize) {
  return new LRUCache.Cache(maxsize);
};
