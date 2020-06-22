const gradeMap = {
  A: ["5-stars", "5 stars (out of 5)"],
  B: ["4-stars", "4 stars (out of 5)"],
  C: ["3-stars", "3 stars (out of 5)"],
  D: ["2-stars", "2 stars (out of 5)"],
  F: ["1-star", "1 star (out of 5)"],
};

module.exports = function imageForGrade(
  grade,
  className,
  width = 70,
  height = 14
) {
  if (!grade || !(grade[0] in gradeMap)) {
    return "";
  }

  const [src, alt] = gradeMap[grade[0]];

  return `<img
      class=${className}
      src="${`/svg/${src}.svg`}"
      alt="${alt}"
      width="${width}"
      height="${height}"
    />`;
};
