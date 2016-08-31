---
title: "Updating www.sequoiainc.com Part 1: Going Serverless"
date: 2016-05-30T19:44:00Z
kind: article
link: https://blogs.sequoiainc.com/updating-www-sequoiainc-com-part-1-going-serverless/
location: Sequoia Blogs
---

Servers are expensive. They cost money, time, and anxiety.

Recently, we migrated our website, [www.sequoiainc.com](https://www.sequoiainc.com), to a serverless architecture. Without servers, our monthly hosting costs are zero, yet our site is more secure and robust than ever.

Odds are, your company's website could do the same.

## In the Beginning

Our site used to run on [Wordpress](https://wordpress.org/). Wordpress is a fine product, but one with considerable overhead.

First, it's an app, which means keeping up with security updates. Not just for Wordpress, but also for any plugins you include.

Second, it needs a server. We used an Amazon EC2 instance. This added a hosting cost and required us to keep current with OS updates.

Third, you need a database. The database also needs security updates and backups. We used Amazon RDS, which handled security updates and backups for us, albeit with an added cost.

## Alternatives

Initially, we looked at managed solutions. Services like [wpengine.com](http://wpengine.com) offer managed, hosted Wordpress installations. For a fee, they handle upgrades, patches, and backups. It’s a good solution, but we felt we could do better.

## Going Static

When we took stock of our website, we realized it was essentially static. Sure, we'd add a page or graphic now and then, but content updates were small and months apart. A powerhouse CMS like Wordpress was overkill.

Our first thought was to crawl the existing site, save the resulting HTML, and serve it. Updates would entail editing the HTML.

This was a naive solution, as even the smallest site-wide updates, like adding a graphic to the site header, required changing dozens of files.

## Enter Jekyll

[Jekyll](https://jekyllrb.com/) is a static site generator written in Ruby. You store your content in flat files written in markdown. Jekyll injects these files into user-defined templates and outputs a pre-rendered website.

This alleviated the layout change problem by allowing us to create a site-wide layout template. As a bonus, our dynamic content, like [our current jobs](https://www.sequoiainc.com/careers/), could be stored and edited outside of the HTML. Win-win!

## GitHub Pages

But requiring anyone who wanted to update the site to have a Ruby development environment wasn't tenable. Thanks to GitHub, that's not necessary.

GitHub has an under-utilized feature called [Pages](https://pages.github.com/). Pages allow you to host a static site on GitHub servers, complete with versioning and custom domains. And best of all, it runs Jekyll.

Meaning you can use the GitHub web interface to update a template, commit the change, and GitHub will rebuild your entire site. Make a mistake? Reverting your change is just a few clicks away.

## Filling The Form Hole

There was just one problem. Our site has a [page for visitors to upload their resume](https://www.sequoiainc.com/submit-resume/). This form got a small but steady amount of traffic and we weren't willing to abandon it.

Behind the scenes, the form posted to a PHP endpoint which forwarded the attachment to our recruiter via email. Without a server, we no longer had the PHP endpoint, which broke the form.

Our first thought was to make use of [Amazon Lambda](https://aws.amazon.com/lambda/), but they don't support binary uploads. Instead, they suggest uploading to an S3 bucket and handling the S3 event. While a valid solution, it meant we'd have to clean up after the uploads. Amazon has indicated that lambda support for binary uploads is coming, but they don't have a date.

In the meantime, we opted to sign up for [Wufoo](http://www.wufoo.com/). Using their visual form builder we had a styled, working replica in under an hour. Problem solved with minimal cost and no ongoing maintenance concern.

## Wrapping Up

So far, the transition to a static, serverless architecture has been a complete success. The frictionless deployments make it easy for multiple team members to collaborate and iterate on  design changes and content additions. We recently added a new page and went from mockup to deployed product in a single evening.

## Bonus: Adding SSL

With a hosted, serverless, nearly-free environment, what more could you want?

How about free SSL?

[Cloudflare](https://www.cloudflare.com/) is a powerhouse CDN that also offers free SSL. After signing up for their free plan and migrating our DNS, we were up and running in under an hour.

