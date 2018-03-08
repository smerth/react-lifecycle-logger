import React, { Component } from "react";
import loggify from "./loggify";

class App extends Component {
  static displayName = "App";

  state = {
    data: "No Data yet!"
  };

  fetchData = () => {
    console.log("Going to fetch data!");
    setTimeout(() => {
      console.log("Data retrieved");
      this.setState({
        data: Math.random()
      });
    }, 1500);
  };

  componentDidMount() {
    this.fetchData();
    const canvasCtx = this.refs.appCanvas.getContext("2d");
    canvasCtx.fillStyle = "blue";
    canvasCtx.arc(75, 75, 50, 0, 2 * Math.PI);
    canvasCtx.fill();
  }

  render() {
    return (
      <div>
        Hello
        <h4>{this.state.data}</h4>
        <canvas ref={"appCanvas"} height={200} width={200} />
      </div>
    );
  }
}

App = loggify(App);

export default App;
