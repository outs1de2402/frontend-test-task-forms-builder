import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux"; // 1. Імпортуємо Provider
import { store } from "./store"; // 2. Імпортуємо твій store
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
