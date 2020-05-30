/* eslint-disable */
import React from "react";

export const onClientEntry = () => {
  if (process.env.NODE_ENV !== "production") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(React, {
      trackAllPureComponents: true,
    });
  }
};

const { default: littlefoot } = require("littlefoot");

export const onRouteUpdate = ({ location }) => {
  littlefoot(); // Pass any littlefoot settings here here.
};

import "littlefoot/dist/littlefoot.css";
