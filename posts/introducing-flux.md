---
title: "Introducing Flux"
date: 2015-12-20T01:32:00Z
link: http://blogs.sequoiainc.com/introducing-flux/
location: Sequoia Blogs
---

It’s not what you think it is. [Flux](https://facebook.github.io/flux/) isn’t a framework. It’s not a library. Most important, it’s not a panacea.

Flux is an architecture. It’s not part of React. You don’t need React to use it. That said, it was born to solve one of React’s problems.

Flux solves the problem of shared state. Going back to my [Introducing React](/introducting-react/) post, imagine we wanted to add a component to our Todo app that displayed the number of todos. Removing a todo would need to update the state held in the `TodoController` and the state held in the new component’s controller-view.

One approach to shared state across components is to wrap both components in a parent component and store the state there.

An excellent solution that should be your first choice.

But as your application grows, such solutions become less feasible. Nested components see you passing props through components that don’t need them. Async actions may need components to update in a defined order to avoid race conditions.

Enter Flux.

## Stores

In Flux, you store shared state in a read-only containers called a store. Components can subscribe to stores and receive notifications when a store’s data changes.

But if stores are read-only, how do we modify them?

## Actions

Actions are simple JavaScript objects that contain new data and a type property to identify them. They flow through a special singleton object called the dispatcher.

## Dispatcher

The dispatcher is like a central hub that broadcasts actions to all subscribed stores.

It also manages the dependencies between stores. This allows one store to wait for another to finish before it takes action.

## Views

Finally, controller-views subscribe to change events on the stores. When these change events fire, the controller-views update their internal state by reading from the store.

## An Implmentation

Let’s take the Todo example from my [Introducing React](/introducting-react/) post and modify it to use a Flux store.

```
var Dispatcher = require(‘flux’).Dispatcher;

var TodoConstants = {
  TODO_REMOVE: ‘TODO_REMOVE’,
};

var TodoActions = {
  remove: function(index) {
    Dispatcher.dispatch({
      actionType: TodoConstants.TODO_REMOVE,
      index: index
    });
  },
};

var _todos = [‘one’, ‘two’, ‘three’];

var TodoStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(‘change’);
  },

  addChangeListener: function(callback) {
    this.on(‘change’, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(‘change’, callback);
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case TodoConstants.TODO_REMOVE:
      _todos.splice(index, 1);
      TodoStore.emitChange();
      break;

    default:
      // no op
  }
});


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

function getTodoState() }
	return {
		items: TodoStore.getAll();
	};
}

var TodoListController = React.createClass({
  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
		TodoStore.addChangeListener(this._onChange);
	}

  componentWillUnmount: function() {
		TodoStore.addChangeListener(this._onChange);
	}

  removeItem: function(itemIndex) {
    TodoActions.remove(itemIndex);
  },
  render: function() {
    return (
      <TodoList items={this.state.items} onClick={this.removeItem} />
    );
  }

	_onChange: function() {
		this.setState(getTodoState());
	}
});

React.render(<TodoListController items={items} />, document.body);
```

Lets walk through the changes.

```
var Dispatcher = require(‘flux’).Dispatcher;
```

This initializes our singleton Dispatcher. Facebook provides a [Flux npm module](https://www.npmjs.org/package/flux) that includes a dispatcher implementation.

```
var TodoConstants = {
  TODO_REMOVE: ‘TODO_REMOVE’,
};
```

This initializes our constants. Constants are used like enums, as you’ll see.

```
var TodoActions = {
  remove: function(index) {
    Dispatcher.dispatch({
      actionType: TodoConstants.TODO_REMOVE,
      index: index
    });
  },
};
```

This initializes our actions. Here you can see how we use the `TodoConstants` to add an `actionType` property to our action. We’ll see how stores use this property momentarily.

```
var _todos = [‘one’, ‘two’, ‘three’];

var TodoStore = assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _todos;
  },

  emitChange: function() {
    this.emit(‘change’);
  },

  addChangeListener: function(callback) {
    this.on(‘change’, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(‘change’, callback);
  }
});

Dispatcher.register(function(action) {
  switch(action.actionType) {
    case TodoConstants.TODO_REMOVE:
      _todos.splice(index, 1);
      TodoStore.emitChange();
      break;

    default:
      // no op
  }
});
```

This is our store implementation. We provide an accessor method, `getAll`, that returns all the todos.

We call `register` on the `Dispatcher` instance. The `Dispatcher` broadcasts all actions to all registered listeners. The listener decides which actions to act on. Here, we pass a callback that listens for actions with an `actionType` of `TodoConstants.TODO_REMOVE`. When the `Dispatcher` broadcasts a matching action, we modify our state and call `emitChange`. This lets components listening to our store know its state has changed.

```
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
```

This is our `TodoList` component. Thanks to utilizing controller-views, we don’t have to change a thing. It doesn’t care where it gets its state from.

```
function getTodoState() }
	return {
		items: TodoStore.getAll();
	};
}

var TodoListController = React.createClass({
  getInitialState: function() {
    return getTodoState();
  },

  componentDidMount: function() {
		TodoStore.addChangeListener(this._onChange);
	}

  componentWillUnmount: function() {
		TodoStore.removeChangeListener(this._onChange);
	}

  removeItem: function(itemIndex) {
    TodoActions.remove(itemIndex);
  },
  render: function() {
    return (
      <TodoList items={this.state.items} onClick={this.removeItem} />
    );
  }

	_onChange: function() {
		this.setState(getTodoState());
	}
});

React.render(<TodoListController items={items} />, document.body);
```

This is our controller-view. We use `getInitialState` to retrieve our state from the `TodoStore`. We also use `componentDidMount` and `componentWillUnmount` to add and remove a listener on `TodoStore`. When`TodoStore` emits a change, we call `setState` with the current store state.

## Wrapping Up

If another component needs to read the `TodoStore` state, it can add similar methods to its controller-view. Alternatively, if it needs to derive state from the `TodoStore`, say to add a notification saying a todo was removed,  it can listen for `TodoConstants.TODO_REMOVE` in it’s own store and act accordingly.

Utilizing controller-views made this a relatively painless change. Good thing too, because in my next installment I’m going to talk about a Flux alternative that’s getting a lot of buzz right now.