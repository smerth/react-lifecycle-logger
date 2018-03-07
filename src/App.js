import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);

    this.oneFunction = this.oneFunction.bind(this);
  }

  oneFunction() {
    console.log("oneFunction");
    console.log(this.props);
  }

  useArrows = () => {
    console.log("useArrows works without binding");
    console.log(this.props);
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <button onClick={this.oneFunction}>test oneFunction</button>

        <button onClick={this.useArrows}>test useArrows</button>
      </div>
    );
  }
}

export default App;
