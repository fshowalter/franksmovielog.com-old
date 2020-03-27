const escapeRegExp = str => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

/*
  Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
*/
const timedChunk = (items, process, context, callback) => {
  var processItem;
  var todo;

  todo = nodeListToArray(items);

  processItem = function processItemChunk() {
    var start;
    start = +new Date();

    do {
      process(todo.shift());
    } while (todo.length > 0 && +new Date() - start < 50);

    if (todo.length > 0) {
      return setTimeout(processItem, 25);
    } else if (callback) {
      return callback(items);
    }
  };
  return setTimeout(processItem, 25);
};

const nodeListToArray = nodeList => {
  var array = [];
  var i;
  var len;

  for (i = -1, len = nodeList.length; ++i !== len; ) {
    array[i] = nodeList[i];
  }

  return array;
};

const buildMatcher = matcher => {
  return item => {
    let match = true;

    if (!matcher(item)) {
      match = false;
    }

    if (match) {
      item.removeAttribute("style");
    } else {
      item.style.display = "none";
    }
  };
};

export { buildMatcher, timedChunk, escapeRegExp };
