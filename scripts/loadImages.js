"use strict";
(function initUpdateImages() {
    function removePlaceholderForLoadedImage() {
        const placeholder = this.previousSibling;
        if (!placeholder) {
            return;
        }
        placeholder.remove();
    }
    function updateImages() {
        let i;
        const nodes = document.querySelectorAll("picture");
        const nodesLength = nodes.length;
        for (i = 0; i < nodesLength; i += 1) {
            nodes[i].addEventListener("load", removePlaceholderForLoadedImage);
        }
    }
    updateImages();
})();
