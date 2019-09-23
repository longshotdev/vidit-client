import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "./pages/public/upload";
import withSplashScreen from "./components/withSplashScreen";
function App() {
  return (
    <Router>
      <Route to="/" component={withSplashScreen(Index)} />
    </Router>
  );
}
export default App;
