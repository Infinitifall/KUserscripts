// ==UserScript==
// @name        no_twitch
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/no_twitch.user.js
// @version     3.2
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/social.html*
// ==/UserScript==


var style_3 = `
iframe#recEmbed{
    display: none !important;
}
`;


function main() {
    // add custom style sheet to override default one
    let vm_css_3 = document.createElement('style');
    vm_css_3.innerHTML = style_3;
    vm_css_3.id = "vm_css_3";
    document.head.appendChild(vm_css_3);

    let recEmbed_bool = false

    const observer = new MutationObserver(function() {
        let recEmbed = document.getElementById("recEmbed");

        if (recEmbed && !recEmbed_bool) {
            // setTimeout(recEmbed.remove, 5000);  // removing this breaks the website
            recEmbed.innerHTML = "";
            recEmbed_bool = true;
        }

        if (recEmbed_bool) {
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
    setTimeout(function() { observer.disconnect(); }, 30000);
}


main();
