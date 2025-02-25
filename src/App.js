import React from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TemplateBuilder from "./components/TemplateBuilder";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header
          style={{ backgroundColor: "#004072" }}
          className=" text-white p-3"
        >
          <h3>Template Builder</h3>
        </header>
        <TemplateBuilder />
      </div>
    </Provider>
  );
}

export default App;
