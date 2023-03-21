// ==UserScript==
// @name        no_extra_click
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/no_extra_click.user.js
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/*
// ==/UserScript==


function main() {
    const observer = new MutationObserver(function() {
        let menuBtnBrowser = [document.querySelector("#menuBtnBrowser"), false];
        if (menuBtnBrowser[0] && !menuBtnBrowser[1]) {
            menuBtnBrowser[0].setAttribute("onclick", "playSelect(0.1);openServerWindow(1);");
            menuBtnBrowser[1] = true;
        }

        if (menuBtnBrowser[1]) {
            observer.disconnect();
        }
    });

    const target = document.body;
    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(target, config);
}


window.onload = function(){
    main();
};