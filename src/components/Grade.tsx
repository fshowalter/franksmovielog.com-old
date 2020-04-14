import React from "react";

import A from "../assets/5-stars.svg";
import B from "../assets/4-stars.svg";
import C from "../assets/3-stars.svg";
import D from "../assets/2-stars.svg";
import F from "../assets/1-star.svg";

const gradeMap: { [key: string]: [string, string] } = {
  A: [A, "5 stars (out of 5)"],
  B: [B, "4 stars (out of 5)"],
  C: [C, "3 stars (out of 5)"],
  D: [D, "2 stars (out of 5)"],
  F: [F, "1 star (out of 5)"],
};

interface Props {
  grade: string;
  width?: number;
  height?: number;
  className?: string;
}

const Grade = ({ grade, width, height, className }: Props) => {
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
};

export default Grade;
