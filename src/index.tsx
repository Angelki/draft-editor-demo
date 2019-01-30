import * as React from "react";
import { render } from "react-dom";
import ContentForm from "./components/ContentForm";
import "./styles.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <ContentForm />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
