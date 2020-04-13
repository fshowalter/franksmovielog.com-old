const escapeRegExp = (str: string): string => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

/*
  Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
*/
const timedChunk = (
  items: NodeList,
  process: (node: Node) => void,
  callback: (nodeList: NodeList) => any
) => {
  const todo = nodeListToArray(items);
  if (todo.length == 0) {
    return;
  }

  const processItem = function processItemChunk() {
    const start = +new Date();

    do {
      process(todo.shift()!);
    } while (todo.length > 0 && +new Date() - start < 50);

    if (todo.length > 0) {
      return setTimeout(processItem, 25);
    } else if (callback) {
      return callback(items);
    }
  };
  return setTimeout(processItem, 25);
};

const nodeListToArray = (nodeList: NodeList) => {
  var array = [];
  var i;
  var len;

  for (i = -1, len = nodeList.length; ++i !== len; ) {
    array[i] = nodeList[i];
  }

  return array;
};

const buildMatcher = (matcher: (node: Node) => boolean) => {
  return (item: HTMLElement) => {
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
