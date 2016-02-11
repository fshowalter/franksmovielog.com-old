---
title: "Down the Responsive Image Rabbit Hole"
date: 2015-12-17T02:22:02Z
kind: article
link: http://blogs.sequoiainc.com/down-the-responsive-image-rabbit-hole/
location: Sequoia Blogs
---

In the old days, images were easy. There was a single `img` tag. Your site had a fixed width layout. You knew the image’s dimensions on the client.

As time marched on, things got complicated. First, the table hack made flexible layouts possible, then CSS allowed for true fluid layouts.

Still, designers could size their images for a maximum resolution and serve them to all visitors.

Then Apple introduced the iPhone in 2007 and changed the web as we knew it.

Overnight, sites had a new resolution to support: `320x480`. Users swarmed to access the web over low-speed, high-latency connections. Images designed for traditional desktop resolutions took minutes to load.

Apple’s Mobile Safari browser offered no answers.

To be fair, Apple’s priority was bringing the web _as-is_ to mobile. Additions to the HTML spec require committee discussion and approval. It takes a while. This problem began in 2007 and it’s still not resolved.

And Apple wasn’t done changing the web.

In 2010 Apple introduced the iPhone 4, ushering in the era of Retina displays.

Overnight, images optimized for the smaller `320x480` resolution looked blocky and pixelated. For a `320px` wide image to look crisp on Apple’s new phone, you had to serve a `640px` wide image. But, making things more complicated, not everyone had the new retina phones.

Fast-forward to today. We have tablets, phablets and everything between. Retina displays aren’t confined to mobile. Retina multipliers go to 3 and include fractional values. The question of how to serve optimized images is harder than ever.

Let’s take a look at two common image use-cases: CSS background images, and `img` tags. We’ll evaluate our options based on speed, with the goal of serving the optimal image for a given device.

> Spoiler alert: there’s no silver bullet.

## CSS Background Images

For CSS background images, we have three options:

### Option 1. Do nothing.

This is certainly the easiest to implement. Serve your images at ridiculous dimensions (_and I do mean ridiculous_) and they’ll look fine on any device.

The problem comes for users on low-bandwidth, high-latency connections. Those larger images will be slower to download. Worse-still, those images will be expensive for users on metered connections.

### Option 2: Use media queries.

A much better solution.

With media queries, you can specify different sized images for different resolutions and pixel densities.

The problem arises when you have a lot of different background images. You’ll need rules for each, which can bloat your CSS. This may not be possible if your background image styles are generated from a CMS. In these cases, you’re better served by…

### Option 3. Use Javascript to specify the background image.

Some client side script can determine an element’s width and apply the inline style for the appropriate image.

But you’ll lose out on prefetching. The browser won’t know about the image until it’s downloaded and parsed the initial HTML payload, any blocking stylesheets, and the script itself.

If you want Amazon-like instant page loads, this will hurt. Worse still, if your element’s dimensions depend on CSS, you must wait until `document.readyState` is `complete`.

**The winner:** Media Queries or Javascript, depending on your needs.

Really, it’s choosing between the lesser of three evils.

Option 1 will kill mobile users. First, by forcing them to download heavy, cache-busting images. Then, by taxing their batteries as their browser resizes the image.

Option 2 only works for images you define as part of your layout. Even for those, given the large variety of pixel ratios and screen sizes, some clients will wind up downloading images larger than they need.

Option 3 ensures an optimal image, but forgoes any browser optimizations.

Pick your poison.

## Image Tags

With `img` tags, your options depend on which browsers you need to support.

### Option 1. Do nothing.

Again, the easiest to implement. Serve your images at ridiculous dimensions and they’ll look fine on any device. Low-bandwidth, high-latency users suffer.

### Option 2. Use Javascript to replace the `src` attribute.

Render your images with a 1 pixel spacer image, then use client-side script to replace the `src` attribute.

You’ll get an optimal image, but lose out on prefetching. And, as with background images, if your element’s dimensions depend on CSS, you must wait until the `document.readyState` is `complete`.

### Option 3: Use the new `srcset` and `sizes` attributes.

Provided you only need to support the latest browsers, this is a great option. The `srcset` attribute allows you to specify an image collection. The `sizes` attribute allows you to pick a `srcset` value based viewport dimensions. It’s like media queries for `img` tags.

But, just as with media queries, sizes are relative to the viewport, not the tag’s parent element. For relative sizing, you’re back to using client-side script.

**The winner:** `srcset` and `sizes` or Javascript, depending on your needs.

If you can live with the limited browser support, Option 3 is your best bet. Even though it doesn’t allow for relative sizing, the native browser support means it will be the fastest option and a good compromise.

## The Future

Responsive `img` tags are getting a lot of attention. Future versions of Microsoft’s Edge browser will support `srcset` and `sizes`, making that the go-to solution for `img` tags.

Things are less rosy for dynamic CSS background images. Inline styles or client-side script are still the go-to tools for the foreseeable future.

Rather than focus on new tags or attributes, I’d like to see the browsers add meta-data to image requests.

When requesting an image, the browser could include the client width and pixel density as headers in the request.

The server could look at those headers and dynamically serve the correct image, resizing and compressing on the fly.

This would allow the front-end to focus on instances where some kind of art-direction is necessary. Like cropping a wide-screen photo for a phone in portrait mode. The `picture` tag can help us if Safari and Mobile Safari ever get around to supporting it.

In the meantime, responsive images will remain a work in progress.