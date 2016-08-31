---
title: "Getting Flexbox Sizes In Javascript"
date: 2016-05-30T19:50:00Z
kind: article
link: https://blogs.sequoiainc.com/getting-flexbox-sizes-in-javascript/
location: Sequoia Blogs
---

Flexbox is great. It's got [solid browser support](http://caniuse.com/#feat=flexbox) and [solves some common layout scenarios](https://philipwalton.github.io/solved-by-flexbox/).

But recently, it revealed a gotcha.

## The Problem

Given this markup:

```
<div class="container" style="width: 300px">
  <div class="first">First</div>
  <div class="second">Second</div>
  <div class="third">Third</div>
</div>

<script>
  console.log(document.querySelectorAll('.second')[0].offsetWidth)
</script>
```

What will the `<script>` block print? `300`, right?

Correct.

But suppose, in an external stylesheet referenced in `<head>`, we have:

```
.container {
  display: flex;
}
```

_Now_ what will the `<script>` block print?

`100`?

Maybe. More likely, you’ll get `300`.

What's going on?

Contrary to my initial suspicions, flexbox isn't the culprit. Rather, it's a race condition. The `<script>` block, being inline, may run before the browser downloads and parses the external stylesheet to apply the `display: flex` style.

## The Solution

This is where things get tricky. We could listen for the `load`, or `onreadystatechange` events on `document`, but we’d have to wire our listener before loading any stylesheets, which would block page rendering. I hate blocking page rendering.

Instead, I recommend polling the ready state.

```
function documentIsFinishedLoading() {
  return /^complete|^i|^c/.test( document.readyState);
}

function doWhenDocumentReadyStateIsComplete(doWork) {
  var intervalId;

  if (documentIsFinishedLoading()) {
    doWork();
  } else {
    intervalId = setInterval(() => {
      if (documentIsFinishedLoading()) {
        doWork();
        clearInterval(intervalId);
      }
    }, 250 );
  }
}

doWhenDocumentReadyStateIsComplete(() => {
  console.log(document.querySelectorAll('.second')[0].offsetWidth);
});
```

If the stylesheets are loaded, the `doWork` callback runs immediately. Otherwise I wait 250 milliseconds, then check again. Place this script at the bottom of the page so it won’t block rendering.

## Lessons Learned

Writing performant Javascript can be tricky. We strive to avoid render-blocking script tags, but inline and async scripts mean we can't make assumptions regarding external assets.

Once you're cognizant of the problem, it's an easy enough solution. But I'll confess to spending more than a few minutes convinced I'd encountered a browser bug when the console was printing 300, yet running the same bit of code after page load produced a different value.

