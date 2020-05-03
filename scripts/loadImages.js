"use strict";
(function initUpdateImages() {
    function updateOpacityForImage() {
        this.style.opacity = "1";
    }
    function updateImages() {
        const nodes = document.querySelectorAll("picture > img");
        const nodesLength = nodes.length;
        for (let i = 0; i < nodesLength; i += 1) {
            nodes[i].addEventListener("load", updateOpacityForImage);
        }
    }
    updateImages();
})();
