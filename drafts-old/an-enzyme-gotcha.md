---
title: "An Enzyme Gotcha"
date: 2016-03-15T10:46:00Z
kind: article
link: http://blogs.sequoiainc.com/an-enzyme-gotcha/
location: Sequoia Blogs
---

[Enzyme](https://github.com/airbnb/enzyme) is a library for testing React components. It’s from the good folks at AirBnB, who already provide [a great set of linter defaults](https://github.com/airbnb/javascript).

Enzyme’s selling point is a jQuery like syntax for finding elements to assert against. Compare:

```
component.find('a');
```

with React’s TestUtils:

```
TestUtils.scryRenderedDOMComponentsWithTag(component, 'a');
```

And unlike TestUtils, Enzyme works with shallow rendering.  They even simplify the process:

```
import { shallow } from 'enzyme';

const wrapper = shallow(<My Component />);
```

But the jQuery-like syntax can trip you up.

Suppose you wanted simulate clicking a link with the text ‘Click Me!’. You might try something like this:

```
component.find('a')
	.findWhere(n => n.text() === 'Click Me!');
	.simulate('click')
```

But that fails with Enzyme saying:

```
This method is only meant to be run on single node. 2 found instead.
```

What happened?

Unlike jQuery, Enzyme doesn’t return elements, it returns wrapped component trees.

Thus, our first call, `component.find(‘a’)` returns an array of wrapped `a` component trees. Assuming there’s a single link on the page, `component.find(‘a’)` returns an array containing a single tree.

Next we call `findWhere(n=> n.text() === 'Click Me!')` This iterates over the single `a` component tree, which includes two nodes: the `a` itself and the text node containing `Click Me!`.

Calling `.text()` on either node will return `Click Me!` and thus the call returns two nodes. This isn’t what we want.

Consider this instead:

```
component.findWhere(n => n.type() === 'a' && n.contains('Click Me!'))
```

Spot the difference? The above restricts the results to nodes of type `a`. This eliminates the text nodes, and ensures we get our single link tree.

Given Enzyme’s rapid evolution, I wouldn’t be surprised to see this incorporated as a helper method, maybe something like `findWithTypeAndText(‘a’, 'Click Me!')`, but until then, the above will do.