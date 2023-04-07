// ==UserScript==
// @name        add_kbrowser
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/add_kbrowser.user.js
// @version     3.3
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/*
// @exclude     https://krunker.io/social.html*
// @exclude     https://krunker.io/editor.html*
// @exclude     https://krunker.io/viewer.html*
// ==/UserScript==



/*
Portions of the code have been sourced from https://github.com/Infinitifall/KBrowser which is under the MIT license:

MIT License

Copyright (c) 2023 Infinitifall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var style_2 = `
.cgs-table {
    border-collapse: collapse;
    border: 0px;
}

.cgs-table th,
.cgs-table td {
    padding: 0.3em 0.5em;
    display: auto;
    height: auto;
    color: #333;
}

.cgs-table tr:hover {
    cursor:pointer;
    background-color:#ffffff66;
}

.cgs-table tr {
    border-bottom: none;
    display: auto;
    height: auto;
    color: #333;
}

.wrapper-browser {
    width:930px;
    height: 2000px;
    max-height: calc(100vh - 6em);
    margin: auto;
    padding: 1em 1em;
    border-radius: 0.5em;
    background-color: #ffffffbb;
    overflow: hidden;
    user-select: none;
    color: #333;
}

.wrapper-browser-inner {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0em 0em;
    color: #333;
}

.cg-mode { color: #bbb }
.cg-mode-bhop, .button-cgs-bhop { color: #634f94 }
.cg-mode-infect, .button-cgs-infect { color: #4c884f }
.cg-mode-team, .button-cgs-team { color: #b4598c }
.cg-mode-solo, .button-cgs-solo { color: #b17e4b }
.cg-mode-fun, .button-cgs-fun { color: #35988b }
.cg-mode-trade, .button-cgs-trade { color: #444 }
.cg-mode-bots, .button-cgs-bots { color: #444 }

.cg-map { color: #2b7fd3; }
.cg-map-repeated { color: #777; }
.cg-map-non-empty { color: #777; }
.cg-map-full { color: #555; }

.wrapper-cg-full a span { opacity: 0.7; }
.wrapper-cg-non-empty a span { opacity: 0.7; }

.cg-region { color: #6ca640; }
.cg-region-us-east, .button-cgs-us-east { color: #8e3346; }
.cg-region-us-west, .button-cgs-us-west { color: #8e3346; }
.cg-region-mx, .button-cgs-mx { color: #8e3346; }
.cg-region-eu, .button-cgs-eu { color: #003399; }
.cg-region-au, .button-cgs-au { color: #00008B; }
.cg-region-ind, .button-cgs-ind { color: #c87c31; }
.cg-region-asia, .button-cgs-asia { color: #aa5d96; }
.cg-region-arab, .button-cgs-arab { color: #815d42; }
.cg-region-afr, .button-cgs-afr { color: #267557; }
.cg-region-brz, .button-cgs-brz { color: #227942; }

.cg-players { color: #333; }

.cgs-table td a { display:block; }
.cgs-table td a:hover { text-decoration: none; }

.message-row { margin-top: 1em; }

.cgs-table  thead tr th:nth-child(1),
.cgs-table  tbody tr td:nth-child(1) {
    width: 5em;
    max-width: 5em;
    min-width: 5em;
    text-align: right;
}

.cgs-table thead .cgs-table-message th:nth-child(1),
.cgs-table tbody .cgs-table-message td:nth-child(1) {
    padding-top: 2em;
    padding-bottom: 1em;
    text-align: center;
    font-size: 20px;
    text-decoration: underline;
}

.cgs-table thead tr th:nth-child(2),
.cgs-table tbody tr td:nth-child(2) {
    width: 22em;
    max-width: 22em;
    min-width: 22em;
}

.cgs-table thead tr th:nth-child(3),
.cgs-table tbody tr td:nth-child(3) {
    width: 8em;
    max-width: 8em;
    min-width: 8em;
}

.cgs-table thead tr th:nth-child(4),
.cgs-table tbody tr td:nth-child(4) {
    width: 3em;
    max-width: 5em;
    min-width: 3em;
}

.cgs-table thead tr th:nth-child(5),
.cgs-table tbody tr td:nth-child(5) {
    width: 1em;
    max-width: 1em;
    min-width: 1em;
}

div#serverHolder,
div#carousel-infinite,
.serverHeader
{
    display:none;
}
`


var cgs_global;  // global source of truth for cgs
var update_cgs = true;  // whether to fetch cgs next time
var loaded_once = false;  // whether it was ever able to fetch json from server


async function update_cgs_global() {
    let response;
    let status;
    let max_tries = 5;

    while ((status != 200) && (max_tries > 0)) {
        response = await fetch("https://matchmaker.krunker.io/game-list?hostname=krunker.io");
        status = response.status;
        max_tries -= 1;
    }

    if (status == 200) {
        cgs_global = await response.json();

        if (!loaded_once) {
            loaded_once = true;
        }
    }
}


function timeout_fetching_cgs() {
    update_cgs = true;
    setTimeout(timeout_fetching_cgs, 10000);
}


function populate_table(cgs) {
    let table = document.getElementById("cgs");
    let parent;
    let serverHolder = document.getElementById("serverHolder");

    if (serverHolder) {
        table = document.createElement("table");
        table.id = "cgs";
        table.className = "cgs-table";
        let greatgrandparent = serverHolder.parentNode;
        serverHolder.remove();
        parent = document.createElement("div");
        parent.className = "wrapper-browser-inner";
        let grandparent = document.createElement("div");
        grandparent.className = "wrapper-browser";
        grandparent.appendChild(parent);
        greatgrandparent.appendChild(grandparent);


    } else if (table) {
        parent = table.parentNode;
        parent.innerHTML = "";

    } else {
        // nothing to do, return
        return;
    }

    table.innerHTML = "";

    let first_full = false;
    let fist_non_empty = false;

    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];

        // if starred custom game create a new row and populate it with custom game data
        if (!("star" in cg)) { continue; }

        let row = table.insertRow(-1);
        let cells = new Array(5);
        for (let j = 0; j < cells.length; j++) { cells[j] = row.insertCell(j); }

        let cg_link = "<a href=" + "https://krunker.io/?game=" + cg.link + ">";

        let start = "";
        let end = ""
        if ("full" in cg) {
            start = "<span class='wrapper-cg-full'>";
            end = "</span>"

            if (!first_full) {
                let row_message = document.createElement("tr");
                row_message.className = "cgs-table-message";
                row.parentNode.insertBefore(row_message, row);

                let cell = row_message.insertCell(0);
                cell.colSpan = 50;
                cell.innerHTML = "Full lobbies";

                first_full = true;
            }

        } else if ("non_empty" in cg) {
            start = "<span class='wrapper-cg-non-empty'>";
            end = "</span>"

            if (!fist_non_empty) {
                let row_message = document.createElement("tr");
                row_message.className = "cgs-table-message";
                row.parentNode.insertBefore(row_message, row);

                let cell = row_message.insertCell(0);
                cell.colSpan = 50;
                cell.innerHTML = "Repeat lobbies";

                fist_non_empty = true;
            }
        }

        // mode
        cells[0].innerHTML = start + cg_link + "<span class='cg-mode-" + cg.mode_type + "'>" + cg.mode + "</span>" + "</a>" + end;

        // map name
        let cells_1_innerhtml = cg_link + "<span class='cg-map";
        if ("full" in cg) { cells_1_innerhtml += "-full"; }
        else if ("non_empty" in cg) { cells_1_innerhtml += "-non-empty"; }
        else if ("repeated" in cg) { cells_1_innerhtml += "-repeated"; }
        cells_1_innerhtml += "'>" + cg.map.replace(/[^\x00-\x7F]/g, "") + "</span>" + "</a>";
        cells[1].innerHTML = start + cells_1_innerhtml + end;

        // region
        cells[2].innerHTML = start + cg_link + "<span class='cg-region-" + cg.region_group + "'>" + cg.region + "</span>" + "</a>" + end;

        // players
        cells[3].innerHTML = start + cg_link + "<span class='cg-players'>" + "&nbsp;".repeat(2 - cg.players.toString().length) + cg.players.toString() + "/" + cg.total.toString() + "</span>" + "</a>" + end;

        //special property
        let cells_4_innerhtml = "";
        if ("password" in cg) { cells_4_innerhtml = "🔒" }
        else if ("verified" in cg) { cells_4_innerhtml = "💙"}
        else if ("dedicated" in cg) { cells_4_innerhtml = "★" }
        cells[4].innerHTML = start + cells_4_innerhtml + end;
    }

    parent.appendChild(table);
}

function get_cgs_stats(cgs){

    let mode_stats = new Object();
    let mode_type_stats = new Object();
    let region_stats = new Object();
    let region_group_stats = new Object();
    let player_stats = new Object();
    let map_stats = new Object();

    player_stats.players = 0;
    player_stats.total = 0;

    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];

        player_stats.players += cg.players;
        player_stats.total += cg.total;

        // ignore empty maps
        if (cg.players == 0) { continue; }

        if (!(cg.map in map_stats)) { map_stats[cg.map] = 1; }
        else { map_stats[cg.map] += 1; }

        if (!(cg.mode in mode_stats)) { mode_stats[cg.mode] = 1; }
        else { mode_stats[cg.mode] += 1; }

        if (!(cg.mode_type in mode_type_stats)) { mode_type_stats[cg.mode_type] = 1; }
        else { mode_type_stats[cg.mode_type] += 1; }

        if (!(cg.region_group in region_group_stats)) { region_group_stats[cg.region_group] = 1; }
        else { region_group_stats[cg.region_group] += 1; }

        if (!(cg.region in region_stats)) { region_stats[cg.region] = 1;}
        else { region_stats[cg.region] += 1; }
    }

    return {
        "mode_stats": mode_stats,
        "mode_type_stats": mode_type_stats,
        "region_stats": region_stats,
        "region_group_stats": region_group_stats,
        "player_stats": player_stats,
        "map_stats": map_stats
    }
}

function compare_cgs(a, b, cgs) {
    let cgs_stats = get_cgs_stats(cgs);

    // const acceptable_player_ratio = 0.8;
    // if (
    //     (a.players != b.players) &&
    //     (
    //         ((a.players / b.players) <= acceptable_player_ratio) ||
    //         ((b.players / a.players) <= acceptable_player_ratio)
    //     )
    // ) {

    if (
        ((a.players != b.players) && (a.players > 20 || b.players > 20)) ||
        ((a.players <= 20 && a.players > 16 && b.players < 16) || (b.players <= 20 && b.players > 16 && a.players < 16)) ||
        ((a.players <= 16 && a.players > 10 && b.players < 10) || (b.players <= 16 && b.players > 10 && a.players < 10)) ||
        ((a.players <= 10 && a.players > 6 && b.players < 6) || (b.players <= 10 && b.players > 6 && a.players < 6)) ||
        ((a.players != b.players) && (a.players <= 6 || b.players <= 6))
    ) {
        return b.players - a.players;

    } else if (a.mode_type !== b.mode_type) {
        // less popular mode types on top
        if ((cgs_stats.mode_type_stats[a.mode_type] != cgs_stats.mode_type_stats[b.mode_type])) {
            return cgs_stats.mode_type_stats[a.mode_type] - cgs_stats.mode_type_stats[b.mode_type];
        }

        return a.mode_type.localeCompare(b.mode_type);


    } else if (
        (a.region_group !== b.region_group) &&
        (a.regions_group_preference != b.regions_group_preference)
    ) {
        // more preferred region group on top
        return b.regions_group_preference - a.regions_group_preference;

    } else if (
        (a.region_group !== b.region_group) &&
        (cgs_stats.region_stats[a.region] != cgs_stats.region_stats[b.region])
    ) {
        // more popular region on top
        return cgs_stats.region_stats[b.region] - cgs_stats.region_stats[a.region];

    } else if (cgs_stats.mode_stats[a.mode] != cgs_stats.mode_stats[b.mode]) {
        // less popular modes on top
        return cgs_stats.mode_stats[a.mode] - cgs_stats.mode_stats[b.mode];

    } else if (a.mode !== b.mode) {
        // alphabetical ordering of modes
        return a.mode.localeCompare(b.mode);

    } else if (b.total != a.total) {
        // higher total on top
        return b.total - a.total;
    }

    return 0;
}


function compare_cgs_2(a, b) {

    if (b.map !== a.map) {
        return a.map.localeCompare(b.map);

    } else if (a.region_group !== b.region_group) {
        return a.region_group.localeCompare(b.region_group);

    } else if (a.mode_type !== b.mode_type) {
        return a.mode_type.localeCompare(b.mode_type);

    } else if (a.mode !== b.mode) {
        return a.mode.localeCompare(b.mode);
    }

    return 0;
}


function polish_cgs(cgs, mode_type, region_group) {

    //  region / short / regions_group index / preference (used for lucky only)
    const regions_global = {
        "MIA":  ["US East",     0,      10],
        "NY":   ["US East",     0,      10],
        "SV":   ["US West",     1,      9],
        "DAL":  ["US South",    0,      8],
        "CHI":  ["US Mid",      0,      8],
        "STL":  ["US Mid",      0,      8],
        "HI":   ["US West",     1,      1],
        "FRA":  ["Europe",      2,      15],
        "LON":  ["Europe",      2,      7],
        "SIN":  ["Asia",        3,      10],
        "TOK":  ["Asia",        3,      3],
        "SEO":  ["Asia",        3,      3],
        "SYD":  ["Australia",   4,      7],
        "BLR":  ["India",       5,      6],
        "BRZ":  ["Brazil",      6,      5],
        "MX":   ["Mexico",      7,      2],
        "AFR":  ["Africa",      8,      1],
        "BHN":  ["Arabia",      9,      1]
    };

    //  region_group / preference (used for ordering)
    const regions_group = [
        ["us-east",     10],
        ["us-west",     8],
        ["eu",          11],
        ["asia",        9],
        ["au",          7],
        ["ind",         6],
        ["brz",         6],
        ["mx",          4],
        ["afr",         4],
        ["arab",        4],
    ]

    //  id / name / modes_types index
    const modes_global = {
        0:  ["ffa",     3],
        1:  ["tdm",     2],
        2:  ["point",   2],
        3:  ["ctf",     2],
        4:  ["bhop",    0],
        5:  ["hide",    4],
        6:  ["infect",  1],
        7:  ["race",    4],
        8:  ["lms",     3],
        9:  ["simon",   4],
        10: ["gun",     3],
        11: ["prop",    4],
        12: ["boss",    4],
        13: ["clas",    3],
        14: ["dep",     2],
        15: ["stalk",   4],
        16: ["koth",    3],
        17: ["oitc",    3],
        18: ["trade",   5],
        19: ["kc",      2],
        20: ["de",      2],
        21: ["sharp",   3],
        22: ["traitor", 4],
        23: ["raid",    6],
        24: ["blitz",   2],
        25: ["dom",     2],
        26: ["sdm",     2],
        27: ["kranked", 3],
        28: ["tdf",     2],
        29: ["dep_ffa", 3],
        33: ["chs",     3],
        34: ["bhffa",   3],
        35: ["zom",     6]
    };

    const modes_types_global = [
        "bhop",
        "infect",
        "team",
        "solo",
        "fun",
        "trade",
        "bots"
    ]

    let cgs_local = new Array();

    for (let i = 0; i < cgs.games.length; i++) {
        let cg = cgs.games[i];
        let custom_game = new Object();

        // ignore pubs
        if (cg[4].c == 0) { continue; }

        custom_game.players = cg[2];
        custom_game.total = cg[3];
        custom_game.map = cg[4].i;
        custom_game.link = cg[0];

        let region = cg[0].split(":")[0];
        if (region in regions_global) {
            custom_game.region = regions_global[region][0];
            custom_game.region_preference = regions_global[region][2];
            custom_game.region_group = regions_group[regions_global[region][1]][0];
            custom_game.regions_group_preference = regions_group[regions_global[region][1]][1];

            if (region_group !== undefined) {
                if (custom_game.region_group !== region_group) {
                    continue;
                }
            }

        } else if (region_group === undefined) {
            custom_game.region = region;
            custom_game.region_preference = 0;
            custom_game.region_group = "";
            custom_game.regions_group_preference = 0;
        } else {
            continue;
        }

        if (cg[4].g in modes_global) {
            custom_game.mode = modes_global[cg[4].g][0];
            custom_game.mode_type = modes_types_global[modes_global[cg[4].g][1]];

            if (mode_type !== undefined) {
                if (custom_game.mode_type !== mode_type) {
                    continue;
                }
            }

        } else if (mode_type === undefined) {
            custom_game.mode = "???";
            custom_game.mode_type = "";

        } else {
            continue;
        }

        if ("ds" in cg[4]) { custom_game.dedicated = cg[4].ds; }
        if ("pw" in cg[4]) { custom_game.password = cg[4].ds; }
        if (custom_game.total > 16 && custom_game.total < 40) { custom_game.verified = 1; }
        cgs_local.push(custom_game);
    }

    return cgs_local;
}


function sort_cgs(cgs, mode_type, region_group) {
    let cgs_local = polish_cgs(cgs, mode_type, region_group);
    // mode_type and region_group are ideally not used after this

    // sort custom games according to popularity and group by common properties
    cgs_local.sort((a, b) => compare_cgs(a, b, cgs_local));

    // show all unique non full maps
    let cg_maps = new Set();
    let cg_maps_not_full = new Object();

    for (let i = 0; i < cgs_local.length; i++) {
        let cg = cgs_local[i];

        if (!cg_maps.has(cg.map)) {
            cg_maps.add(cg.map);
            if (cg.players < cg.total) {
                cg_maps_not_full[cg.map] = 1;
                cg.unique_non_empty = 1;
                cg.star = 1;
            } else {
                // nothing
            }
        } else if (!(cg.map in cg_maps_not_full)) {
            if (cg.players < cg.total) {
                cg_maps_not_full[cg.map] = 1;
                cg.unique = 1;
                cg.star = 1;
            }
        }
    }

    let cgs_local_2 = new Array();

    // populate cgs_local_2 with star maps and
    // show repeats only if they meet a strict criteria
    let repeats_allowed = 10;
    let repeats_min_player_ratio = 0.4;
    // let repeats_min_players = 4;

    for (let i = 0; i < cgs_local.length; i++) {
        let cg = cgs_local[i];

        if (!("star" in cg)) { continue; }
        if ("done" in cg) { continue; }

        cgs_local_2.push(cg);

        // make sure at least one of mode or region is unique for lobbies of the same map
        // before considering them for repeats
        // let mode_regions = new Set();
        // mode_regions.add(cg.mode + "_" + cg.region_group);

        // as an alternative to mode_regions, use only region (since most maps have cyclic modes)
        // don't ponder so much over maps which have multiple lobbies
        let only_regions = new Set();
        only_regions.add(cg.region_group);

        let repeat_count = 0;
        for (let j = 0; j < cgs_local.length; j++) {
            let cg_2 = cgs_local[j];

            if (i == j) { continue; }
            if ("done" in cg_2) { continue; }

            if (cg.map == cg_2.map) {
                // if (mode_regions.has(cg_2.mode + "_" + cg_2.region_group)) {
                //     cg_2.done = 1;
                //     continue;
                // }

                if (only_regions.has(cg_2.region_group)) {
                    cg_2.done = 1;
                    continue;
                }

                if (
                    (cg_2.players < cg_2.total) &&
                    // (cg_2.players >= repeats_min_players) &&
                    ((cg_2.players / cg.players) >= repeats_min_player_ratio) &&
                    (repeat_count < repeats_allowed)
                ) {
                    cg_2.star = 1;
                    cg_2.done = 1;
                    cg_2.repeated = 1;
                    cgs_local_2.push(cg_2);

                    // mode_regions.add(cg_2.mode + "_" + cg_2.region_group);
                    only_regions.add(cg_2.region_group);
                    repeat_count += 1;
                }
            }
        }
    }

    // tag all full games and populate cgs_local_2 with them (at the end of the array)
    // here we don't care about their popularity, only of grouping by map name
    cgs_local.sort((a, b) => compare_cgs_2(a, b, cgs_local));

    for (let i = 0; i < cgs_local.length; i++) {
        let cg = cgs_local[i];

        if (cg.players == cg.total) {
            cg.star = 1;
            cg.full = 1;
            cgs_local_2.push(cg);
        }
    }

    // push all the non starred lobbies to cgs_local_2 too
    // tag the ones that are non empty
    for (let i = 0; i < cgs_local.length; i++) {
        let cg = cgs_local[i];

        if (!("star" in cg)) {
            if (cg.players > 0) {
                cg.star = 1;
                cg.non_empty = 1;
            }
            cgs_local_2.push(cg);
        }
    }

    return cgs_local_2;
}


async function populate_wrapper(mode_type, region_group) {

    // update cgs_global if update_cgs flag is set to true
    if (update_cgs) {
        await update_cgs_global();
        update_cgs = false;
    }

    if (document.getElementById("cgs") === null) {
        // only populate if table doesn't already exist
        let cgs_local = sort_cgs(cgs_global, mode_type, region_group);
        populate_table(cgs_local);
    }
}


async function main2() {

    let serverHolder_bool = false;

    const observer = new MutationObserver(function() {

        let serverHolder = document.querySelector("#serverHolder");

        if (serverHolder && !serverHolder_bool) {
            populate_wrapper();
            // server browser resets after a few seconds for some reason
            setTimeout(populate_wrapper, 1000);
            setTimeout(populate_wrapper, 2000);
            setTimeout(populate_wrapper, 3000);
            setTimeout(populate_wrapper, 4000);
            setTimeout(populate_wrapper, 5000);
            setTimeout(populate_wrapper, 6000);
            setTimeout(populate_wrapper, 7000);
            setTimeout(populate_wrapper, 8000);
            setTimeout(populate_wrapper, 9000);
            serverHolder_bool = true;
        }


        if (serverHolder_bool) {
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

    timeout_fetching_cgs();
}


function main() {
    // add custom style sheet to override default one
    let vm_css_2 = document.createElement('style');
    vm_css_2.innerHTML = style_2;
    vm_css_2.id = "vm_css_2";
    document.head.appendChild(vm_css_2);

    let menuBtnBrowser_bool = false;

    const observer = new MutationObserver(function() {

        let menuBtnBrowser = document.querySelector("#menuBtnBrowser");

        if (menuBtnBrowser && !menuBtnBrowser_bool) {
            menuBtnBrowser.addEventListener("click", main2, false);
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


main();