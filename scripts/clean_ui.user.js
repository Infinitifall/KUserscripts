// ==UserScript==
// @name        clean_ui
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/clean_ui.user.js
// @version     7.1
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/*
// @exclude     https://krunker.io/social.html*
// @exclude     https://krunker.io/editor.html*
// @exclude     https://krunker.io/viewer.html*
// ==/UserScript==


let style_1 = `
div#homeStoreAd,
div#battlepassAd,
div#updateAd,
div#krDiscountAd,
div#doubleRaidDropsAd,
div#streamContainer,
div#streamContainerNew
{
  display: none !important;
}


div#aHider,
div#topRightAdHolder
{
  display: none  !important;
}


div#gameNameHolder,
.menuItem:nth-child(1),
.menuItem:nth-child(2)
{
  display: none;
}

.menuItem {
  scale: 0.8;
}

div#menuItemContainer {
  top: 15%;
  bottom: 30%;
  border-radius: 0 1em 1em 0;
  width: 110px;
}


div#inviteButton,
div#menuBtnJoin,
div#menuBtnQuickMatch
{
  display: none;
}

div#matchInfoHolder {
  width: 800px;
}

div#subLogoButtons {
  bottom: 15px;
}


div#menuClassContainer{
  scale: 0.8;
  right: -40px;
  bottom: 20%;
}

div#customizeButton {
  width: 350px;
}


.junkInfo,
.verticalSeparator:nth-child(6),
div#menuLvlHold,
div#mLevelCont
{
  display: none;
}

div#menuKRCount {
  display: block;
}

div#signedInHeaderBar {
  height: 50px;
  width: 370px;
}

div#mapInfoHolder {
  opacity: 0.2;
}
`;


function main() {
    // add custom style sheet to override default one
    let vm_css_1 = document.createElement('style');
    vm_css_1.innerHTML = style_1;
    vm_css_1.id = "vm_css_1";
    document.head.appendChild(vm_css_1);

    let customCSS_bool = false;      // whether custom css has been added
    let bundlePop_bool = false;      // whether popup has been disabled
    let expertModeBtn_bool = false;  // whether expert mode has been disabled

    const observer = new MutationObserver(function() {
        let customCSS = document.getElementById("customCSS");
        let bundlePop = document.getElementById("bundlePop");
        let expertModeBtn = document.getElementById("expertModeBtn");

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

        if (expertModeBtn && !expertModeBtn_bool) {
            // get out of stupid mode
            expertModeBtn.click();
            expertModeBtn_bool = true;  // probably doesn't matter, since page should reload on click
        }

        if (customCSS_bool && bundlePop_bool && expertModeBtn_bool) {
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
