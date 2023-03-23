// ==UserScript==
// @name        no_extra_click
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/no_extra_click.user.js
// @version     3.1
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/*
// @exclude     https://krunker.io/social.html*
// @exclude     https://krunker.io/editor.html*
// @exclude     https://krunker.io/viewer.html*
// ==/UserScript==


function main() {

    let menuBtnBrowser_bool = false;

    const observer = new MutationObserver(function() {
        let menuBtnBrowser = document.querySelector("#menuBtnBrowser");
        if (menuBtnBrowser && !menuBtnBrowser_bool) {
            menuBtnBrowser.setAttribute("onclick", "playSelect(0.1);openServerWindow(1);");
            menuBtnBrowser_bool = true;
        }

        if (menuBtnBrowser_bool) {
            observer.disconnect();
        }
    });

    const target = document.body;
    const config = {
        childList: true,
        subtree: true
    };

    observer.observe(target, config);

    // timeout after a few seconds
    setTimeout(observer.disconnect, 15000);
}


window.onload = function(){
    main();
};