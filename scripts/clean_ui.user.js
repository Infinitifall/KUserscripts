// ==UserScript==
// @name        clean_ui
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/clean_ui.user.js
// @version     4.2
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/*
// @exclude     https://krunker.io/social.html*
// @exclude     https://krunker.io/editor.html*
// @exclude     https://krunker.io/viewer.html*
// ==/UserScript==


var style_1 = `
div#headerRightSocial,
div#streamContainer,
div#signedOutHeaderBar,
div#inviteButton,
div#menuBtnJoin,
div#policeButton,
div#tlInfHold,
.terms:nth-child(1),
.terms:nth-child(3),
.verticalSeparatorInline,
.menuItem:nth-child(2),
.menuItem:nth-child(5),
.menuItem:nth-child(3),
div#txtBubble,
img#loadEditrBtn,
div#loadTipsHolder,
div#loadInfoLHolder,
div#menuPopHider,
div#frvrMenuMobileHolder,
div#endBPLayout,
div#gameNameHolder,
div#seasonLabel,
div#merchHolder,
.progressBar,
div#mLevelCont,
div#krInfo,
.junkInfo,
div#signedInHeaderBar .verticalSeparator
{
    display:none !important;
}

div#menuItemContainer {
    top:0;
}

div#spectButton {
    top: 20px !important;
    left: calc(100% - 250px) !important;
}

div#menuItemContainer
{
    top: 10% !important;
    bottom: 40% !important;
    left: -10px !important;
    font-size: 14px !important;
    border-radius: 0 20px 20px 0 !important;
}

div#chatHolder {
    left: 10px !important;
}

div#voiceDisplay {
    left: 360px !important;
}

div#termsInfo {
    padding: 5px 10px !important;
    height: 25px !important;
}

.terms {
    font-size: 12px !important;
}

div#signedInHeaderBar {
    height: 50px !important;
}

div#mailContainer {
    padding-right: 20px !important;
}

signedInHeaderBar,
div#menuItemContainer,
div#headerRight,
div#termsInfo,
div#signedInHeaderBar
{
    background: #000b !important;
}

div#mapInfoHld {
    border: none !important;
}

.krInfo {
    padding-top: 12px !important;
    padding-right: 10px !important;
    padding-left: 10px !important;
}
`;


function main() {
    // add custom style sheet to override default one
    let vm_css_1 = document.createElement('style');
    vm_css_1.innerHTML = style_1;
    vm_css_1.id = "vm_css_1";
    document.head.appendChild(vm_css_1);

    let customCSS_bool = false
    let bundlePop_bool = false;

    const observer = new MutationObserver(function() {
        let customCSS = document.getElementById("customCSS");
        let bundlePop = document.getElementById("bundlePop");

        if (customCSS && !customCSS_bool) {
            // if mod or map is using a custom stylesheet, remove vm_css_1
            vm_css_1.remove();
            // customCSS.remove();
            customCSS_bool = true;
        }

        if (bundlePop && !bundlePop_bool) {
            // clear popups
            if (document.getElementById('bundlePop').children.length > 0) {
                setTimeout(function() { location.assign("javascript:clearPops();"); }, 1000);
                // location.assign("javascript:clearPops();");
                bundlePop_bool = true;
            }
        }

        if (customCSS_bool && bundlePop_bool) {
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


main();
