---
title: "Better Rails View Helpers"
date: 2015-12-18T02:11:00Z
kind: article
link: http://blogs.sequoiainc.com/better-rails-view-helpers/
location: Sequoia Blogs
---
Hey Rails developers, let’s say we’re building a blog. Why a blog? Because it’s a common example.

For simplicity’s sake, lets assume we have just two models: `User` and `Post`.

Would you put all the domain logic inside a single class? No, you’d split it between `User` and `Post` models, depending on where it belonged.

Would you put all the endpoints into a single controller class? No, you’d split them between `UsersController` and `PostsController`, depending on which resource the action was acting on.

Why then, do you put all your view logic into a single class?

“But I don’t,” you say, “I split the view logic between a `UsersHelper` and a `PostsHelper`.”

No, you don’t.

### The Problem

Your `UsersHelper` and `PostsHelper` objects aren’t classes at all. They’re modules. When Rails renders a template, it instantiates an anonymous class. It then includes all the modules in `app/views/helpers` into that anonymous class. The result is a grab-bag class that can lead to subtle bugs.

Consider this:

Suppose we build our posts views first. We create our index template, adding a method to `PostsHelper` to format the `created_at` timestamp:

```
def formatted_created_at(post)
  post.created_at.time_ago_in_words
end
```

Some time passes. We add our show view, and basic CRUD operations. Later, we add multi-user functionality, including a view with a users table. One column will include the `created_at` date formatted to ISO standard for easy sorting. So we go into our `UsersHelper` and add:

```
def formatted_created_at(user)
  user.created_at.iso_3668
end
```

Now we have a problem. The `formatted_created_at` in `UsersHelper` will override the `formatted_created_at` in `PostsHelper`. If you’re using an earlier version of Ruby/Rails it may be vice-versa, but either way, you won’t get any warnings or notices.

### A Solution

This isn’t a new problem.

The decorator pattern is a popular solution. With decorators, you wrap your model objects with classes that provide view methods. Thus, the post decorator would wrap a post, providing a `formatted_created_at` method. A user decorator would wrap a user providing a like-named method with a different implementation.

But the decorator pattern brings its own set of problems. Consider the following code snippet in a view:

```
  <%= post.some_method %>
```

Where is `some_method` defined? The decorator or the model? This obfuscation makes it harder for new developers to contribute. Not to mention that view methods tend to be _view_ specific, not model specific. We may want our user’s formatted date to display one way on the index view, but another way on the show view.

### A Better Way

Rather than wrap our models in classes that aim to provide every UI method we could want, let’s take a step back. The problem is that Rails mixes all the helpers into an anonymous class. What if we could define that class and only add the methods we want?

Enter [SimplestView](https://github.com/tpitale/simplest_view).

It weighs in at 40 lines of code. It does one thing. Using this gem, you define the backing class for a given view.

```
class Posts::IndexView < ActionView::Base
  def formatted_created_at(post)
    return post.created_at.time_ago_in_words
  end
end
```

That’s it. Now the `formatted_created_at` method is available for use in the post index view. No more hunting for a helper method’s definition. Any method without an explicit receiver will default to `self` which is `Posts::IndexView`. No more silent method overrides. You can even use inheritance and private methods.

Best of all, you can migrate at your own pace. If you don’t define a class for a view, the default Rails behavior will remain.

SimplestView is so simple, so small, and works so well, it should be available in Rails core. Including it wouldn’t break anything but would provide an answer to the common problem of how to scale view helpers.