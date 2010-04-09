var NUMBER_GROUPS = /(-?[0-9]*\.?[0-9]+)/g;

var naturalSort = module.exports = function (a, b) {
  var aa = String(a).split(NUMBER_GROUPS),
      bb = String(b).split(NUMBER_GROUPS);

  for (var i = 0, min = Math.min(aa.length, bb.length); i < min; i++) {
    var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
        y = parseFloat(bb[i]) || bb[i].toLowerCase();
    if (x < y) return -1;
    else if (x > y) return 1;
  }

  return 0;
};
