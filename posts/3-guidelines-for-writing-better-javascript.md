---
title: "3 Guidelines for Writing Better Javascript"
date: 2016-05-30T19:40:00Z
kind: article
link: https://blogs.sequoiainc.com/3-guidelines-for-writing-better-javascript/
location: Sequoia Blogs
---

JavaScript doesn't have to be hard. Follow these three suggestions to write code that's easier to extend, maintain, debug, and reason about. Just because JavaScript code can be a mess, doesn't mean it has to be.

## 1. Prefer Functions

JavaScript's strength lies in its consideration of functions as first-class objects. Exploit this.

Too often, I see folks shoe-horning JavaScript into whatever taxonomy-based architecture their prior language preferred.

Rather than write a simple `fetchUser` function, they build a `User` class containing a `fetch` method that queries and transforms the data and returns a populated `User` instance.

Stop it.

The `fetchUser` function can-and-should exist as an independent, first-class object with a single responsibility: fetching user data.

Let's consider an implementation:

```
import transformUserData from './transformUserData';
import apiConfig from './apiConfig';
import ajax from 'ajaxLib';

export const dependencies = {
  transformUserData,
  apiConfig,
  ajax,
}

export default function fetchUser(id) {
  return dependencies.ajax.get(dependencies.apiConfig.url + '/users/' + id)
    .then(dependencies.transformUserData);
}
```

This function has a narrow responsibility. Instead of embedding the transformation logic, it imports it. If we need to change how the data is transformed, we won’t need to touch this file. This lends itself to smaller, more surgical, commits that touch less code in fewer files.

It's also testable. By exporting our external dependencies, they can be mocked or stubbed. A unit test need only:

  1. verify the parameter passed to `dependencies.ajax.get`
  * verify `dependencies.transformUserData` is called with the `dependencies.ajax.get` method response.

Some may take issue with the `dependencies` export, but given JavaScript’s lack of named parameters, it’s less brittle than constructor injection.

Further, using the `dependencies` export has an added benefit. By referencing our external dependencies via the `dependencies` object, we make our code more readable. In larger functions it helps answer the question: "Where did this method come from?"

## 2. Avoid State

Now, lets consider what our above example _doesn't_ have: state.

We could have written this:

```
import transformUserData from './transformUserData';
import apiConfig from './apiConfig';
import ajax from 'ajaxLib';


export const dependencies = {
  transformUserData,
  apiConfig,
  ajax,
}

class UserFetcher {
  constructor(id) {
    this.id = id;
  }

  fetch() {
   return dependencies.ajax.get(dependencies.apiConfig.url + '/users/' + this.id)
     .then(dependencies.transformUserData);
  }
}
```

Don't laugh. I've seen this in real code. The problem should be obvious: calling `fetch` multiple times is not guaranteed to return the same user because the class’s `id` property can be changed external to the function.

Don't do this. Make your functions first-class objects and as pure as possible by passing in any external state.

Granted, most applications must store some state. Treat it with care. Consider using a library like [redux](https://github.com/reactjs/redux) to ensure you don't leak state across your application.

Note the important distinction between state and _side-effects_. Even our first example, the `fetchUser` function has side-effects. Calling the external API should return data, but it might fail due to network or server errors.

There's no best-practice for modeling side-effects, but there are some promising candidates. Until there’s a consensus, your best bet is to catch errors you can handle and, at-minimum, log the ones you can't.

By making our function stateless, and testing for errors we can handle, we gain confidence that any run-time errors will come from the external network or system and not our code. Not perfect, but better.


## 3. Avoid Mutations

Many a bug can be traced to an unintended mutation. Consider the following:

```
function doesPostHaveTag(post, tag) {
  post.tags = post.tags.map(tag => return tag.toUpperCase());
  return post.tags.includes(tag.toUpperCase());
}
```

Spot the danger? Calling `doesPostHaveTag` will change the post’s tags to uppercase. This example is obvious, but subtler mutations often worm their way into code, often via third-party libraries.

Guard against this by using [Immutable.js](https://facebook.github.io/immutable-js/). Not only does it give you performant immutable data structures, it also provides lodash-like collection iteration and manipulation. The learning curve isn't too steep, and it pays dividends when debugging your application, as you never ask "What changed this variable?"

## Wrapping Up

I almost titled this article _3 Rules For Writing Better JavaScript_ but thought better. Rules are rigid. There will be times, for performance, or to match an external API, when you must deviate from these guidelines. That's okay, provided you understand _why_ you're doing it. And don't worry. As JavaScript engines improve and API's evolve, you'll find those exceptions becoming fewer and fewer.