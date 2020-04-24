// import React from "react";

// const { NODE_ENV } = process.env;

// export const onRenderBody = ({ pathname, setPostBodyComponents, reporter }) => {
//   const pages = ["watchlist"];
//   console.log(pathname);

//   if (
//     NODE_ENV === "production" &&
//     !pages.some((page) => pathname.endsWith(page))
//   ) {
//     return;
//   }

//   setPostBodyComponents([<script src="/scripts/filters.js" defer />]);
// };
