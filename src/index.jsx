import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";

// For React Developer Tools debugging
if (process.env.NODE_ENV === 'development') {
  window.React = React;
}

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
