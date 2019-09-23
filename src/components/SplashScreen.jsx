import React, { Component } from "react";
import LoadingScreen from "react-loading-screen";
import randomQuote from "./randomQuote";
import wtf from "../media/512_vidit.png";
function LoadingMessage() {
  return (
    <LoadingScreen
      loading={true}
      bgColor="#f1f1f1"
      spinnerColor="#9ee5f8"
      textColor="#676767"
      logoSrc={wtf}
      text={randomQuote}
    >
      <div>Loadable content</div>
    </LoadingScreen>
  );
}
export default LoadingMessage;
