---
title: "Updating www.sequoiainc.com Part 2: Going Responsive"
date: 2016-05-30T19:47:00Z
kind: article
link: https://blogs.sequoiainc.com/updating-www-sequoiainc-com-part-2-going-responsive/
location: Sequoia Blogs
---

Honestly? I thought it would be easy. A few days of work, tops.

Boy, was I wrong.

I'm talking about the level of effort involved in making our website, [www.sequoiainc.com](https://www.sequoiainc.com), responsive. Before I joined Sequoia, I visited their website. Using my phone, I got something like this:

![screenshot](/content/images/2016/05/Screen-Shot-2016-05-27-at-5-21-34-AM.png)

That shot is to scale. Those with good eyes can read the navbar text, but the body text is illegible without pinch-zooming. Not a great first impression.

No worries, I thought. I'll just set the viewport’s initial scale and throw in some media-queries to reflow the content as a single column.

A few days of work indeed.

## The Problem

I like the site design. It's got a quirky aesthetic that looks professional without being generic. It's a great brand identity that stands out.

Looking at the code, I'd wager the original designer drew up the pages in Photoshop then passed them to the developers who implemented them pixel-perfect. No small feat years ago when the site launched. But in today's multi-device world, such an approach comes back to bite you.

For example, after adding a meta tag to set the viewport’s initial scale:

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

The content still appeared zoomed out.

Digging into the CSS, I discovered:

```
body {
  ...
  min-width: 1003px;
}
```

Yes, the original developers hard-coded the entire site to a 1003px width. Digging deeper, it turned out that almost _everything_ had a hard-coded width. Making things even worse, those widths corresponded to background images. For instance, the main container:

![background image](/content/images/2016/05/bg-wrapper--1-.png)

No problem, I thought, I'll just use the [background-size](https://developer.mozilla.org/en-US/docs/Web/CSS/background-size) CSS property to scale the images. Then I found this:

![background image](/content/images/2016/05/bg-block.png)

It’s a sprite, providing top, bottom, and repeating body images. This made scaling the images difficult if not impossible.

## CSS to the Rescue

I'll admit it. I considered giving up. The project’s scope had exploded. The thought of redoing all the background images was disheartening.

But further reflection led me to a realization. Most of the background images were unnecessary. Since the site’s launch, CSS properties like [border-radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) and [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) have gained wide support. Using those properties, along with [background-color](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color), I could replicate much of the design without background images. And a pure-CSS layout could scale to any resolution.

With the background image problem solved, I set back to work. I still faced a full CSS rewrite, but I'd have help.

## SASS: The S is for Sanity

As part of [going serverless](https://blogs.sequoiainc.com/updating-www-sequoiainc-com-part-1-going-serverless/), we upgraded the site to use Jekyll. Jekyll supports [SASS](http://sass-lang.com/). SASS is a CSS preprocessor, allowing you to reuse and extend CSS blocks and write seamless media queries.

Here's an example rule for the home page:

```
.home-team_heading {
  @include heading('20px / 23px');
  margin: 0 0 10px;
}
```

I scoped the home page rules by adding a `home-` prefix. This allowed me to upgrade the site page-by-page without leaking styles or breaking other sections. The `@include` line references a [mixin](http://sass-lang.com/guide), a user-defined function that returns injected CSS rules. Here, I'm using it to add shared heading styles.

For layout, I used [flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) and [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries). The combination makes it trivial to reflow layout as either columns or rows depending on the viewport size. Browser support for `flexbox` used to be an issue, but with Microsoft having end-of-life'd all versions of IE below 11, `flexbox` is a viable solution.

## Testing Across Devices

For testing, I used [BrowserStack](https://www.browserstack.com/). It's amazing. Any browser/device combination, running right in your browser with full dev-tools support. It even works with local servers. Use it and launch with confidence.

## The Retina Problem

There was one issue I couldn't solve by myself. Putting aside the background images, the site also had a lot of content images. Some were photos, some logos, some illustrations. All sized to a fixed-width 1003px layout. Viewing them on retina devices, like a new MacBook Pro, meant they looked fuzzy, as the browser stretched the image.

Resolving this problem is an ongoing project. We've already added retina options for the logo, and we're working to convert the other images. Where possible, we'll use SVG which can scale to any resolution. Where we can't, we'll either use [srcset](https://developer.mozilla.org/en-US/Learn/HTML/Multimedia_and_embedding/Responsive_images) or `background-image` along with media queries.

## Wrapping Up

Today, visiting [www.sequoiainc.com](https://www.sequoiainc.com/) on my phone I get this:

![screenshot](/content/images/2016/05/Screen-Shot-2016-05-27-at-6-10-58-AM.png)

Legible the body text! And once we convert those illustrations to vector, they'll scale with the content.

Sure, a few days of work turned into a few weeks, but I think you’ll agree the result was worth it.