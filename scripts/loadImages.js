"use strict";
(function initUpdateImages() {
    function removePlaceholderForLoadedImage() {
        this.style.opacity = "1";
    }
    function updateImages() {
        const nodes = document.querySelectorAll("picture");
        const nodesLength = nodes.length;
        for (let i = 0; i < nodesLength; i += 1) {
            nodes[i].addEventListener("load", removePlaceholderForLoadedImage);
        }
    }
    updateImages();
})();
