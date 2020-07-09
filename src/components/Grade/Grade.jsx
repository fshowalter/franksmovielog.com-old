import React from "react";
import PropTypes from "prop-types";

import F from "../../../content/assets/1-star.svg";
import D from "../../../content/assets/2-stars.svg";
import C from "../../../content/assets/3-stars.svg";
import B from "../../../content/assets/4-stars.svg";
import A from "../../../content/assets/5-stars.svg";

const gradeMap = {
  A: [A, "5 stars (out of 5)"],
  B: [B, "4 stars (out of 5)"],
  C: [C, "3 stars (out of 5)"],
  D: [D, "2 stars (out of 5)"],
  F: [F, "1 star (out of 5)"],
};

export default function Grade({ grade, width, height, className }) {
  if (!grade || !(grade[0] in gradeMap)) {
    return null;
  }

  const [src, alt] = gradeMap[grade[0]];

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}

Grade.propTypes = {
  grade: PropTypes.oneOf([
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "D-",
    "F",
  ]).isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
};

Grade.defaultProps = {
  width: 70,
  height: 14,
  className: null,
};
