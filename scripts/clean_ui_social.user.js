// ==UserScript==
// @name        clean_ui_social
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/clean_ui_social.user.js
// @version     3.1
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/social.html*
// ==/UserScript==


var style_4 = `
img#editrDB,
img#androidDB,
img#iosDB,
img#steamDB
{
    display: none !important;
}
`;


function main() {
    // add custom style sheet to override default one
    let vm_css_4 = document.createElement('style');
    vm_css_4.innerHTML = style_4;
    vm_css_4.id = "vm_css_4";
    document.head.appendChild(vm_css_4);
}


window.onload = function(){
    main();
};
