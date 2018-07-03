import React from "react";
import { render } from "react-dom";
import { Page, Toolbar, Button } from "react-onsenui";
import { notification } from "onsenui";
import "onsenui/css/onsenui.css";
import "onsenui/css/onsen-css-components.css";

const App = () => ({
  handleClick: function() {
    notification.alert("Hello world!");
  },

  render: function() {
    return (
      <Page>
        <Button onClick={this.handleClick}>Tap me!</Button>
      </Page>
    );
  }
});

const wrapper = document.getElementById("app");
wrapper ? render(<App />, wrapper) : false;
