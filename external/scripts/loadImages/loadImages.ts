/* eslint-env browser */

(function initUpdateImages(): void {
  function updateOpacityForImage(this: HTMLImageElement): void {
    this.style.opacity = "1";
    this.removeEventListener("load", updateOpacityForImage);
  }

  function updateImages(): void {
    const nodes = document.querySelectorAll<HTMLImageElement>("picture > img");

    // cache nodelist length
    const nodesLength = nodes.length;

    // loop through nodes
    for (let i = 0; i < nodesLength; i += 1) {
      // cache node
      nodes[i].addEventListener("load", updateOpacityForImage);

      if (nodes[i].complete) {
        nodes[i].style.opacity = "1";
        nodes[i].removeEventListener("load", updateOpacityForImage);
      }
    }
  }

  updateImages();
})();
