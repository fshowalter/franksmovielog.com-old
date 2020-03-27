---
title: "Introducing Redux"
date: 2016-03-14T11:35:00Z
kind: article
link: http://blogs.sequoiainc.com/introducing-redux/
location: Sequoia Blogs
---

[Redux](https://github.com/reactjs/redux) is a paradigm shift.

You’ve heard the axioms. Objects are responsible for their own state, and should never expose it. Global state is the root of all evil.

Redux throws them out the window.

In Redux, you store the entire application state in a single, immutable, atom. This is similar to Flux, with the difference being those two adjectives: single and immutable. Those changes make a big difference.

With immutable state, it becomes trivial to debug an action’s effects. Just diff the before and after states. There’s even [a tool to help](https://github.com/whetstone/redux-devtools-diff-monitor).

With a single atom, you don’t have to manage store dependencies or rely on a dispatcher to funnel the actions. Actions are applied in the order they’re received. You don’t have to inspect multiple objects to reason about your application’s state. Your application becomes a series of functions that take a single input, the state atom.

Thus, it’s not the axioms of object-oriented programming that Redux eschews, but object-oriented programming itself. For the UI side in particular, the functional reactive model is a better fit.

Let’s take the example from my [Introducing Flux](/introducing-flux/) post and convert it to Redux.

```
const TODO_REMOVE = ‘TODO_REMOVE’;

function removeTodo(index) {
  return {
    type: TODO_REMOVE,
    index,
  }
};

const initialState = {
  todos: [‘one’, ‘two’, ‘three’],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case TODO_REMOVE:
      return Object.assign({}, state, {
        todos: state.todos.splice(index, 1),
      });
    default:
      return state
  }
}

const store = createStore(reducer);

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(itemIndex) {
    this.props.onClick(itemIndex);
  }

  renderItem(item, index) {
    return (
      <li key={item} onClick={this.handleClick.bind(this, index)}>
        {item}
      </li>
    );
  }

  render() {
    return (
      <ul>
        { this.props.items.map(this.renderItem) }
      </ul>
    );
  }
};

TodoList.propTypes = {
  items: React.PropTypes.array,
  onClick: React.PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    items: state.todos,
  }
}

export mapActionCreatorsToProps => {
  return {
    removeTodo,
  }
}

const ConnectedTodoList = connect(
  mapStateToProps,
  mapActionCreatorsToProps)(TodoList)

React.render(
  <Provider store={store}>
    <ConnectedTodoList />
  </Provider>,
, document.body);
```

Notice how we dropped our controller view? That’s due to the [react-redux](https://github.com/reactjs/react-redux) library, which provides a `connect` method that generates a wrapper component for us, using the `mapStateToProps` and `mapActionCreatorsToProps` functions.

This makes our components easier to test. We can export the wrapped version of our component by default, but also export the unwrapped component for testing. Then, in our tests, we don’t have to worry about mocking stores. Everything’s passed in via props.

### The Best Part

Now for Redux’s biggest selling point: the developer experience.

Since our state is a single atom, we can inspect that atom at any point to debug our application. The [Redux DevTools](https://github.com/gaearon/redux-devtools) let you browse your app state, complete with undo and redo for actions.

With pure function components, the debug process is simple. Reproduce the bug in your development instance, then step back through the actions to determine what caused the invalid state.

If the state is correct, the bug lies in the component. Write a failing test that takes the current state as an input, then fix the component output.

No more sprinkling `console.log` statements or walking call stacks to trace the state flow. I cannot overstate the effect on developer efficiency when troubleshooting. This is where the extra time invested in writing “boilerplate” reducers and actions pays dividends.

### The Best Gets Better

As much as I love Redux DevTools, there’s a better alternative, provided you're using Chrome: the [Redux DevTools Chrome extension](https://github.com/zalmoxisus/redux-devtools-extension).

Now, I hear you, what’s so great about a browser extension?

With the Chrome extension, you get the Redux DevTools experience on your production instance with no performance penalty. If the user doesn’t have the extension installed, no extra code is loaded. It’s a win-win.

If your integration team finds a bug, walk over, fire up the extension and inspect the state right there. Again, I can’t overstate the effect on developer efficiency.


### Shortcomings

I love Redux and want to use it everywhere, but it’s not perfect.

Redux’s creator, Dan Abramov, is forthright about the library’s shortcomings.

#### Async Actions

Modeling async actions and other side effects is hard. Redux recommends putting them in your action creators. This is similar to the Flux recommendation. There’s an optional middleware, [redux-thunk](https://github.com/gaearon/redux-thunk), to handle action creators that return functions. It’s not ideal, but it works.

#### Component Portability

With traditional components that make use of `setState`, you can package the component and css, and boom, you’ve got a reusable component you can distribute via NPM or the like. Consumers import your component, set the props and it works.

With centralized state, things aren’t so simple. Since components maintain no internal state, they can’t be reused without importing their associated reducer, actions, and constants. This imported reducer must then be combined with any existing reducers. It’s more work and complexity.

I’m okay with this tradeoff. The benefits of centralized state far outweigh the hassle of writing glue code I never touch again.

### Still on the fence?

I saved the best for last. Besides the extensive documentation, Dan Abramov also created [a free video tutorial series on egghead](https://egghead.io/series/getting-started-with-redux). You can watch it, code along, and finish knowing how to use Redux, the ideas underlying its inception, and a full understanding of what it’s doing behind the scenes.

And did I mention it’s only 2kb (including dependencies)? What are you waiting for? Watch the training course and start writing apps that are easier to troubleshoot, maintain, and extend.
