---
title: "5 Speed Bumps for Rails in the Enterprise"
date: 2015-12-16T01:37:02Z
kind: article
link: http://blogs.sequoiainc.com/5-speed-bumps-for-rails-in-the-enterprise/
location: Sequoia Blogs
---

> How long will it take?

As an Enterprise developer, you’re asked that a lot. If you're using Rails, you can often answer:

> Not very long.

But it’s not all rainbows and unicorns. While the following aren’t roadblocks, they _are_ speed bumps. Address them early to ensure you’re able implement a solution that fits your customer’s needs without slipping schedule.

## 5. Authentication

Enterprise environments have existing authentication systems, usually LDAP. You’ll need to integrate. There are gems to help, but you must understand your Enterprise’s LDAP structure and how it maps to your application.

Implement authentication early to uncover these integration points.

## 4. Office Interop

Working in the Enterprise inevitably means ingesting or outputting Office documents.

Ruby has a great CSV parser, but Excel can be very fickle, especially when dealing with Unicode characters.

Often, your requirements will call for specific formatting. Welcome to the world of [Office Open XML](https://en.wikipedia.org/wiki/Office_Open_XML). There are gems that can help, but there’s a learning curve you shouldn’t underestimate.

Get samples in front of end users sooner rather than later.

## 3. Reporting

The Enterprise loves reporting. For your first release, canned reports will suffice. Before long, you’ll be getting requests for a report builder or Crystal Reports integration.

There’s some gem help out there, but don’t be surprised when your reporting code outweighs your application code.

To avoid a full-stop rewrite, factor reporting into early data-model decisions and be kind to your future self.

## 2. Workflow

Workflow can be tricky. Even with gem help, implementations can quickly devolve into spaghetti code. Workflow is, by nature, heavily conditional, making it ripe for bugs.

Often, you’ll be replacing a legacy system with stakeholders from different parts of the organization.

Get the current workflow on paper. Build a flowchart. Plaster that flowchart on a wall where as many stakeholders as possible will see it.

Your implementation will still be wrong, but it won’t be _as_ wrong. Start early and expect multiple iterations.

## 1. Auditing/Change Tracking

The mother of all pain points. Don’t be fooled. The gems won’t be enough.

Enterprise apps are heavily fielded. The object you edit will include dozens of belongs-to associations, and multiple nested objects.

End users expect a visual history showing every change, including before-and-after values, of the object graph as visualized in the UI. ActiveModel::Dirty won’t cut it.

Implement this early, as part of your initial CRUD implementation to avoid crunch-time later.

## Honorable Mention

I almost added deployment to the list, but that’s not an Enterprise-specific problem. All apps need to be deployed. Work it from Day 1.

## Conclusion

None of these are reason enough to avoid Rails. It’s a solid framework with a lot of strengths.

These obstacles aren’t insurmountable. They just require more time than you might expect, given how much Rails does for you in other areas.

Consider how Microsoft made such great inroads in the Enterprise. They focused on Enterprise problems. Sharepoint, for all its faults, gives you Authentication, Office Interop, Workflow, and basic Auditing right out of the box. And they’ve got add-ins for reporting.

Microsoft can do this because they’re the ones providing the Authentication (Active Directory), the Office Interop (Microsoft Office), and the datastore (SQL Server).

Rails doesn’t come with its own ecosystem and it’s reasonably database agnostic. In the long term, these are huge strengths, but successful Enterprise Rails developers need to know how to fill the gaps.