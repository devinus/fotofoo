var NATURAL_SORT_RE = /(-?[0-9\.]+)/g;

// http://code.google.com/p/js-naturalsort/
exports.naturalSort = function (a, b) {
  var x = a.toString().toLowerCase() || '',
      y = b.toString().toLowerCase() || '',
      nC = String.fromCharCode(0),
      xN = x.replace(NATURAL_SORT_RE, nC + '$1' + nC).split(nC),
      yN = y.replace(NATURAL_SORT_RE, nC + '$1' + nC).split(nC),
      xD = (new Date(x)).getTime(),
      yD = xD ? (new Date(y)).getTime() : null;

  if (yD) {
    if (xD < yD) return -1;
    else if (xD > yD) return 1;
  }

  for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
    var oFxNcL = parseFloat(xN[cLoc]) || xN[cLoc] || 0,
        oFyNcL = parseFloat(yN[cLoc]) || yN[cLoc] || 0;
    if (oFxNcL < oFyNcL) return -1;
    else if (oFxNcL > oFyNcL) return 1;
  }

  return 0;
};
