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
