import React from "react";
import ReactDOM from "react-dom/client";
import { installStoragePolyfill } from "./lib/storage.js";
import Charlie from "./Charlie.jsx";
import "./index.css";

installStoragePolyfill();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Charlie />
  </React.StrictMode>
);
