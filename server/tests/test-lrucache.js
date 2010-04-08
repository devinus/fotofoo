var sys = require('sys'),
    assert = require('assert');
    lrucache = require("../lib/lrucache");

var cache = lrucache.cache(5);

setTimeout(function(){
  cache.set('a', 1);
  setTimeout(function(){
    cache.set('b', 2);
    setTimeout(function(){
      cache.set('c', 3);
      setTimeout(function(){
        cache.set('d', 4);
        setTimeout(function(){
          cache.set('e', 5);
          setTimeout(function(){
            cache.get('a');
            setTimeout(function(){
              cache.get('b');
              setTimeout(function(){
                cache.set('f', 6);
                cache.set('g', 7);
                assert.strictEqual(cache.get('a'), 1, 'first cache entry was deleted');
                assert.strictEqual(cache.get('b'), 2, 'second cache entry was deleted');
                assert.strictEqual(cache.get('c'), undefined, 'oldest cache entry was not deleted');
                assert.strictEqual(cache.get('d'), undefined, 'second oldest cache entry was not deleted');
                assert.strictEqual(cache.get('g'), 7, 'last cache entry was not inserted');
              }, 100);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }, 100);
}, 100);
