const escapeRegExp = (str: string): string => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

/*
  Copyright 2009 Nicholas C. Zakas. All rights reserved. MIT Licensed
*/
const timedChunk = (
  process: (node: HTMLElement) => void,
  items?: NodeListOf<HTMLElement> | null,
  callback?: (nodeList?: NodeListOf<HTMLElement> | null) => any
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

const nodeListToArray = (nodeList?: NodeListOf<HTMLElement> | null) => {
  var array = [];
  var i;
  var len;

  if (!nodeList) {
    return [];
  }

  for (i = -1, len = nodeList.length; ++i !== len; ) {
    array[i] = nodeList[i];
  }

  return array;
};

const buildMatcher = (matcher: (node: HTMLElement) => boolean) => {
  return (node: HTMLElement) => {
    let match = true;

    if (!matcher(node)) {
      match = false;
    }

    if (match) {
      node.removeAttribute("style");
    } else {
      node.style.display = "none";
    }
  };
};

export { buildMatcher, timedChunk, escapeRegExp };
