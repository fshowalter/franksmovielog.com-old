---
title: "Introducing React"
date: 2015-09-17T01:16:02Z
kind: article
link: http://blogs.sequoiainc.com/introducing-react/
location: Sequoia Blogs
---

It’s simple.

That’s secret of [React](https://facebook.github.io/react/), a Javascript library from Facebook and Instagram. You’ve probably heard of it. If your project requires a user-interface, you might want to consider it.

Unlike Angular, Backbone, and other popular javascript frameworks, React is not a full-stack solution. It’s the V in MVC. Meaning you can use it with any of the aforementioned frameworks, or none at all.

###### Why use it?
React’s goal is to make complex user interfaces easier to build and reason about. It goes about this by allowing you to express your UI as a functional representation of your application state. You tell React what the screen should look like for a given state and it takes care of the transformation.

Under the covers it uses a Virtual DOM to compare the current UI with the desired UI and only update those parts the require changing. This makes complex interfaces easy to implement and performant.

To accomplish this, React embraces many of the concepts inherit in functional programming. Without requiring them, React encourages the use of immutable data structures and pure functions. React is not a functional programming framework however, as user interfaces are inherently stateful.

But React recognizes state as a source of complexity. By encouraging developers to maintain a minimal amount of mutable state, it aims to manage that complexity. It also enforces a one-way reactive data flow, again to minimize complexity.

With React, the UI becomes a representation of your application state. Put another way, state becomes argument to a function.

But what kind of function? Lets look at an example. With server-side frameworks, the idiomatic example was a blog application. Client side frameworks seem to favor a Todo list.

```
var items = ['one', 'two', 'three'];

var TodoList = React.createClass({
  propTypes: {
    items: React.PropTypes.array,
    onClick: React.PropTypes.func
  },
  handleClick: function(itemIndex) {
    this.props.onClick(itemIndex);
  },
  renderItem: function(item, index) {
    return (
      <li key={item} onClick={this.handleClick.bind(this, index)}>
        {item}
      </li>
    );
  },
  render: function() {
    return (
      <ul>
        { this.props.items.map(this.renderItem) }
      </ul>
    );
  }
});

var TodoListController = React.createClass({
  getInitialState: function() {
    return {
      items: this.props.items
    }
  },
  removeItem: function(itemIndex) {
    var newItems = this.state.items;
    newItems.splice(itemIndex, 1);
    this.setState({items: newItems})
  },
  render: function() {
    return (
      <TodoList items={this.state.items} onClick={this.removeItem} />
    );
  }
});

React.render(<TodoListController items={items} />, document.body);
```

[View on JS Bin](https://jsbin.com/wikenekepo/1/edit?html,js,output)

There’s a lot going on here. Lets break it down.

We’re creating two components. `TodoList` and `TodoListController`. A component is a representation of a section of UI. Components can contain other components. This allows you to chunk your UI into small, reusable bits.

Focus on `TodoList` first. We call `React.createClass` to generate a factory implementation of our component. Take a look a the render function we pass to createClass. That’s where the magic happens. Despite appearances to the contrary, this doesn’t return HTML. It returns a representation of our component. We can write it like HTML thanks to JSX. JSX is a Javascript syntax extension developed by Facebook for use with React.

In React terms, the `TodoList` component is a “pure” or “dumb” component because it maintains no state. Everything is passed in via `props`, including what to do when an item is clicked. All the `TodoList` component must do is render a given list of items.

Now lets look at `TodoListController`. This components sole responsibility is to manage the `TodoList` state. The React team refers to these types of components as “controller views”. It wraps the `TodoList` component and passes its state down via `props`. By using the controller component we make our state implementation swappable. More on this in a future post.

Lastly, we call `React.render` to render the component to the given DOM node.

Now that you’ve got an idea of how React works, lets consider its uses.

###### Where it Excels
React excels building read-heavy interfaces. Considering the companies that developed it, this makes sense. Complex dashboards, news feeds, visualizations, and analytical tools are good projects for React. What’s more you may only need React. If you interface has minimal client-side business logic and is primarily a visualization tool, React is perfect.

###### Where it Falls Short
Heavy forms-driven CRUD apps are better served with Angular. You can certainly use React, but you’ll find yourself re-implementing a lot of the functionality Angular gives you for free.

###### Wrapping Up
Building complex UIs is hard. While existing frameworks (again, such as Angular) do a great job with CRUD apps, they struggle with complex interfaces that go outside their use-cases. Enter React. It doesn’t try to be a complete solution. It's more library than a framework. But that narrow scope is part of what draws myself and other developers to it. React focuses on doing one thing and one thing well: building complex UIs. It’s certainly possible to do that with other frameworks, they just don’t offer as much help.