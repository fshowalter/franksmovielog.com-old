"use strict";
(function initUpdateImages() {
    function updateOpacityForImage() {
        this.style.opacity = "1";
        this.removeEventListener("load", updateOpacityForImage);
    }
    function updateImages() {
        const nodes = document.querySelectorAll("picture > img");
        const nodesLength = nodes.length;
        for (let i = 0; i < nodesLength; i += 1) {
            nodes[i].addEventListener("load", updateOpacityForImage);
            if (nodes[i].complete) {
                nodes[i].style.opacity = "1";
            }
            nodes[i].removeEventListener("load", updateOpacityForImage);
        }
    }
    updateImages();
})();
