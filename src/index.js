import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
// import { LoggerExample } from "./loggerExample";

ReactDOM.render(<App />, document.getElementById("root"));
// ReactDOM.render(<LoggerExample />, document.getElementById("root"));
registerServiceWorker();
