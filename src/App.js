import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "./pages/public/upload";
function App() {
  return (
    <Router>
      <Route to="/" component={Index} />
    </Router>
  );
}
export default App;
