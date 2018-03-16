# React Lifecycles

See the tutorial [React Lifecycles](https://www.lynda.com/React-js-tutorials/React-Lifecycles/592509-2.html)





# 1. Overview of Lifecycles

## Logger overview

Create the app

```bash
create-react-app lifecycle-logger
```

Check the app

```bash
yarn start
```

create docs

```bash
mkdir docs
```

move and rename readme

```bash
mv README.md docs/create-react-app.md
```

create new readme

```bash
touch readme.md
```

edit readme

@ `readme.md`

```markdown
# React Lifecycles - lifecycle-logger App

See the tutorial [React Lifecycles](https://www.lynda.com/React-js-tutorials/React-Lifecycles/592509-2.html)

## Releases

- Release 1.0.0 - Logger setup
```



Delete the files we won't use: `App.css`, `App.test.js`, `index.css`, `logo.svg`

@ `index.js`

Delete

```jsx
import './index.css';
```



@ `App.js`

Delete

```jsx
import logo from './logo.svg';
import './App.css';
```

Render Hello

```jsx
class App extends Component {
  render() {
    return <h1>Hello</h1>;
  }
}
```

Test

```bash
yarn start
```

From tutorial files `FinalProject/src` copy and paste the file `loggerExample.js` into the src folder of our project.

```bash
touch src/loggerExample.js
```

and here's that file

```jsx
import React, {Component} from 'react'
import styled from 'styled-components'

export const logLifecycles = (Wrapped) => {

  let methods = ['componentWillMount', 'componentDidMount', 'componentWillReceiveProps', 'shouldComponentUpdate', 'componentWillUpdate', 'componentDidUpdate', 'componentWillUnmount']

  let oldMethods = {}

  methods.forEach( (method) => {
    if (Wrapped.prototype[method]) {
      oldMethods[method] = Wrapped.prototype[method]
    }
    Wrapped.prototype[method] = function () {
      console.groupCollapsed(`${Wrapped.displayName} ${method}`)
      let oldFunction = oldMethods[method]
      if (method === 'componentWillReceiveProps' || 'shouldComponentUpdate'|| 'componentWillUpdate') {
        console.log('nextProps', arguments[0])
      }
      if (method === 'shouldComponentUpdate'|| 'componentWillUpdate') {
        console.log('nextState', arguments[1])
      }
      if (method === 'componentDidUpdate') {
        console.log('prevProps', arguments[0])
        console.log('prevState', arguments[1])
      }
      console.groupEnd()
      if (oldFunction) {
        oldFunction = oldFunction.bind(this)
        oldFunction(...arguments)
      }
      if (method === 'shouldComponentUpdate' && typeof oldFunction === 'undefined') {
        return true
      }
    }
  })


  Wrapped.prototype.setState = function (partialState, callback) {
    console.groupCollapsed(`${Wrapped.displayName} setState`)
    console.log('partialState', partialState)
    console.log('callback', callback)
    console.groupEnd()
    this.updater.enqueueSetState(this, partialState, callback, 'setState')
  }


  return class extends Component {

    static displayName = "Logger"

    render() {
      return (
        <Wrapped
          {...this.props}
        />
      )
    }
  }

}


class ParentComponent extends Component {


  static displayName = "Parent"

  state = {
    random: Math.random(),
    showChild: true
  }

  newRandom = () => {
    this.setState({random: Math.random()})
  }

  toggleChild = () => {
    this.setState((prevState) => {
      return {
        showChild: !prevState.showChild
      }
    })
  }

  render() {
    let {showChild} = this.state
    return (
      <ParentContainer>
        <h2>Parent</h2>
        <button
          onClick={this.newRandom}
        >
          Pass New Props
        </button>

        <button
          onClick={this.toggleChild}
        >
           {(showChild) ? "Hide" : "Show"} child
        </button>

        <h3>this.state.random {this.state.random}</h3>

        {
          (showChild) ? (
            <WrappedChild
              random={this.state.random}
            />
          ):
          (
            null
          )
        }


      </ParentContainer>
    )
  }
}

class ChildComponent extends Component {

  static displayName = "Child"

  constructor(props) {
    super(props)
    this.timer = setInterval(
      ()=>{
        console.log("timer")
      },
      3000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    return (
      <ChildContainer>
        <h3>Child</h3>
        <h4>this.props.random: {this.props.random}</h4>
      </ChildContainer>
    )
  }
}

const WrappedChild = logLifecycles(ChildComponent)

export const LoggerExample = logLifecycles(ParentComponent)


const ParentContainer = styled.div`
  width: 50%;
  height: 500px;
  margin: auto;
  background-color: salmon;
  display: flex;
  align-items: flex-start;
`

const ChildContainer = styled.div`
  width: 50%;
  height: 300px;
  margin: auto;
  background-color: lightgreen;
  align-self: center;
`

```



@ `index.js` 

```jsx
import {LoggerExample} from './loggerExample'
```

Check out the other modules you can import from this file...



Edit @ `index.js` to look like this

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
// import App from './App'
import registerServiceWorker from './registerServiceWorker'
import {LoggerExample} from './loggerExample'

// ReactDOM.render(<App />, document.getElementById('root'))
ReactDOM.render(<LoggerExample />, document.getElementById('root'))
registerServiceWorker()

```

So we are temporarily rendering the `LoggerExample` instead of the `App`

This example code requires some dependancies

```bash
yarn add styled-components
```



### Commit to Git & Github

Initiate Git, push to a new Github repo, Tag and push a new release.

```bash
git init && git add . && git commit
```

Add to a Github repo...

Push to Master

```bash
git push -u origin master
```

Tag and push a release

```bash
git tag -a 1.0.0 && git push origin 1.0.0
```



### Test the app

Test the app

```bash
yarn start
```

**What's happening here:**

> Check out the console. We're building a logger. Already we see some lines have appeared. It says Parent componentWillMount, Child componentWillMount, Child componentDidMount, and then Parent componentDidMount. And what's happening is every time one of the lifecycle methods gets run by one of our two components, either parent or child, we're going to see that happen in the console. 
>
> We can use the button to pass new props. And when we pass the new props, we see our console run through each of the lifecycle methods that happen. We can also see what happens when you hide a child. We see that the componentWillUnmount. 
>
> So that's an overview of the higher order component we're going to create today. Let's get started.



## Building a higher-order component

Higher-order components are functions that accept a component, or multiple components, as arguments and then return a new, modified component. 

The reason we're talking about higher-order components is because React developers have found that this is a design pattern that allows us to reuse lots of code and add functionality to components without completely re-writing new components.

Our logger is itself, a higher-order component because it's taking in a component and then it's outputting that same component but with some modifications. 

On the rendered page, we've got this red box that says Parent and has these buttons in it and then inside of it, it has it's child. 

And so it's child is another component. 

But now, if you look on the right here in the Console, you can see that we've got this kind of cool functionality where every time one of our Parent or Child invokes a life cycle method, those are logged to the Console.

Now that's not something that would happen on it's own. That's not something that React does, that's the result of our higher-order component. So our higher-order component has this unique ability to look at the Parent component or the Child component or any component that it's wrapping and know when any of the wrapped components call a life-cycle methods and then log it to our Console. 

So that's how we're going to be implementing this higher-order component design pattern in this course and I know that higher-order components can sometimes seem a little confusing or intimidating so just to prove to you that you can make one and show you that they're not as confusing as they sound, we're going to make one right now.

We're just going to take a button and we're going to turn it blue. So you can imagine that maybe you have a website and you've got this component that you use throughout the website and now you have this new area where you want to reuse that component but you just want to add one more bit of styling that will otherwise leave that component unchanged. You just want to turn it blue. That would be a good opportunity to implement a higher-order component. So let's try that now.

@ `index.js` 

Lets comment out the LoggerExample

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
// import { LoggerExample } from "./loggerExample";

ReactDOM.render(<App />, document.getElementById("root"));
// ReactDOM.render(<LoggerExample />, document.getElementById("root"));
registerServiceWorker();

```

@ `App.js` write a new function that takes in a component.

```jsx
function myTestWrapper(WrappedComponent){
  return class extends Component {
    render() {
      return (
        <div
          style={{
            backgroundColor: "blue"
          }}
        >
          <WrappedComponent/>
        </div>
      )
    }
  }
}
```

Now feed the `App` component in this function (or, wrap the App component in this function.)

```jsx
App = myTestWrapper(App)
```

Now it's possible you've worked with higher-order components before and you didn't realize it. You could have used **Redux** or you could have used **Styled Components**. And in those cases, what we're doing is we're putting a component into a function and returning that same component with a few modifications.

Test 

```bash
yarn start
```

Now we have wrapped the `App` component (which prints "Hello" to the screen) in a `<div>` with a background color of blue

Read the docs [React - higher-order-components](https://reactjs.org/docs/higher-order-components.html)



## Virtual DOM

Now that we know what a higher order component is, we can spend a bit more timelooking at each of the lifecycle methods that we're going to be talking about today. 

When we think of the React lifecycle methods, we can break them into three distinct categories. 



![img](https://dl.dropboxusercontent.com/s/o67q4ymuvqca1en/react-lifecycle-methods.png?dl=0)



We have our methods that happen during the **creating phase**, we have our methods that are happening during the **mounting phase**, and we have those that are part of the **updating phase**. 

You'll actually see that some of these methods get called in multiple different cycles. So `render()`, for instance, happens in both mounting and updating. You also could argue that constructor is part of creating, but that's just how we're going to group them today.

Before we start going into each of the lifecycle methods, let's briefly review the way that React updates the DOM, or the document object model. 

![img](https://www.dropbox.com/s/f84qub6ao5wgeae/virtual-dom.png?dl=1)

If you're familiar with React, you've heard of the idea of the virtual DOM. 

It's a JavaScript object in memory that represents what the website looks like. So a lot of the speed bonuses that you get for using React is because it is diffing the virtual DOM versus the real DOM and trying to minimize the number of changes it makes to the real DOM. 

React is already fairly performant on its own, but by leveraging the lifecycle methods correctly, we can improve that out of the box speed. 

A good understanding of the lifecycle methods will allow us to ensure our components are achieving the right functionality with the most efficient amount of code and help us avoid quirky, asynchronous problems involving state changes. 

In the coming videos, we'll be looking at each of these individual methods and logging them in the console so we can see exactly why they fire and when they fire.



# 2. Defaults, Initialization, and Construction

## displayName

@ `App.js`

get rid of the test wrapper, so it looks like this

```jsx
import React, { Component } from 'react'

class App extends Component {

  static displayName = "SomethingNew"

  render() {
    return (
      <h1>
        Hello
      </h1>
    )
  }
}

export default App
```

Notice we have give this component a name

```jsx
static displayName = "SomethingNew";
```

Run the app

```bash
yarn start
```

Go to the React tab here you can see this component now has this name.

Outside of the component we could also set the `displayName` like this.

```jsx
App.displayName = "Whateverwewant";
```

and that would do the same thing.



## defaultProps

The purpose of `defaultProps` is to ensure that when a component begins its existence, it has certain props available to it right away. So `defaultProps` will be used instead of passed down props if the passed down props are undefined. 

So when would I use default props? Well, let's look at a few examples.

In many cases, `defaultProps` might be useful if, for instance, you had an array that needed to be looped through once the component begins, or if you had some sort of data type that you need to make sure exists when the component starts, otherwise it might cause an error.

Once again, just like with `displayName`, we can set it in two different ways. We could say 

```jsx
static defaultProps = {
    someImportantArray: [apples, oranges, bananas]
}
```

Or we could do the same thing that we did earlier. We could say 

```jsx
App.defaultProps = {
    someImportantArray: [apples, oranges, bananas]
} 
```

Lets use the first syntax and `console.log()` the props 

@ `App.js`

```jsx
import React, { Component } from "react";

class App extends Component {
  static displayName = "SomethingNew";

  static defaultProps = {
    someImportantArray: ["Apples", "Oranges", "Tires"]
  };

  render() {
    console.log(this.props);

    return <h1>Hello</h1>;
  }
}

export default App;

```

Test it

```bash
yarn start
```

Check the console log.

Also look under **React Tools** to see the props with the array...

One thing that I want to call out again is that the default props aren't necessarily a part of the life-cycle methods. That means they're not going to get called over and over again. 

They're actually just going to be called once, when your code is initially run. That's an important thing to remember.



## Initial state

Delete the props and console log from the previous lesson...

I want to draw attention to the fact that there used to be a React method that called initial state and would actually set your component's initial state. But, the way that the react API works right now is we actually have simpler ways of setting the initial state and that old method has been depreciated. 

So, let's look at the two different ways we can give our component an initial state. Now, setting the initial state of your component is not a static method like `displayName` or `defaultProps`.

That actually makes it even more simple to set it, so you can just say (within the component...)

```jsx
state = {
    ourInitialState: "golden"
}
```

or, we can use the constructor

So, if you're not familiar with some of the newer JavaScript syntax, you might not know what a constructor does, but a constructor is a function that all classes have access to, not just react components, all classes have access to constructor and it's called when they are instantiated.

So, when that particular instance of that class is created, that's when the constructor is called. 

So, that's a good place for us to setState if we want to use this method. Now, another thing we should know is that if you want to access the default props during the constructor, you need to make sure that you're passing the props into the constructor and then you're calling super on those props.

Once again, if you're not super familiar with classes, essentially what we're doing here is that we are taking the props, which are an argument, that are being passed into our created component and we're making sure that those props get passed along to the base class that component is being extended from.

@ `App.js`

```jsx
  constructor(props) {
    super(props)
    this.state = {
      whateverValue: "we want"
    }
  }
```

and lets render the state in the log...

```jsx
console.log(this.state);
```



Interestingly, although we are logging variables to the console, the React Dev Tools show the props and the state for a component - out-of-the-box...

**One other thing that I want to point out is that in the constructor method is the only time you should ever directly mutate state. In the rest of your component, you should use the this.setState method, but in your constructor, this is the only time you can directly change state.**



## Constructor

I touched a bit on the constructor function in the video where we spoke about setting our initial state. That's definitely a great use case for the constructor function, but another common way you're going to see developers use the constructor function is to call the `.bind(this)` method on any functions you might be using inside your component. 

Now, `.bind(this)` is not a method that's exclusive to React, **in fact, actually, it's just a method that's available to all JavaScript arrays**. But you often see it because React uses the class syntax, and people want to change the context of `this`.

@ `App.js` 

Delete lines 9 through 11, we don't need those, and we're going to get rid of line 5. 

So now we just have our constructor function that's taking in the props and passing them to its parent component via super.

For us to be able to use the `.bind(this)` method, we need to have some methods declared inside of our component that we're going to call it on. 

So I'm just going to come up with some arbitrary functions for an example

```jsx
  oneFunction(){
    console.log("oneFunction")
    console.log(this.props)
  }

  useArrows = () => {
    console.log("useArrows works without binding")
    console.log(this.props)
  }
```

So let's scroll down, and we're going to put two buttons on our page. 

```jsx
  render() {
    console.log(this.state)
    return (
      <div>
        <button
          onClick={this.oneFunction}
        >
          test oneFunction
        </button>

        <button
          onClick={this.useArrows}
        >
          test useArrows
        </button>
      </div>
    )
  }
```

Each button has one of our methods attached to its `onClick()` event handler.

We'll see what `this.props` looks like from inside both of these functions. 

Run the app `yarn start`

We will press the 'test oneFunction' button. And wow, look at that, right away we get an error. 

The reason it's giving us an error is because it cannot read property `props` of null. So that means that `.this` within `oneFunction()` is null. That's a little confusing right now. I don't quite understand why that's happening,... 

So let's refresh the page, and let's see what's happening with `useArrows = () => {}`. 

See now when we run the `useArrows = () => {}` function, our console logged `this.props`, is not null. 

I know that's a bit confusing to have to keep using the word `this`, but the context of `this` within the `useArrows = () => {}` function is not null, so let's talk a little bit about why that's happening.

The difference here is that `useArrows = () => {}` is an arrow function, and thus preserves the context of its parent, of the wrapping function. 

**Whereas `oneFunction()` does not. One function has its own `this`. `This` within `oneFunction()` is different from what it is outside of `oneFunction()`.** 

So one solution for us to fix this problem is to make our functions into arrow functions. 

Another, **which you'll often see**, is to use the `.bind()` method in the constructor.

If I want one function to be able to access the right context of `this` when it's called within render, I can, in the constructor, say `this.oneFunction = this.oneFunction.bind(this)`. 

What we're doing here is we're using the `bind()` method, which is available to all functions, to pass in a new context that will be the context of `this` for `oneFunction()`.

```jsx
  constructor(props) {
    super(props)

    this.oneFunction = this.oneFunction.bind(this)
  }
```

So let's try this out.

Okay, cool, so now we've fixed our problem where `oneFunction()` thought that it's context was null, and it wasn't able to access `this`. 

**The constructor is a great opportunity to set your components' initial state, but it's also a great opportunity to `.bind(this)` to any functions that might not be using arrow functions syntax.**



# 3. Mounting

## Creating your logger

Clean up `App.js`

```jsx
import React, { Component } from "react";

class App extends Component {
  render() {
    return <div>Hello</div>;
  }
}

export default App;

```

Create a new file

```bash
touch src/loggify.js
```

loggify is going to be the name of the function that we're going to call to create our higher order component.

Import dependancies

```jsx
import React, {Component} from 'react'
import styled from 'styled-components'
```

create the loggify function

```jsx
export default function loggify(Wrapped) {

  return class extends Component {
    render() {
      return (
        <LoggerContainer>
          <H2>
            {Wrapped.displayName} is now loggified:
          </H2>
          <Wrapped
            {...this.props}
          />
        </LoggerContainer>
      )
    }
  }
}
```

So `loggify()` is a higher order component that wraps a component we pass into it.  

We have an `<H2>` component but what do I mean when I say `{Wrapped.displayName} is now loggified:` 

Well, remember we're importing `Wrapped`, which is a component that's going to be returned within the `render()` function. And in an earlier chapter we chose to set a display name on that component. So we can access that display name here from inside our new component. 

And I'm going to make sure that if `Wrapped` has any props, that they are being passed along to it. So I'm using the spread operator on `...this.props`, to ensure if there's any props that should be intended for `Wrapped`, they're going to get to the component. 

So we have a `<LoggerContainer>` component which contains an  `<H2>` component and the `<Wrapped />` component which we are feeding into `loggify()`.

We need to make the `<LoggerContainer>` and the `<H2>` components we are using in our render function and  we'll use [Styled Components](https://www.styled-components.com) for that...

```jsx
const LoggerContainer = styled.div`
  background-color: aliceblue;
  border: 2px grooved aquamarine;
  border-radius: 5px;
`

LoggerContainer.displayName = "LoggerContainer"

const H2 = styled.h2`
  color: blueviolet;
`

H2.displayName = "H2"
```

If you haven't used [Styled Components](https://www.styled-components.com) before, essentially what they allow us to do is use a template literal with CSS rules, to make a React Component that has all of those rules applied to a class name Styled Components will create which is specific to that component.

Because `const LoggerContainer`, and `const H2`, are both themselves React Components, I can set their display names.

So we can see if this works. So if we call `loggify()` on app, and then render app, it should look exactly the same as it was before, except for these styling rules should be applied on the div outside of it.

@ `App.js`

```jsx
import React, { Component } from 'react'
import loggify from './loggify'

class App extends Component {

  render() {
    console.log(this.state)
    return (
      <div>
        Hello
      </div>
    )
  }
}

App = loggify(App)

export default App

```

Remember, `loggify()` is a function, so we want to set our `App` variable equal to the result of calling `loggify()` on `App`. 

So we're going to transform `App` with this higher order component function, and then in the end we're going to export that new wrapped version to index, which will render it. 

Run the app `yarn start` and you can see now when we inspect this, using our react devtool, we can see that we have this nice logger container that includes our H2, and inside of it, is our original app. So our app is being contained inside of our logger container.

All right, so now the framework is laid for our logger



## componentWillMount

We're going to talk about the React lifecycle method, `componentWillMount()`. 

Now, I'll be honest with you, `componentWillMount()` is probably the least used lifecycle method and maybe one of the least useful. 

It fires only once, before your component is about to mount, and **you cannot set state within it**. I'll say that again. **It's important that you do not set state within `componentWillMount()`**. 

**You also shouldn't call functions that might result in setting state.** Now, you're maybe thinking, wait a second, I've done that or you've seen people do that and that's actually very possible.

Often-times, you'll see people set up subscriptions or make calls to remote APIs here within `componentWillMount()`, but, technically, this is not the best place to do that. The reason for this is, before your component is mounted, it actually doesn't have a state, so you can't set a state. 

So, if there were a scenario where you made a call to a remote API and the response got back before your component actually did mount, then that set state would fail. 

Now there is one good scenario where you might use `componentWillMount()` and that would be if you're running a universal React application or isomorphic React application or some sort of React application that is actually mounting on the server.

So, one of the cool things about `componentWillMount()` is that, if you are creating your React component on a server and then sending it to the client, `componentWillMount()` is the only lifecycle method that actually gets called on the server and not on a client. 

So, now that we have some background on `componentWillMount()`, we're going to put in some key functionality to our logger and set up our logger so that it will tell us whenever our component calls `componentWillMount()`. 



@ `Loggify.js` 

On line six, I'm going to start by declaring `let originals = {}`. 

So, this is where we're going to store some methods. We're actually going to store copies of functions that are a part of the Wrapped component that's being passed in. (We'll talk more about that in a little bit.) 

And then we're also going to make a constant `const methodsToLog = ["componentWillMount"]`, we're going to list all of the methods that we want to log. 

So, eventually, we'll have all of our React lifecycle methods in here, but, for now, we're just going to start with `componentWillMount()`. 

Okay, I'm going to run you through what our plan is here, before we start doing it and the idea is that we are going to look at this Wrapped object that is being passed to us.

We're going to inspect its prototype and we're going to loop through these methods that we intend to log and then we're actually going to modify each of those individual methods, the ones that are on the prototype, and we're going to change them to add a `console.log()` to them, but then we're also going to make sure that we call the original one, so that the component still functions. 

All right, so that maybe was a little confusing. Don't worry, you'll see as we do it. I also want to raise a disclaimer here. ***If you go through the React documentation, it'll actually tell you that you shouldn't modify a component's lifecycles methods.***

And that is true. 

If you are making a production component, you're not going to want to modify the lifecycle methods. You could damage your components and, basically, make them un-usable in a production environment. 

I, however, know that what we're doing right now will work for our cases, for this educational case, and it'll let us be able to see what those methods are doing. 

So, remember this is something we can do to test out a component and it's good for helping us understand the way a component works, **but you shouldn't be modifying the methods of a component in a production environment.**

And with that disclaimer, we can get started on the next video.



## Modifying the prototype

As I mentioned in the last video, our game plan here is that we're going to create this object that we've called "originals" and it's going to hold copies of the wrapped components original methods. 

And then we also have this veriable called `methodsToLog`and it's an array. And in it, it's going to contain the names of all them methods we're going to want to loop through. So we're going to look at all of the methods of our wrapped component but we only actually want to modify the ones that we have here in this array. 

Alright so let's start. We're going to call `.forEach()` on `methodsToLog`

For each is a method that's available on an array. And it'll be called once for each element in the array. And then we're going to name each of those elements in the array "method". That's how we will refer to them within this loop. 

And we'll make an arrow function `(method) => {)` that's going to be called for each element in the array. 

And we make an "if statement" and we're going to say

```jsx
    methodsToLog.forEach( (method) => {
    if (Wrapped.prototype[method]) {
      originals[method] = Wrapped.prototype[method]
    }
```

Okay, so this is maybe a little confusing. And I'm going to explain what's happening here. Essentially what we're saying is, go through all of the methods to log that we've put in this array. 

Now look at the prototype of our original `Wrapped` component, look at each of the methods on it's prototype.  And if you find one, with one of the names that we've listed on this array, then just copy it into this originals object. 

Alright, so that's all we're doing here on lines 12 through 16. 

In the next part, we're going to replace the function that we just copied off the original. We're going to replace it with a new one that we're going to write now. That's going to have all of the old functionality because remember we preserved the old functionality by saving it onto this originals object. And then we're going to add a little bit of new functionality. In our case, we're just going to console log something. So the way we're going to do that, is



```jsx
    Wrapped.prototype[method] = function(...args) {

      let original = originals[method]

      console.groupCollapsed(`${Wrapped.displayName} called ${method}`)

      console.groupEnd()

      if (original) {
        original = original.bind(this)
        original(...args)
      }

    }
```

Don't worry we're not going to write any more of this. We wrote it once and now it'll work for a component and we'll maybe make a few more additions to our logger but this was the trickiest part. 

And to recap what's going to happen here, we copied the prototype method and then we re-wrote it, we over-rode it. And then we're making sure to call the original. 

Okay, so let's save this. 

Test App

```bash
yarn start
```

If this works as we intended, we should, on our page, see that when our component mounts, it will also console log that it mounted. 

We can see here that we have "blank is now loggified" and so we see that it started to log it but it didn't actually have a display name. And the reason that is is because, when we go back to our `App.js` file, we see that we deleted our `displayName`. So let's add that. Here in line six, we'll add our display name. And we'll just call this App. 

```jsx
static displayName = "App"
```

And we'll go back to our browser. And cool, now we can see that our logger works. So it shows up on the top on the Dom that it's been wrapped that it's now been loggified. 

And when `componentWillMount()` gets called by the wrapped component, it calls that out for us. 

So now we have our first life cycle method being logged by our logger. 



## render

Unlike ``componentWillMount()``, which is perhaps the least used of the React lifecycle methods, `render()` is definitely the most used. It's probably the most iconic. When you think of a React component, you think of that render statement that then has the JSX/HTML elements in it that represent what you're actually going to put onto the page. 

**One thing that's important to know about `render()` is that you cannot make any untriggered calls to set state in your render function.** 

@ `App.js`,  I'm going to delete what's on line 9. 

If I decided that I wanted to say, okay, when you render, call this.setState and make newThing equal to some string… If I wanted to do that, that is not a good idea. 

Actually you can't do it. It'll crash your app, because it's going to create an infinite chain of setting state and re-rendering, setting state and re-rendering. Because a re-render will occur whenever there's a change to state or there's a change to props. So don't do something like this. 

```jsx
  render() {
    this.setState({newThing: "someString"});
    return (
      <div>
        Hello
      </div>
    )
  }
```



**Another thing to understand is that a render statement expects for you to return something at the end of it.** So that maybe seems obvious, but if you're going to have a render statement that you've decided for some reason isn't going to make a component. It's not going to put anything on the page. Then you should have it return a null value, 

```jsx
  render() {
    this.setState({newThing: "someString"});
    return null
  }
```

or you need to have it return an empty element. But either way, you need to make sure that your render is returning something. Another important piece of information that is useful with render is that even though you can't call set state within this render body, I think sometimes we forget that render itself is a function that does have an opportunity for you to do more operations here before you end up returning something. 

So a lot of times what you'll see is, people will disassemble some object that is in state. So a lot of times people will use this as an opportunity to make their code a little bit more readable, and they'll disassemble some object that's in state. 

```jsx
render() {
    let {someObject, thatIs, In} = this.state;
    
    return (
      <div>
        Hello
      </div>
    )
  }
```

But you might also be able to do some calculations here or do something that you want to happen that occurs each time your component renders. That would be completely fine as long as you don't set state.

So now I know that you are excited to add render to our logger, but actually, there are some difficulties with that, because we don't want to modify the render function on the prototype. I know that I said in the previous video it's actually not a great idea to render any of the methods on a prototype in a production environment, but we're choosing to do that for our educational and logging reasons. 

But actually, you can't even do it with render. You'll break your component. So unfortunately we are going to leave render out of our logger, but the nice thing about render is it is one thing that actually shows you when it happens, so you'll be able to see it on the page. 

All right, so that concludes our discussion about render. We will talk about render a bit more when we get into our update lifecycle methods, because render actually is unique in that it occurs both in the mounting lifecycle methods and in the updating lifecycle methods. So learn to love it, and we will talk about render again in a little bit.



## componentDidMount

When we call `componentDidMount()`, it means that our HTML elements have now been officially rendered to the page, and we may access them. This means that we can use `refs` for particular elements, and we can also make calls to `setState()`. 

`componentDidMount()` is a great place for us to make an external call to an API, if the result of that call will end with a state change.

So, let's make a dummy function that will pretend to fetch data from a remote API.  It will console log, "We're going to fetch data," and then we're just going to use a timeout, with `setTimeout()`, to simulate an asynchronous request. 

@ `App.js`

```jsx
  fetchData = () => {
    console.log("Going to fetch data!")
    setTimeout(
      () => {
        console.log("Data retrieved")
        this.setState({
          data: Math.random()
        })
      },
      1500
    )
  }
```

So, we're imagining we made a call to our remote API, and we got back some data, and we'll just put in a random number using `Math.random()` to represent that data. And we'll have this happen a second and a half, so 1500 milliseconds after it gets called, so that's how long it'll take for our request to complete. 

And we're going to try putting this in componentDidMount. 

@ `App.js`

```jsx
  componentDidMount(){
    this.fetchData()
  }
```

So, is it okay to setState in response to something that happens in `componentDidMount()`? 

All right, let's give it a shot. We'll press save, and we'll go to our page. You maybe saw it blink there really quick, but we'll refresh it. 

So, right when our component mounts, it says going to fetch data, and then when that data gets back, it sets state, and for all intents and purposes, it looks like everything worked. 

I don't see any errors. 

All right, now we're going to go to our `loggify.js` file, and we're going to add `componentDidMount()` to our array that contains the methods we intend to log. 

@ `loggify.js`

```jsx
  const methodsToLog = ["componentWillMount", "componentDidMount"]
```

We'll save our file, and now let's open things up again and see what happens. 

And it looks like we're getting an error, and that's because it can't read the property data of null. Ah, this is a good thing to remember. **If we're going to be accessing an element of state in our render function, we need to make sure that we have a default.** 

So right now, that key data doesn't exist on our state object, so we need to make sure we set an initial state, like we did in a previous video. Remember, we could do that inside the constructor, but I like to use the syntax, where we just say `state =`,...

@ `App.js`

```jsx
  state = {
    data: "No Data yet!"
  }
```

So now let's go back to our page and see how things work. We'll refresh it, and you can see that there's no data yet, and then it changes to our new `Math.random()` data once it arrived. And, we also see in our console that it says "app called componentDidMount", so our logger is successfully notifying us every time `componentDidMount()` gets called. 

And this fits it should first say componentWillMount, and then it does componentDidMount. 

Another good application of componentDidMount is to access `refs`, or `	this.refs`. If you're not familiar with `refs`, know that they're a specific reference to an HTML element, and they can be accessed with `this.refs`. 

You might use them in the case of a stateless input, or a stateless text area, you might also use them to get at a canvas. 

So, I'll show you how you can use `this.refs` in `componentDidMount()` to access a **canvas** element. 

@ `App.js`  we're going to go down below our `<h4>`, and we're going to make a canvas element

```jsx
<canvas ref={"appCanvas"} height={200} width={200} />
```

And now, we can go back up to `componentDidMount()`, and this is a good place for us to start accessing that canvas ref. 

If we tried to do it in `componentWillMount()`, or in the constructor, it wouldn't work. It would cause an error because there is no canvas yet, it hasn't been rendered. So, we'll say 

@ `App.js`

```jsx
  componentDidMount(){
    this.fetchData()
    const canvasCtx = this.refs.appCanvas.getContext('2d')
    canvasCtx.fillStyle = "blue"
    canvasCtx.arc(75, 75, 50, 0, 2 * Math.PI )
    canvasCtx.fill()
  }
```

So, what I'm doing here is I'm making a variable that I'm calling canvasCXT (you can call it whatever you want) and then I'm accessing `this.refs`. 

(You could go ahead and console log `console.log(this.refs)` if you were curious about what other `refs` you might have available to you. )

And since I named this `appCanvas`, I'm going to get the one that's called appCanvas. And then, part of the canvas API asks that you specify the context, and in this case, we're going to do 2d. 

Then, we're going to use this variable that we created on line 27 - `canvasCtx`, and we're going to set some properties on it. These are from the canvas API. And we're just going to set a fill style.  Then, we're going to make a circle, just something simple. So, what I'm doing here is I'm inputting the properties for this arc that we're making, and this is just going to give us a nice little circle. 

And then, we want to take our circle and fill it with our fill color. 

All right, so if you're not familiar with the canvas API, don't worry. This is just to demonstrate that `componentDidMount()` is a good place to access `refs`. 

So, let's save this, and we'll go back to our file, we can see that our canvas is drawing a circle for us.

## componentWillUnmount

`componentWillUnmount()` is a great opportunity for us to tell our component to clean up after itself. 

Maybe we have some timers that we want to clear, or maybe we have some `refs` that we want to make sure are emptied. By strategically using `componentWillUnmount()`, we can make sure we're putting an end to any processes that might hurt our apps performance. 

We're going to make a sub-component of our parent component and it is going to be polling...

It's a common practice to have an API that you polling for changes in data. And a lot of times that will use something like `setTimeout()` or `setInterval()` to periodically go and get information. 

Now if you have an interval that is set up on your application but you don't put an end to it when the component unmounts, it might keep running and there could be a scenario where you have tons and tons and tons of duplicate intervals running all at the same time and it eats up all your applications memory. 

So let's try using `componentWillUnmount()` in a situation like that. 

The first thing we're going to do is build out some functionality so that we can hide and show a component, because if we can't hide and show a component then we'll never trigger componentWillUnmount. 

So we're going to go here into the render function of our parent component and on line 35, we're going to disassemble a key value pair from state. 

@ `App.js`

```jsx
let {showPollChild} = this.state
```

`showPollChild` is just an arbitrary Boolean variable that will tell us whether or not we are showing our child and we'll take it out of the `this.state` object. 

And then we're going to put a button beneath our canvas.

We're going to use the expanded syntax of setState, we are passing in a argument as the first part of this `this.setState` and then we're returning an object that will reflect the changes we want to be made to state. 

So we expect showPollChild to be a Boolean and we're saying, when we click this button we want to toggle its value. So if it's true make it false, if it's false make it true. 

And then here on line 56, we'll just add a little ternary operator that will just change the text of this button depending on whether or not the PollChild is being hidden or being shown. 

@ `App.js`

```jsx
        <button
          onClick={()=>{
            this.setState((prevState) => {
              return {
                showPollChild: !prevState.showPollChild
              }
            })
          }}
        >
          {(showPollChild) ? "Hide" : "Show"} PollChild
        </button>
```

And so basically what we're saying here on line 57 is we're saying, if the PollChild is being hidden then the text on the button should say showPollChild and if the PollChild is being shown, then the text on the button should say hidePollChild, 

Finally, here on line 59, we're going to make a similar statement, so I'm going to copy and paste this. And this is where we're actually going to use the Boolean value there to hide or show our PollChild. 

So we're going to write this in a pretty succinct way. 

@ `App.js`

```jsx
{(showPollChild) ? <PollChild/> : null}
```

We're just saying, if the `showPollChild` Boolean is true, then render this component which we haven't yet made but we will in just a second, and if it's false, then just don't show anything. 

Okay so now our parent component is ready to hide and show our PollChild child component and in the next video, we're actually going to make that child component and show how we can use `componentWillUnmount()` to improve our applications performance.



## Cleaning up intervals

In the last video, we got our parent component ready to show this new component, and now, we're going to create that new component. 

So here, on line 66, we are going to declare a new class that will be a component. And we're going to set its displayname. We'll call it Pollchild. 

@ `App.js`

```jsx
class PollChild extends Component {

  static displayName = "PollChild"

}
```

And we're also going to call `componentDidMount()` in this child, and this is where we're going to start polling for data, so we're going to call our `this.pollData()` function. 

@ `App.js`

```jsx

  componentDidMount() {
    this.pollData()
  }

```

And you might be saying we don't have a polldata function, don't worry, we'll write that right now. 

In this `pollData()` function, we're going to make a call to `setInterval()`, and the way we're going to do that is we're going to create a variable on our prototype, and we're going to call it this.pollinterval, and we're going to say it's equal to setinterval, so we're using the javascript method, and set interval has two arguments, the first is a function, that will be invoked on each of the intervals, whenever it hits that interval it'll call this function. 

And so, in our case, we're just going to say `console.log(Poll!)` and then, we'll also change something in state so we'll say `poll: Math.random()`, and we'll just have a new random number. 

And the second argument of setinterval, is just a number that reflects the number of milliseconds you should wait between each interval. So, we'll do it every second, so that's a thousand milliseconds. 

@ `App.js`

```jsx

  pollData = () => {
    this.pollInterval = setInterval(
      () => {
        console.log("Poll!")
        this.setState({
          poll: Math.random()
        })
      },
      1000
    )
  }

```

And then, we need to make sure that our component has a render function, so that it's actually showing something on the page. 

And we're going to put something pretty simple inside of our PollChild render function. We're just going to make a h4, and inside this h4, we're going to say this is our poll, and we're going to make it equal `this.state.poll`

If you remember, poll is being set inside of our set interval here, and it's just being set to a random number every one second. 

`App.js`

```jsx
  render() {
    return (
      <h4>poll: {this.state.poll}</h4>
    )
  }
```

So let's save this page, and see what happens in the browser. 

So now you can see we have this button that says "Show PollChild", and I'm expecting when we press this, it's going to show this component that we just created. 

Let's give it a shot. 

Okay, and so we're getting an error here, and this is because we are trying to access the property poll of state, and state actually doesn't exist yet, so we need to create an initial value for our poll on state, so if we go back to our component, and at the top here, we just initialize state with a poll value of some other kind of math.random, so this way, when our render function tries to access a key value pair on state, there'll actually be a key value pair to look at.

@ `App.js`

```jsx
  state = {
    poll: Math.random()
  }
```

Okay, and let's try to show our pollchild again, great, and we can see its got an initial value, and then every one second it is console logging poll, and it is changing this value. 

So, now let's try hiding our pollchild. 

And you can see right away, we get an error, and that's because our interval is still running. And not only is our interval still running, every time it runs, it's trying to make a call to set state. 

But it's trying to call set state on a component that isn't mounted, and that is a no-go, or as our documentation says, this is a no-op. 

So, we need to make sure that we go in, and we leverage `componentWillUnmount()` to ensure that that interval gets cleared, and our component stops trying to access state, and stops running this process, when it's not on the page. 

So, let's go back to our component, and I think we'll do it here beneath `componentDidMount()`, we'll call `componentWillUnmount()`. 

This is our opportunity to use clear interval, so on line 83, we set our interval, and now we can just call `clearInterval(this.pollInterval)`. 

This variable I'm accessing is the one that I set our interval equal to. And now, whenever this component unmounts, it's going to make a call to this. 

@ `App.js`

```jsx
  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }
```



We're also going to do one other thing. We are going to add `componentWillUnmount` to our logger

@ `Loggify.js`

```jsx
  const methodsToLog = [
      "componentWillMount", 
      "componentDidMount", 
      "componentWillUnmount"
  ]
```

And then, I'm also going to scroll down to the bottom, and I'm going to use my logger to log my child component as well. 

@ `App.js`

```jsx
PollChild = loggify(PollChild);
```

So now when we go back to our page, we should see that `componentWillUnmount()` is clearing that interval for us, and we should also get to see all the times that PollChild makes a call to a lifecycle method, showing up in our console. 

You can see here that each time it polls, PollChild is noting that in the console, and then when we call `hidePollChild`, in our console we see that PollChild called `componentWillUnmount()`, and we also see that we're not getting those errors like before, because PollChild's use of `componentWillUnmount()` got rid of that interval. 

So I hope you can see from this example how `componentWillUnmount()` is a great opportunity to make sure that your application continues to function in a performant manner, by cleaning up any unneeded processes.





# 4. Updating

## setState

What lifecycle methods occur when our component gets updated.

One of the chief ways that you might trigger an update is by using `setState()`. We will add `setState()` to our logger, and I'm also going to go over some of the expanded syntax that we can now use in setState. 

There are several syntaxes people commonly use to `setState()`.

Oftentimes, you'll see people do `someKey`, and then they'll put in `newValue`. 

@ `loggify.js`

```jsx
  this.setState({someKey: newValue})
```

This is the concise syntax for `this.setState()`. You might see it even shorter. Because we can just pass in the key value pair with ES7, and these are functionally the same. 

```jsx
 this.setState({someKey})
```

But if you need to be more precise, you can use an expanded `setState()` syntax, and it's good for us to know this, because we're going to need to be aware of it when we add it to our logger. 

So you could say `this.setState()`, and then, you actually have two different arguments that can be passed in. The first is a function that accepts `prevState` and `props`, and this function should, in the end, return a new object that represents changes to state, and you can perform any operations you need here, and you have access to the `prevState`. 

```jsx
  this.setState(
    (prevState, props) => {
      //perform any operations you need here
      return {
        //new object that represents changes to state
      }
    },
    () => {
      //my callback function
    }
  )
```

In App.js, on line 52, we made use of this expanded syntax because, I wanted to create a toggle, and so needed access to `prevState`. 

**It's important to remember that setting state is actually an asynchronous action.** 

So, because of the way the React API works, React's always trying to do its own sort of performance enhancements, and what that means is it's trying to batch your calls to `setState()`. So if it sees that you've got one call to `setState()` here and one call to `setState()` there, and it can figure out a way to batch them into one `setState()` call, then it's going to do that. 

And that means that if you're not using this expanded syntax, you might actually find that you have some problems, where if you're trying to access state within `setState()`, which you shouldn't do,... it's going to cause an error. 

**In general, you should use the expanded syntax and make use of `prevState`.** 

The second argument that `setState()` has is an anonymous function that you can use as a callback. 

Once the `setState()` call has been carried out, and once these changes have taken effect, **then this callback will be triggered**. 

OK, now you've got a better idea of this expanded `setState()` function. Remember, you can still use a more concise version, but if you want to make sure you have more control and you're avoiding any asynchronous problems, the expanded version is good. 









Okay, so now let's add `setState()` to our logger.

@ `logify.js` 

This is not so easy as just adding it to `methodsToLog()`. We have to do a little bit more fanciness. 

Below `Wrapped.prototype[method]`  from 39 to 52, and I'm actually going to modify the prototype of our Wrapped component. Specifically, I'm going to modify setState, and I'm going to set it equal to this new function. 



```jsx
    Wrapped.prototype.setState = function (partialState, callback) {
      console.groupCollapsed(`${Wrapped.displayName} setState`)
      console.log('partialState', partialState)
      console.log('callback', callback)
      console.groupEnd()
      this.updater.enqueueSetState(this, partialState, callback, 'setState')
    }
```



And in this new function, I'm going to make sure to declare some arguments that I expect to be passed to it. Those are `partialState` and `callback`. And then, within this code block that it's going to run in place of setState, I'm going to do a `console.log`, but actually it's `console.groupCollapsed`, and in it I'm going to say `Wrapped.displayName` and then I'm going to say setState so that we know that that's what got called. 

And then I'm going to `console.log` two pieces of information.

```jsx
console.log('partialState', partialState)
console.log('callback', callback)
```

So these are the two arguments that you could pass into your setState, and so I'm just going to log them so that we know, whenever we make a call to setState, what it was called with. 

And then I'm going to call console.groupEnd that will close up that group in our console log.

And then this last part is how we're actually going to add setState to our queue. 

```jsx
this.updater.enqueueSetState(this, partialState, callback, 'setState')
```

Okay, and so if you're curious where I got this information, I got this from looking at their React API, their source documents, and I also want to make sure that you know that this is not something you should do in a production environment. 

This is for educational purposes, so we can sort of see some of the workings of our setState. 

Otherwise, you don't want to be messing with the updater or enqueueSetState unless you really know what you're doing. 

So let's save this, and let's see how it takes effect on our webpage. Alright, if we refresh the page, we can see, cool, when our app called setState, it actually logged it for us, and we got to see what the partialState change was going to be, and then if we do show PollChild, we can see that once again that setState appeared in our log and each of these individual ones that are being called every time our Child polls are also being called. 

Okay, great, so now we have setState inside of our logger, and we have a little bit more idea about the expanded syntax that we can use with setState. 

And in the next few videos, we're going to be talking about what happens after you set the state, what happens after you make a change to your component and how it updates.



## componentWillReceiveProps

Lets talk about the first of our update life cycle methods, and this is `componentWillReceiveProps()`.

 `componentWillReceiveProps()` is, as I'm sure you've guessed, called when your component will receive props. Now, I also want to point out that while  `componentWillReceiveProps()`  is primarily called when your component will receive props, there are also occasions where it might get called because of a *state change on a parent component*. 

So, if you have something that's happening in  `componentWillReceiveProps()` , and you're getting problems where maybe it's getting called one too many times, that's something you should be aware of. 

So, whatever is happening in  `componentWillReceiveProps()` , you should make sure that it's basically a function of the props that are being passed to that component. And if an extra call to it gets made, it won't throw a problem in your application. 

One of the primary applications of  `componentWillReceiveProps()`  is to handle some change to state because you have a state variable that is dependent on the props that are being passed to it. 

So you can imagine you've decided to keep a dollar value in state, and that dollar value is based on two different variables that are being passed to props, and so when those get passed, you calculate that new state variable. Okay, that might be an instance where you would use  `componentWillReceiveProps()` . 

We're going to make some changes to our logger, so one, we can see when  `componentWillReceiveProps()`  is called, and also, so we can demonstrate that in our app. 



@ `loggify.js`

On line 29, and I'm going to reformat this a little bit.  And we're going to add "componentWillReceiveProps." 

```jsx
  const methodsToLog = [
    "componentWillMount",
    "componentDidMount",
    "componentWillUnmount",
    "componentWillReceiveProps"
  ]
```

Now this should get logged, but I want to make sure that not only are we logging when `componentWillReceiveProps()` gets fired, but also what its arguments are when it gets fired. 

So to do that, we're going to scroll down to below `console.groupCollapsed()`, and we are going to say

```jsx
      if (method === 'componentWillReceiveProps') {
        console.log("nextProps", args[0])
      }
```

So, up here we used the spread operator to access all of the arguments that are being passed to this function as an array, `Wrapped.prototype[method] = function(...args)` and I know that "nextProps" will be the first argument. So we're saying whenever the method is "componentWillReceiveProps", we are going to log "nextProps," so that we can just know what those are. 

Alright, so I'll Save our Logger. And now I'm going to go to my `App.js` file, and I'm going to modify things so that we have `componentWillRecieveProps()` being used. 

But First I'm going to go down to the bottom, and I'm going to make a new function that's going to be sort of a helper, so instead of having to do `Math.random()`, we're going to get a little prettier random number that we can control a bit more.

@ `App.js`

```jsx
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
```

So, now we have our `getRandomInt()` function, and we're going to use that in a number of places throughout our app. 

So now we need to make sure that our parent component, which is app, is passing down some sort of prop to our child component, childPoll, so that we can see when `componentWillReceiveNextProps()` is called. 

On Line 59, where we have this ternary operator that is putting our PollChild down, and we're going to put paranthesis around PollChild and expand it a little bit

```jsx
        {(showPollChild) ? (
          <PollChild
            
          />
        ) : null}
```

And now that we have our PollChild ready to get a prop passed to it, we're going to come up with a new piece of informational pass to it, and we'll call this parentPoll, and we will pass the variable {parentPoll}. 

```jsx
        {(showPollChild) ? (
          <PollChild
            parentPoll={parentPoll}
          />
        ) : null}
```

And we haven't actually made that, but we're going to put it on state. 

```jsx
  render() {
    let {showPollChild, parentPoll} = this.state
    ...
```

So we'll say let parentPoll get taken out of this.state, and then now we're going to actually generate that here with a method inside of app so, on line 33, we will say createParentPoll and we'll use an arrow function. And we're going to do something very similar to what we did before, in the child component. 

```jsx
  createParentPoll = () => {
    this.pollInterval = setInterval(
      () => {
        this.setState({parentPoll: getRandomInt(1,5)})
      },
      1000
    )
  }
```

 So we're going to say this.pollInterval = setInterval(, and our first argument is a function that will be called every time we hit that interval. And we'll do setState. And we'll do something really concise, and we'll just say {parentPoll: getRandomInt(1,5)}). 

And then we're going to call this every second. 

And then since we have this new method that we want our component to be calling constantly, a good place for us to put it is in componentDidMount, so we're going to put that here, this.createParentPoll(), we'll call it there. 

```jsx
  componentDidMount(){
    this.fetchData()
    this.createParentPoll()
      ...
```

And then we're going to go into our Render Statement, and we're going to add this. Because we want to display it both on the parent and the child, so we kind of have a sense of how the data's being passed.  So we'll say {parentPoll}. 

And I noticed that we're being inconsistent here, so we're saying this.state.data on line 50, and we're saying parentPoll on line 51. So let's just refactor that. We'll delete this.state on line 50. And we'll Add Data to the thing's we're taking off of state on line 45.

```jsx
        <h4>{data}</h4>
        <h4>{parentPoll}</h4>
```

And we'll data to the things we're taking off of state

```jsx
  render() {
    let {showPollChild, parentPoll, data} = this.state
    ...
```

 Okay, so to recap what we did. We created a parentPoll, we started the polling in our `componentDidMount()`, and we're making sure to pass this parentPoll information as a prop to our pollChild, and we're also making sure we show it here in our component. 

I'm also going to go up to the top, and in our state, I'm going to put a default. So I'm going to say "No data yet!" So that we have something there when the page loads. 

```jsx
  state = {
    data: "No Data yet!",
    parentPoll: "No data yet!"
  }
```

Alright, let's Save this, and since that was a messy chapter here's all of `App.js`

```jsx
import React, { Component } from 'react'
import loggify from './loggify'

class App extends Component {

  static displayName = "App"

  state = {
    data: "No Data yet!",
    parentPoll: "No data yet!"
  }

  fetchData = () => {
    console.log("Going to fetch data!")
    setTimeout(
      () => {
        console.log("Data retrieved")
        this.setState({
          data: Math.random()
        })
      },
      1500
    )
  }

  componentDidMount(){
    this.fetchData()
    this.createParentPoll()
    const canvasCtx = this.refs.appCanvas.getContext('2d')
    canvasCtx.fillStyle = "blue"
    canvasCtx.arc(75, 75, 50, 0, 2 * Math.PI )
    canvasCtx.fill()
  }

  createParentPoll = () => {
    this.pollInterval = setInterval(
      () => {
        this.setState({parentPoll: getRandomInt(1,5)})
      },
      1000
    )
  }


  render() {
    let {showPollChild, parentPoll, data} = this.state
    return (
      <div>
        Hello

        <h4>{data}</h4>
        <h4>{parentPoll}</h4>
        <canvas
          ref={"appCanvas"}
          height={200}
          width={200}
        />

        <button
          onClick={()=>{
            this.setState((prevState) => {
              return {
                showPollChild: !prevState.showPollChild
              }
            })
          }}
        >
          {(showPollChild) ? "Hide" : "Show"} PollChild
        </button>
        {(showPollChild) ? (
          <PollChild
            parentPoll={parentPoll}
          />
        ) : null}

      </div>
    )
  }
}

class PollChild extends Component {

  static displayName = "PollChild"

  state = {
    poll: Math.random()
  }

  componentDidMount() {
    this.pollData()
  }

  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }

  pollData = () => {
    this.pollInterval = setInterval(
      () => {
        console.log("Poll!")
        this.setState({
          poll: Math.random()
        })
      },
      1000
    )
  }

  render() {
    return (
      <div>
        <h4>poll: {this.state.poll}</h4>
        <h4>parentPoll: {this.props.parentPoll}</h4>
      </div>
    )
  }

}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}


App = loggify(App)
PollChild = loggify(PollChild)

export default App

```



And lets see what happens. We'll refresh our page. And we can see every one second we're getting this call to setState, and we're also seeing this value change. 

So that fits with what we want to be happening. We want our parent app to be polling. 

We just want to make sure that it's also getting passed to our child, and that we can see that happen. So, when we show our pollChild, we can see that `componentWillReceiveProps()` is getting called. 

And not only is `componentWillReceiveProps()` getting called, it's also showing this new parentPoll information. 

So let's just have it reflect on the actual component, so that we can see that happen. 

We'll scroll down to the Render Function of our child component on line 110, and we're just going to add a `<div>` to wrap this. And we're going to take our `<h4>` that has our poll, and put it right there. And then we're also going to add another `<h4>`. And in this we're going to call this parentPoll. And we're going to have the value here be `{this.props.parentPoll}`. 

```jsx
  render() {
    return (
      <div>
        <h4>poll: {this.state.poll}</h4>
        <h4>parentPoll: {this.props.parentPoll}</h4>
      </div>
    );
  }
```



Okay, so this will allow us to see inside of this child component, what is being passed down to it from the parent. Not just in the console, but also there on the web page. 

And we can see when the polling starts happening here, and we can also see when it's happening on the right side, and once we show our pollChild, we should see calls to `componentWillReceiveProps()` getting called. 

Alright cool, so you can see each time the new props get passed on to our child, because we updated our logger, `componentWillReceiveProps()` is getting called for our child, and this might be a good opportunity, if we had some aspect of PollChild State that depended on these new props for us to modify that. 



## Logging shouldComponentUpdate

Lets talk about `shouldComponentUpdate()`, which is perhaps one of our most useful methods when it comes to optimizing our component. 

One important thing you need to know about `shouldComponentUpdate()` is that it must always return a true or false value in answer to the question: "Should my component update?"  

By default, `shouldComponentUpdate()` is going to return a "true". It's going to say, "oh yeah, when I get changes to props or state, I'm going to update the component". 

So you need to be careful with that, and make sure that you are keeping track of when you tell `shouldComponentUpdate()` to not update.  If, in future, a component does not update as you expect, look to your previous implementations of `shouldComponentUpdate()`. 

Let's add `shouldComponentUpdate()` to our logger.  We're going to go into our child component and give it some directions on when it doesn't need to update. 

@ `loggify.js` lets add `shouldComponentUpdate()` to the list of methods we want to log.

```jsx
  const methodsToLog = [
    "componentWillMount",
    "componentDidMount",
    "componentWillUnmount",
    "componentWillReceiveProps",
    "shouldComponentUpdate"
  ]
```

 

The next thing we're going to do is we're going to make sure that these arguments that are being passed to `shouldComponentUpdate()` are also getting logged, **so if you remember, `shouldComponentUpdate()` has two arguments. It has a `nextProps` argument and a `nextState`.** 

So we're going to say, 

```jsx
      if (
            method === 'componentWillReceiveProps' ||
                       'shouldComponentUpdate'
      ) {
        console.log("nextProps", args[0])
      }
```

and remember, we also have access to nextState, so we're going to do a similar thing with this. 

```jsx
      if (
            method === 'shouldComponentUpdate'
      ) {
        console.log("nextState", args[1])
      }
```

And so, now our logger is set up to log every time that `shouldComponentUpdate()` gets called and also log its arguments. And then we're also going to make sure that we are returning a true or false. 

So, if we don't return a true or false, when we call the original function otherwise  `shouldComponentUpdate()` is going to cause an error.  So, one of the ways we can do that, is we can change this call to original args to be return original with the args past it.  Because by default `shouldComponentUpdate()` will return true.

```jsx
      if (original) {
        original = original.bind(this)
        return original(...args)
      }
```

And the next thing we're going to do is we're going to say if the method is equal to `shouldComponentUpdate()`, and the type of original equals undefined, then return true. 

```jsx
      if (
        method === 'shouldComponentUpdate' &&
        typeof original === 'undefined'
      ) {
        return true
      }
```

Okay, so what we're doing here is we're saying if the method we're looking at is `shouldComponentUpdate()`, and the original components method for `shouldComponentUpdate()` was undefined, (so if a component had nothing being called inside of its `shouldComponentUpdate()` life cycle method,) then we're just going to return "true". 

So we're basically replicating the default behavior of a component that has nothing in its `shouldComponentUpdate()` function. 

Save this, and we can go back to our app. And so we can see here that every time our app uses the poll and calls that state, that, as we'd expect, `shouldComponentUpdate()` is also getting called, and in our case, it's returning "true". 

In the next video, we're going to use `shouldComponentUpdate()` to make sure that our child and also our app don't update more times than they have to, so we're going to try and optimize them. 



## Implementing shouldComponentUpdate

In our last video, we set up our logger to note every time we made a call to `shouldComponentUpdate()`, and when we did that, we found out that our app was calling it lots and lots of times. So we want to minimize the number of times that our component gets updated, so that we can make our app more performant. 

So let's go to our app, and there are two different places where we can put `shouldComponentUpdate()`. 

Before I do that, though, I'm going to add one other thing. I'm going to stop logging for our app, so we're just going to log for our child.

@ `App.js`

```jsx
// App = loggify(App)
PollChild = loggify(PollChild)
```

 And then I'm also going to add a console.log here on 110,

```jsx
  render() {
    console.log("PollChild rerendered")
```

Now I'm going to go back to our webpage, and we're going to look and see how often `PollChild` rerenders. 

Okay, we'll refresh our page and we'll do Show `PollChild`. And we can see that, pretty consistently, every single second, if not more than once a second, `PollChild` is rerendering. So that's not great, that's not exactly performant. Especially when we know that on a lot of occasions, actually the same number is being passed down, so the number isn't actually changing, so we shouldn't need to rerender. 

So let's go back to our `PollChild`. And we're going to add a `shouldComponentUpdate()` check. 

We're going to write two checks that will, in the end, tell us whether or not it should update. And we're finally going to say return false. 

So we're going to say if neither of those situations are true, then we're going to return false, and we're not going to update our component. 

```jsx
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.parentPoll !== this.props.parentPoll) {
      return true
    }
    if (nextState.poll !== this.state.poll) {
      return true
    }
    return false
  }
```

I'm going to make one other change on line 102. We're going to get rid of Math.random here, and we're going to use that function that we made at the bottom of the page,

```jsx
        this.setState({
          poll: getRandomInt(1,4)
        })
```

So we have the same functionality that we did before, but now our component has all these instances where it's actually not going to update. It's going to save itself the trouble, and we're going to see if it looks more performant when we go to the page, and we're hoping to see less calls to `PollChild` rerendered. 

But actually, to make this even a little bit more apparent to us, we're going to change the range of random numbers that the parent can generate, and we're also going to get rid of this other poll. So we're going to go up to componentDidMount and we're going to comment this out, 

```jsx
  componentDidMount() {
    //this.pollData()
  }
```

and we're going to scroll up to our parent component. And on line 35, where it says `createParentPoll`, we're going to get a random number between one and two, so that should give us more occasions where there's a duplicate number being passed down and our `shouldComponentUpdate()` will get called. 

```jsx
  createParentPoll = () => {
    this.pollInterval = setInterval(
      () => {
        this.setState({parentPoll: getRandomInt(1,2)})
      },
      1000
    )
  }
```



Okay, so let's look at our webpage. We'll press our "Show PollChild" button and we'll look at the console here. So we can see `PollChild` called `componentWillReceiveProps`, then `PollChild` called `shouldComponentUpdate`, and then `PollChild` rerendered. Okay, so that probably means that different data came down, but then, if we look right here, once again, new data got passed down, so `componentWillReceiveProps` got called, and then that means that `shouldComponentUpdate` got called, but then we notice that `PollChild` didn't rerender. And so that means we saved our application an additional rerender. 

So `shouldComponentUpdate()` probably returned false because the data getting sent down was the same and we optimized our component. 

If you scroll down, you can see that there's lots of occasions where, after `shouldComponentUpdate()` happens, we actually don't rerender, and that means we've made an optimization. 



## componentWillupdate

`componentWillUpdate()` is an opportunity to make any changes to the DOM before the component is actually updated. 

But we should note that **you can't call `this.setState` here.** It's a little bit like calling `this.setState` inside of your actual render function. If you call `setState` during `componentWillUpdate()`, you'll set up an infinite chain of updates that will crash your app. 

So we're also going to make some changes to our application that will just make it look a little bit nicer and help us see what's going on. And then we're going to modify our logger and we're going to make use of `componentWillUpdate()`. 

Lets start by adding some styled components

```bash
touch styled.js
```

Edit @ `styled.js`

```jsx
import styled from 'styled-components'

export const Flex = styled.div`
  display: flex;
  font-family: sans-serif;
`

Flex.displayName = "Flex"

export const Column = styled(Flex)`
  flex-direction:column;
  align-items: flex-start;
`

Column.displayName = "Column"

export const Row = styled(Flex)`
  align-items: flex-start;
`

Row.displayName = "Row"

export const Parent = styled(Row)`
  background-color: lightblue;
  padding: 20px;
  border-radius: 10px;
  border: 3px groove blue;
`

Parent.displayName = "Parent"

export const ChildContainer = styled(Column)`
  background-color: cyan;
  padding: 20px;
  border-radius: 10px;
  border: 3px groove purple;
  margin-top: 20px;
`

ChildContainer.displayName = "ChildContainer"

export const LoggerContainer = styled(Column)`
  background-color: aliceblue;
  padding: 20px;
  border: 3x groove aquamarine;
  border-radius: 10px;
`

LoggerContainer.displayName = "LoggerContainer"

export const H2 = styled.h2`
`

H2.displayName = "H2"


export const H4 = styled.h4`
`

H4.displayName = "H4"

export const H5 = styled.h5`

`
H5.displayName = "H5"



export const Item = styled(Column)`
  width: 200px;
  height: 35px;
  margin: 1px 10px;
  padding: 3px;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  box-sizing: border-box;
  background-color: ${({value}) => {
    switch (value) {
      case 1: {
        return "chartreuse"
      }
      case 2: {
        return "lightpink"
      }
      case 3: {
        return "mediumturquoise"
      }
      case 4: {
        return "yellow"
      }
      default:
      case 5: {
        return "peru"
      }
    }
  }};
`

Item.displayName = "Item"

export const Id = styled.span`
  font-size: 8px;
`

Id.displayName = "Id"

export const Value = styled.span`
  font-size: 12px;
`

Value.displayName = "Value"

export const NoKey = styled(Column)`
  align-items: center;
`
NoKey.displayName = "NoKey"

export const Medium = styled(Column)`
align-items: center;

`
Medium.displayName = "Medium"

export const Faster = styled(Column)`
align-items: center;

`
Faster.displayName = "Faster"

```



This `styled.js` has some styled components that I've pre-created for us that are just going to make our page look a little bit clearer so we can see what everything is.  You'll notice, essentially I've created kind of like a bootstraps framework, but also a number of html elements that have different coloring and outline and formatting so that we can tell a little bit better what's happening.  I've also given them display names, so we'll be able to see, when we log them out, which ones are which. 

So we're going to go back to app.js. And at the top we're going to import, 

```jsx
import {Parent, Column, Row, ChildContainer, H4, H5, Id, Value, Item, NoKey, Medium, Faster} from './styled'

```

And a warning, some of these components we're actually not going to use in this video. We'll use them in later videos, but that means that since they're an unused variable, when you SpinApp your webpage you'll see that you get some warnings about unused variables. But don't worry, it's not actually breaking your application, it's just `create-react-app` trying to be helpful. 

Now let's go through our app component and let's make it a little prettier. 

```jsx
    return (
      <Parent>
        <Column>

          <H4>{data}</H4>
          <H4>{parentPoll}</H4>
          <canvas
            ref={"appCanvas"}
            height={200}
            width={200}
          />

          <button
            onClick={()=>{
              this.setState((prevState) => {
                return {
                  showPollChild: !prevState.showPollChild
                }
              })
            }}
          >
            {(showPollChild) ? "Hide" : "Show"} PollChild
          </button>
          {(showPollChild) ? (
            <PollChild
              parentPoll={parentPoll}
            />
          ) : null}

        </Column>

      </Parent>
    )
```



And then I'm also going to use these updated styled components below on my PollChild,

```jsx
  render() {
    console.log("PollChild rerendered")
    return (
      <ChildContainer>
        <H5>poll: {this.state.poll}</H5>
        <H5>parentPoll: {this.props.parentPoll}</H5>
      </ChildContainer>
    )
  }
```



So now let's save this and just see what our new styling looks like. Alright, so I think this is maybe a little bit clear. 

When we click PollChild we can now see that PollChild is in here and it's being loggified. And we have some borders, so that's a little bit helpful. 

In this video, what we wanted to look at was `componentWillMount()`, so let's add a `componentWillMount()` method to our application, and let's add it to the logger. 

So when we go to `loggify.js`, we need to make sure that we add `componentWillMount()` to  the methods to log. 

@ `loggify.js`

```jsx
  const methodsToLog = [
    "componentWillMount",
    "componentDidMount",
    "componentWillUnmount",
    "componentWillReceiveProps",
    "shouldComponentUpdate",
    "componentWillUpdate"
  ]
```



And then we also want to make sure that `componentWillMount()`'s arguments are being logged as well. And as you may remember, from the method it wants `nextProps` and `nextState`. 

@ `loggify.js`

```jsx
      if (
            method === 'componentWillReceiveProps' ||
                       'shouldComponentUpdate' ||
                       'componentWillUpdate'
      ) {
        console.log("nextProps", args[0])
      }

      if (
            method === 'shouldComponentUpdate' ||
                       'componentWillUpdate'
      ) {
        console.log("nextState", args[1])
      }
```

Finally, we're going to go to our parent component and we're going to make a call to `componentWillMount()`. So here on line 45, we're going to say `componentWillMount()`. And you may be wondering, what is something that you might want to do on `componentWillMount()` if you can't make calls to set state. 

Well since we have a `canvas` here, I'm imagining, maybe, once a new state comes in, it somehow affects what's on the canvas. And so I want to prepare that canvas for whatever this new state's going to be. 

Remember within `componentWillMount()`, we can access `nextProps` and `nextState`. And so we're going to make an `if` statement here

@ `loggify.js`

```jsx
  componentWillUpdate(nextProps, nextState) {
    if (nextState.parentPoll !== this.state.parentPoll) {
      this.canvasCtx.clearRect(0,0,200,200)
    }
  }
```

So, essentially what we're doing in our `componentWillMount()`, is that if the `nextState` on `parentPoll` isn't different than the last one, then we're going to clear our rectangle of our canvas. 

Alright, let's test that out. 

And it looks like we're getting an error here, it says that this.canvasCtx isn't defined. And it looks like here on `componentDidMount()`, we actually created just a const that was local to `componentDidMount()`, and if we want to be able to access it inside of our other lifecycle methods, we should make this `this.canvas.Ctx`, and now it should be available inside of our `componentWillUpdate()`. 

So we'll save the file.

```jsx
  componentDidMount(){
    this.fetchData()
    this.createParentPoll()
    this.canvasCtx = this.refs.appCanvas.getContext('2d')
    this.canvasCtx.fillStyle = "blue"
    this.canvasCtx.arc(75, 75, 50, 0, 2 * Math.PI )
    this.canvasCtx.fill()
  }
```

So we're going to be accessing `this.canvasCtx` instead of the original `canvasCtx` variable that we created locally in the function. And there we see that our `this.canvasCtx.clearRect()` occurred in `componentWillMount()`, and right now we're not logging the parent variable, so let's go back to our app and tell it to log it, and then we should see that occur. 

So we'll scroll down to the very bottom, and we'll turn on logging for our app (uncomment it.) 

And we can turn it off for our PollChild (comment it out.)

Alright, so now we have our component calling `componentWillUpdate()` and our logger is making note of it. And we've done something that is a good application of `componentWillUpdate()`. We our clearing our canvas object. 



## componentDidUpdate

 `componentDidUpdate()`, unlike `componentWillUpdate()`, is going to be looking at `prevProps` and `prevState` for arguments and so it's going to be occurring after your component updated. 

Now `componentDidUpdate()` is maybe a bit more useful than `componentWillUpdate()` in that it allows you to access items that have just been rendered. `componentDidUpdate()` might be a good opportunity to scroll to a specific space on the page or to update a `ref` because now everything has been rendered and all of the objects on your dom are now available. 

Let's use `componentDidUpdate()` in our project and add it to our logger. 

@ `App.js`  I'm going to turn off logging right now

```jsx
// App = loggify(App)
```



and beneath `componentWillUpdate()` I'm going to make a call to `componentDidUpdate()` and remember it takes in `prevProps` and `prevState` and then within the function body, I'm going to look at the `parentPoll` value and based on whether or not it's even or odd, I'll show either a red circle or a green circle.

So remember, the circle starts blue and then once `parentPoll` has a value, we clear it in `componentWillUpdate().`

@ `App.js`

```jsx
  componentDidUpdate(prevProps, prevState) {
    if (prevState.parentPoll !== this.state.parentPoll) {
      let {canvasCtx} = this
      canvasCtx.fillStyle = (prevState.parentPoll % 2 === 1) ? "green" : "red"
      canvasCtx.arc(75, 75, 50, 0, 2 * Math.PI)
      canvasCtx.fill()
    }
  }
```



Test the app and we should see that each time prevState.parentPoll value gets changed, whether or not it's even or odd the circle will change it's color. 

So, we have this problem that our thing still isn't updating, but when we examine the code we see that here on line 54 our ternary operator is looking at the wrong thing, because we're using `prevState` and `prevProps`, but we actually have access to the current state, so we want to look at that. So we'll say if the current state (`this.state`) is odd or even then make it green or red. 



```jsx
canvasCtx.fillStyle = (this.state.parentPoll % 2 === 1) ? "green" : "red"
```



Alright, so we'll save that and now we see that actually our things are taking effect, so every time the `componentDidUpdate()`, it checks to see whether or not that piece of data is even or odd and then it changes the canvas. 

So let's add this to our logger. We're going to go into` loggify.js` and we're going to scroll up to the top and on line 36 we are going to add `componentDidUpdate`, 



@ `loggify.js`

```jsx
  const methodsToLog = [
    "componentWillMount",
    "componentDidMount",
    "componentWillUnmount",
    "componentWillReceiveProps",
    "shouldComponentUpdate",
    "componentWillUpdate",
    "componentDidUpdate"
  ]
```



and we want to say if method equals `componentDidUpdate` then console.log prevState and  prevProps 

@ `loggify.js`

```jsx
      if (
        method === "componentDidUpdate"
      ) {
        console.log("prevProps", args[0])
        console.log("prevState", args[1])

      }
```



So now our logger is set up to log every time `componentDidUpdate()` gets called and we can go to our app and scroll down to the bottom and we can turn on logging again for our app so that we can see that happen and we'll go into our browser and now we can see, okay, cool, so app called `componentDidUpdate()` every time that things got updated.

One thing I'm noticing right here is that I bet our parent app could use some optimization too because it looks like it's updating and re-rendering every time this variable changes, even if it was just updated but it's still the same value as before, so that could be an opportunity for us to optimize this, but overall we've gone through each of the life cycle methods that happen in the update subcycle.

In the next chapter we're going to be talking about how we can further optimize our course, particularly when rendering large pieces of information and large lists and we're also going to use the react-addons-perf tool. 



# 5. Optimizing Components

## Using react-addons-perf

In this chapter, we're going to focus on finding ways to optimize our components. In the last few chapters, we got a handle on all the different life cycle methods, and so in this video, we're going to specifically use some of them to update our app, and then in the next few videos, we're going to look at some tools that will help us actually measure our improvements. 

Let's think about how we use `shouldComponentUpdate()` and `componentWillUnmount()` to update our child component. And we're going to use some of those same techniques to update our parent component. 

Go to the parent component and see that we have an interval here in line 36 through line 43. And on line 37, we're setting this.pollInterval, equal to that interval, and I know when our component mounts here on line 29 we are going to create that parent poll. 

So I know from our previous experience that whenever we mount something like an interval, something that's going to be attached to the window and it's going to be called continuously, we need to make sure that we are clearing that interval in a `componentWillUnmount()` call. 

This will ensure that once our parent component gets unmounted that we will clear this interval and it won't get duplicated if it gets remounted. 

@ `App.js`

```jsx
  componentWillUnmount() {
    clearInterval(this.pollInterval)
  }
```

And then the next thing we want to do is we want to make sure that we're leveraging `shouldComponentUpdate()` to ensure that our component isn't updated unnecessarily. 

So let's think about what's going to be changing here. This create parentPoll function and this interval are modifying the parentPoll value and it's just the number one or two, so there's probably about half the time where it's going to be the same value getting passed down, and we want to make sure that we don't update our component when that happens. 

So let's write a `shouldComponentUpdate() { if () {}}` statement that returns true or false based on our specifications. 

@ `App.js`

```jsx
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.parentPoll !== this.state.parentPoll) {
      return true
    }
    return false
  }
```



Here on line 40, we're going to write should component update, and we're going to make sure it has the arguments it needs, nextprops and nextstate, and then on line 41, we're going to say if `nextstate.parent poll` is not equal to `this.state.parentpoll`, then return true. So that's an instance where we want to make sure we update, and otherwise we can say return false.

And I believe we also have one other value being generated here on our parent component, and we're just going to delete that, so we can just get rid of our reference to data here on line 10

@ `App.js`

```jsx
  state = {
    // data: "No Data yet!",
    parentPoll: "No data yet!"
  };
```

and we can also just get rid of fetch data. 

@ `App.js`

```jsx
  // fetchData = () => {
  //   console.log("Going to fetch data!");
  //   setTimeout(() => {
  //     console.log("Data retrieved");
  //     this.setState({
  //       data: Math.random()
  //     });
  //   }, 1500);
  // };
```

And let's see if there's any more references to that data on our render function, so here on line 58, we'll delete data. 



@ `App.js`

```jsx
let { showPollChild, parentPoll } = this.state;
```



And then I believe we're also showing it in one place here on H4, so we can just get rid of that too. 

@ `App.js`

```jsx
// <H4>{data}</H4>
```



Okay cool. So now we've added these two modifications that will optimize our component. Let's open it up and see if it still works. And we forgot one more reference to fetch data, so let's go and clean that up. We'll go to line 14, and we'll delete `this.fetchData()`. 

```jsx
componentDidMount(){
    // this.fetchData()
    ...
}
```

and let's check out our component now. All right, great. So it's working the way we want it to. Each time the number updates, the component updates, but it's not updating unnecessarily. One thing I'm also going to do is I'm just going to go into our import and export statement, and one last thing before we start using some performance tools, I'm going to go into our application and I'm going to clear out some of these unnecessary dependencies that are throwing these warnings in our console. So things are a little bit cleaner, when in the next video, we are using the terminal more. Okay, so let's go into our application, and I'll scroll up to the top, and I know we can get rid of ID and value, and item, and no key, and medium and faster, so we'll delete all those, let's save this and see if that gets everything we need. 

@ `App.js`

```jsx
import { Parent, Column, ChildContainer, H4, H5 } from "./styled";
```



Okay, and we can also get rid of loggify. So we'll just comment loggify out for right now. 

@ `App.js`

```jsx
// import loggify from './loggify'
```



Let's make sure everything's working. All right, great, so our application is doing what we want. 





## List overview

Okay so one of the best performance tools we can use to measure whether or not we have any wasted renderings happening in our react app, is called react-addons-perf. So to use this react-addons-perf, we're going to make sure that we go into our terminal, and we're going to do



```bash
 yarn add react-addons-perf
```

And remember if you are using MPM, you can say mpm install--s react-addons-perf. And don't worry about this warning, this won't actually affect the way things run. And then we're also going to add something called uuid. So this stands for universally unique ID, and this is a library that's going to allow us to generate unique IDs. Because later on we're going to see how react likes to see special ID keys on each array of components, so that it can speed up its diffing process and make sure that it's not doing unnecessary renders. So we're going to be using this later, so we'll add this. I'm doing 

```bash
yarn add uuid
```

you could also do mpm install uuid--s. Okay so now that we have these two dependencies installed, we can start up our server again with 

```bash
yarn start
```

And then I'm also going to import some files that I've created for us to look at. So we're going to go into our final project in our exercise files. Go into source and we're going to look at a file called Lists. We're going to copy this list file, and we're going to go to the directory that we're using. So this is my current project, and I'm going to put this list file in there. 



```bash
touch lists.js
```

and edit



@ `lists.js`

```jsx
import React, { Component } from 'react'
import uuid from 'uuid/v4'
import { Row, H4, Id, Value, Item, NoKey, Medium, Faster} from './styled'
import {start, stop, printWasted, printInclusive} from 'react-addons-perf'


export class BigList extends Component {

  static displayName = "BigList"


  constructor(props) {
    super(props)

    this.ids = []

    for (let i = 0; i < 500; i++) {
      this.ids.push(uuid())
    }


    this.state = {
      items: this.ids.map((id)=>{
        return {
         id,
         value: getRandomInt(1,5)
        }
      })
    }
  }

  updateList = () => {
    let newItems = this.ids.map((id)=>{
      return {
       id,
       value: getRandomInt(1,5)
      }
    })
    start()
    this.setState(
      ()=>{
        return {
          items: newItems
        }
      },
      ()=>{
        stop()
        printInclusive()
        printWasted()
      }
    )
  }



  render() {
    return (
      <Row>
        <button
          onClick={this.updateList}
        >
          UpdateList
        </button>
        <NoKey>
          <H4>no key</H4>
          {this.state.items.map((item, index) => (
            <Regular
              item={item}
              key={index}
            />
          ))}
        </NoKey>
        <Medium>
          <H4>key, no optimization</H4>
          {this.state.items.map(item => (
            <Regular
              item={item}
              key={item.id}
            />
          ))}
        </Medium>
        <Faster>
          <H4>key and optimization</H4>
          {this.state.items.map(item => (
            <Optimized
              item={item}
              key={item.id}
            />
          ))}
        </Faster>
      </Row>
    )
  }
}


class Optimized extends Component {


  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.item.value !== this.props.item.value
  }

  render() {
    let {id, value} = this.props.item
    return (
      <Item
        value={value}
      >
        <Id>{id}</Id>
        <Value>{value}</Value>
      </Item>
    )
  }
}

class Regular extends Component {


  render() {
    let {id, value} = this.props.item
    return (
      <Item
        value={value}
      >
        <Id>{id}</Id>
        <Value>{value}</Value>
      </Item>
    )
  }
}


function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

```



Okay so now we'll see that available in our project, and let's open it up and look at it. I'm going to close this logify.js. Okay so one of the first things we noticed that we're using a uuid, and we're also using react-addons-perf. And then we've got this react component called \"Biglist\". Let's go down through it, what it does. So in its constructor, it is creating an array of IDs. So it's creating a bunch of unique IDs. And then it is setting its initial state to hold a giant array of quote unquote items, and each of these items has one of the IDs that it generated and it also has a random value. Then we've got a method that calls update list, and this is going to make a call to generate a whole new set of values for each of those items. And then inside our render function, we've got a row and we've got a button that can be clicked. And then we have three columns. And the first column represents a list of those items that we created without using keys. The second list represents all those items, but with keys. And the third row represents all of our items with keys and each of those components have been optimized. We can see below this that we've got these two different components. One is the optimize component, and by optimize I mean its leveraging shouldComponentUpdate to when it's gotten duplicate values and it doesn't need to be rendered. And by non optimized I mean just a regular version of the component that is not doing anything to make sure it keeps from re-rendering. And then we have a random function down at the bottom. Okay so this is what's happening in lists.js, and we're going to bring this into our app. And we're going to go through each of these different lists, and try updating them and seeing what kind of speed it takes for them to render or not re-render. 

## Generating waste reports

"- [Instructor] Alright, so now that we have a good sense of the way that these lists look, we're going to bring them into our app and see how they function. So, we'll do import BigList from lists. 

@ `App.js`

```jsx
import {BigList} from './lists'
```

And we're going to scroll down. And here on line 88 of our render function of the parent component, we're going to call Column. And in this column, we're going to put our BigList. 

@ `App.js`

```jsx
        <Column>
          <BigList/>
        </Column>
```



Also, I want to, in this video, just focus on the first of the three lists that we have. So, we've got this completely unoptimized one, this one that's been optimized a little bit, and then this one that has been fully optimized. So we're going to come at that to somewhat optimized one. 



```jsx
// <Medium>
//   <H4>key, no optimization</H4>
//   {this.state.items.map(item => <Regular item={item} key={item.id} />)}
// </Medium>
// <Faster>
//   <H4>key and optimization</H4>
//   {this.state.items.map(item => (
//     <Optimized item={item} key={item.id} />
//   ))}
// </Faster>
```



And now we're going to go to our page and see how this looks. 



**HERE ENDTH THE TUTORIAL**



> **OK. here is where the tutorial breaks because**:
>
> **react-addons-perf** no longer works at all in React 16. It’s likely that we’ll release a new version of this tool in the future. In the meantime, you can [use your browser’s performance tools to profile React components](https://reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-chrome-performance-tab).

> ```bash
> yarn remove react-addons-perf
> ```
>
> 





Okay, so when we refresh the page, we can see that we have this BigList and it's filled with data, and they have unique IDs, but actually each individual component, we know from looking at the code, isn't given a unique ID. It's just given an index. Alright, so let's try clicking this update list button, and let's see what happens. Alright, so we got a bunch of stuff show up in our terminal. And we can kind of scroll through this, and we can see how each element has generated a report based on the number of times that it had to render. And then we also get this awesome figure right here that says Inclusive wasted, and it tells us every wasted render, so whenever something re-rendered that didn't need to re-render. And, if we look at our component again, and we check to see here on line 17 how many of them there are, how many elements we have in this list, we see that there are 500. And it actually looks like all of them re-rendered in some cases, so they had to re-render their ID, and they had to re-render the actual value every single time, so that's pretty bad. That's 100% wasted. And the reason why that's happening is because we aren't using any IDs, and we're not using shouldComponentUpdate. So, let's try this out just with using IDs. Okay, so we're going to just modify our code, and instead of passing the index of the element to it, we're going to give it an ID. So, we're going to go back to our list.js file, and we're going to scroll down, and so we're going to comment out NoKey, and we're going to comment in Medium and Faster, and then we're going to comment that faster. So, we just want to see what happens when we make sure to give each of these components a key, and we're going to see how that affects our performance. So we'll save the file, and now we'll go back, and we're going to press this UpdateList button. Remember the UpdateList button is giving each of these new elements a new value, so this little one or two or five, and it's going to give them the same ID. And we'll see what happens. And let's actually press it one more time so that the effects of our IDs can really apply here. So, when we consult our wasted time here, we can see actually that less time was wasted just because we were using keys instead of the index. So, React can say, \"Oh, alright, I don't need to completely \"re-render this component. \"I only need to re-render some of them because I can see \"that their key is the same.\" Okay, so we got a slight performance boost here, but at the end of the day, a lot of our components are entirely re-rendering, because they haven't had their ShouldComponentUpdate optimized, so let's try that one last. Let's go back to our list.js, and we're going to comment out line 73 through 81, and then we're going to comment in lines 82 through 90, so these are our faster, optimized components that are being given a key, and let's save this. And now, let's check this out by pressing UpdateList. Alright, so if we look at our terminal here, you can see right away, that look, the number of items that are being printed here in our total wasted time is much, much less. So, instead of having to re-render all of our components, we're just looking at the ones that actually changed. "

## Wrapping up the project

"- [Instructor] All right, you've finished with your project. You've built a logger that can log each of the different life cycle methods, and you've used performance tools to check to see how a component is maybe wasting renders, and then you've also gone and fixed some of the optimization problems with components. You've used shouldComponentUpdate to tell a component whether or not it needs to re-render, and you've also used componentWillUnmount to make sure that you've cleared any unnecessary functions. Now that you've built this application, I think you should think of it as a bit of a playground. Go through it and see when are each of these life cycle methods being called. What can I do to keep a component from rendering again? Use your logger maybe on another component that you've built somewhere else to wrap it and see what happens when you give it certain props or make certain state changes inside of it. To recap, once again, what we've learned about life cycle methods. We can categorize them into two main subcycles. We have our mounting cycle, which begins with componentWillMount, and then it renders, and then it concludes with componentDidMount. Then in the updating cycle, we have componentWillReceiveProps, and then we have componentWillUpdate, then we have the actual rendering, then we can access what's been added to the page with componentDidUpdate. "

# Conclusion

## Next steps
