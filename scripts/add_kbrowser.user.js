// ==UserScript==
// @name        add_kbrowser
// @namespace   https://github.com/Infinitifall/KUserscripts
// @homepageURL https://github.com/Infinitifall/KUserscripts
// @author      Infinitifall
// @downloadURL https://github.com/Infinitifall/KUserscripts/raw/main/scripts/add_kbrowser.user.js
// @version     19.1
// @run-at      document-end
// @grant       GM_addStyle
// @include     https://krunker.io/*
// @exclude     https://krunker.io/social.html*
// @exclude     https://krunker.io/editor.html*
// @exclude     https://krunker.io/viewer.html*
// ==/UserScript==



/*
Portions of the code have been sourced from other software (licenses below):

1. From Infinitifall/KBrowser, MIT License, Copyright (c) 2023 Infinitifall

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
a { text-decoration: none; }
a:hover { text-decoration: none; }


.wrapper-browser {
    width: 42em;
    margin: auto;
}

.cgs-table {
    border-collapse: collapse;
    border: 0;
    margin: auto;
}

.cgs-table > thead > tr > th,
.cgs-table > tbody > tr > th,
.cgs-table > thead > tr > td,
.cgs-table > tbody > tr > td {
    padding: 0 0 0 0;  /* has non zero padding without this for some reason */
    height: 35px;
}

.cgs-table > thead > tr > th > a,
.cgs-table > tbody > tr > th > a,
.cgs-table > thead > tr > td > a,
.cgs-table > tbody > tr > td > a {
    padding: 0.3em 0.5em;
    display: block;
}

.cgs-table > thead > tr,
.cgs-table > tbody > tr {
    border: none;
}

.cgs-table > thead > tr:hover,
.cgs-table > tbody > tr:hover {
    cursor:pointer;
    background-color:#ffffff66;
}

.wrapper-browser {
    height: auto;
    margin-top: 0;
    padding: 1em 1em;
    border-radius: 0.5em;
    background-color: #ffffffbb;
    overflow: hidden;
    user-select: none;
}

.wrapper-browser-inner {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0em 0em;
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
.cg-map-empty { color: #777; }
.cg-map-full { color: #555; }

.wrapper-cg-full { opacity: 0.8; }
.wrapper-cg-non-empty { opacity: 0.8; }
.wrapper-cg-empty { opacity: 0.6; }

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

.cgs-stats-grandparent { margin-top: 2em; }
.cgs-stats { color: #666; padding: 0.3em 0em; }

.cgs-table >tbody > td a { display:block; }
.cgs-table >tbody > td a:hover { text-decoration: none; }

.cgs-table > thead > tr > th:nth-child(1),
.cgs-table > tbody > tr > td:nth-child(1) {
    width: 6em;
    max-width: 6em;
    min-width: 6em;
    text-align: right;
}

.cgs-table > thead > tr > th:nth-child(2),
.cgs-table > tbody > tr > td:nth-child(2) {
    width: 21em;
    max-width: 21em;
    min-width: 21em;
}

.cgs-table > thead > tr > th:nth-child(3),
.cgs-table > tbody > tr > td:nth-child(3) {
    width: 8em;
    max-width: 8em;
    min-width: 8em;
}

.cgs-table > thead > tr th:nth-child(4),
.cgs-table > tbody > tr td:nth-child(4) {
    width: 5em;
    max-width: 5em;
    min-width: 5em;
}

.cgs-table > thead > tr th:nth-child(5),
.cgs-table > tbody > tr td:nth-child(5) {
    width: 2em;
    max-width: 2em;
    min-width: 2em;
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
var cgs_server = "https://matchmaker.krunker.io/game-list?hostname=krunker.io";
var show_pubs = true;  // whether to show public lobbies


async function update_cgs_global() {
    // fetch cgs from server
    let response;
    let status;
    let remaining_tries = 3;
    for (let i = 0; i < remaining_tries; i++) {
        try { response = await fetch(cgs_server); }
        catch (e) { return null; }
        status = response.status;
        if (status == 200) { break; }
    }

    if (status != 200) { return null; }

    // update cgs_global
    cgs_global = await response.json();
    return status;
}


function timeout_fetching_cgs(interval) {
    update_cgs = true;
    setTimeout( timeout_fetching_cgs, interval);
}


function populate_table(cgs) {
    let table = document.getElementById("cgs");
    // clear all contents
    table.innerHTML = "";

    // insert all lobbies
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];

        // format lobby properties
        let cg_link = "https://krunker.io/?game=" + cg.link;
        let cg_mode = "cg-mode-" + cg.mode_type;
        let cg_status = "cg-map"; if ("status" in cg) { cg_status += "-" + cg.status}
        let cg_regions_group = "cg-region-" + cg.regions_group;
        let cg_players = "cg-players";
        let cg_special = "";
        if ("password" in cg) { cg_special = "🔒" }
        else if (cg.public == 0) { cg_special = "🛠️" }
        else if ("verified" in cg) { cg_special = "💙"}
        else if ("extra_large" in cg) { cg_special = "🏟️" }
        else if ("dedicated" in cg) { cg_special = "🔸" }
        
        // create nodes
        let span_elements = new Array();
        for (let j = 0; j <= 4; j++) { span_elements.push(document.createElement("span")); }
        span_elements[0].className = cg_mode;
        span_elements[0].innerHTML = cg.mode;
        span_elements[1].className = cg_status;
        span_elements[1].innerHTML = cg.map.replace(/[^\x00-\x7F]/g, "");
        span_elements[2].className = cg_regions_group;
        span_elements[2].innerHTML = cg.region;
        span_elements[3].className = cg_players;
        span_elements[3].innerHTML = "&nbsp;".repeat(2 - cg.players.toString().length) + cg.players.toString() + "/" + cg.total.toString();
        span_elements[4].innerHTML = cg_special;

        // wrap nodes in <a> element
        let a_elements = new Array();
        for (let j = 0; j < span_elements.length; j++) {
            let temp_a = document.createElement("a");
            temp_a.href = cg_link;
            temp_a.rel = "noreferrer";
            temp_a.appendChild(span_elements[j]);
            a_elements.push(temp_a);
        }

        // create and populate row
        let row = table.insertRow(-1);
        if ("status" in cg) { row.className = "wrapper-cg-" + cg.status; }
        let cells = new Array(5);
        for (let j = 0; j < cells.length; j++) { cells[j] = row.insertCell(j); }
        for (let j = 0; j < span_elements.length; j++) { cells[j].appendChild(a_elements[j]); }
    }

    parent.appendChild(table);
}


function get_cgs_stats(cgs){
    let mode_stats = new Object();
    let mode_type_stats = new Object();
    let region_stats = new Object();
    let regions_group_stats = new Object();
    let player_stats = new Object();
    let map_stats = new Object();

    player_stats.players = 0;
    player_stats.total = 0;
    
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];

        player_stats.players += cg.players;
        player_stats.total += cg.total;
    
        if (!(cg.map in map_stats)) { map_stats[cg.map] = 1; }
        else { map_stats[cg.map] += 1; }

        if (!(cg.mode in mode_stats)) { mode_stats[cg.mode] = 1; }
        else { mode_stats[cg.mode] += 1; }

        if (!(cg.mode_type in mode_type_stats)) { mode_type_stats[cg.mode_type] = 1; }
        else { mode_type_stats[cg.mode_type] += 1; }

        if (!(cg.regions_group in regions_group_stats)) { regions_group_stats[cg.regions_group] = 1; }
        else { regions_group_stats[cg.regions_group] += 1; }

        if (!(cg.region in region_stats)) { region_stats[cg.region] = 1;}
        else { region_stats[cg.region] += 1; }
    }

    return {
        "mode_stats": mode_stats,
        "mode_type_stats": mode_type_stats,
        "region_stats": region_stats,
        "regions_group_stats": regions_group_stats,
        "player_stats": player_stats,
        "map_stats": map_stats
    }
}


function compare_cgs_popularity(a, b, cgs) {
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
        (a.regions_group !== b.regions_group) &&
        (a.regions_group_preference != b.regions_group_preference)
    ) {
        // more preferred region group on top
        return b.regions_group_preference - a.regions_group_preference;
    
    } else if (
        (a.regions_group !== b.regions_group) &&
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


function compare_cgs_name(a, b) {

    if (b.map !== a.map) {
        return a.map.localeCompare(b.map);

    } else if (a.regions_group !== b.regions_group) {
        return a.regions_group.localeCompare(b.regions_group);

    } else if (a.mode_type !== b.mode_type) {
        return a.mode_type.localeCompare(b.mode_type);

    } else if (a.mode !== b.mode) {
        return a.mode.localeCompare(b.mode);
    }
    
    return 0;
}


function polished_cgs(cgs, mode_type, regions_group) {

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
        "BLR":  ["India",       5,      7],
        "MBI":  ["India",       5,      7],
        "BRZ":  ["Brazil",      6,      5],
        "MX":   ["Mexico",      7,      2],
        "AFR":  ["Africa",      8,      2],
        "BHN":  ["Arabia",      9,      5]
    };

    //  regions_group / preference (used for ordering)
    const regions_groups_global = [
        ["us-east",     10],
        ["us-west",     8],
        ["eu",          11],
        ["asia",        9],
        ["au",          7],
        ["ind",         7],
        ["brz",         6],
        ["mx",          2],
        ["afr",         3],
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
        let cg_2 = new Object();

        cg_2.players = cg[2];
        cg_2.total = cg[3];
        cg_2.map = cg[4].i;
        cg_2.link = cg[0];
        cg_2.public = cg[4].c;
        
        if ("ds" in cg[4]) { cg_2.dedicated = cg[4].ds; }
        if ("pw" in cg[4]) { cg_2.password = cg[4].pw; }
        if (cg_2.total > 16 && cg_2.total <= 20) { cg_2.verified = true; }
        if (cg_2.total > 20) { cg_2.extra_large = true; }

        if (
            (cg_2.public == 0) &&
            (show_pubs == false)
        ) {
            continue;
        }

        // browser dies without this
        if (cg_2.players == 0) {
            continue;
        }

        let region = cg[0].split(":")[0];
        if (region in regions_global) {
            cg_2.region = regions_global[region][0];
            cg_2.region_preference = regions_global[region][2];
            cg_2.regions_group = regions_groups_global[regions_global[region][1]][0];
            cg_2.regions_group_preference = regions_groups_global[regions_global[region][1]][1];
            
            if (regions_group != null) {
                if (cg_2.regions_group != regions_group) {
                    continue;
                }
            }

        } else if (regions_group == null) {
            cg_2.region = region;
            cg_2.region_preference = 0;
            cg_2.regions_group = "";
            cg_2.regions_group_preference = 0;

        } else {
            continue;
        }

        if (cg[4].g in modes_global) {
            cg_2.mode = modes_global[cg[4].g][0];
            cg_2.mode_type = modes_types_global[modes_global[cg[4].g][1]];
            
            if (mode_type != null) {
                if (cg_2.mode_type != mode_type) {
                    continue;
                }
            }
            
        } else if (mode_type == null) {
            cg_2.mode = "???";
            cg_2.mode_type = "";

        } else {
            continue;
        }

        cgs_local.push(cg_2);
    }

    return cgs_local;
}


function sorted_cgs(cgs) {
    // sort lobbies by popularity
    cgs.sort((a, b) => compare_cgs_popularity(a, b, cgs));

    // tag lobbies with unique, unique_not_full and star
    let cg_unique = new Set();
    let cg_unique_not_full = new Set();
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];

        if (!cg_unique.has(cg.map)) {
            cg_unique.add(cg.map);
            cg.unique = true;
        }

        if (
            !(cg_unique_not_full.has(cg.map)) &&
            (cg.players < cg.total) &&
            (cg.players > 0)
        ) {
            cg_unique_not_full.add(cg.map);
            cg.unique_not_full = true;
            cg.star = true;
        }
    }
    
    // new cgs which we will populate with sorted lobbies
    let cgs_local_2 = new Array();

    let repeats_allowed = 10;           // maximum number of repeats allowed per map
    let repeats_min_player_ratio = 0.4; // ratio of players below which repeat lobbies are ignored
    let repeats_min_players = 0;        // number of players below which repeat lobbies are ignored

    // append starred lobbies and repeats
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];

        if (!("star" in cg)) { continue; }
        if ("done" in cg) { continue; }

        cg.done = true;
        cgs_local_2.push(cg);

        // for repeats, check if at least one of mode or region is unique
        let mode_regions = new Set();
        mode_regions.add(cg.mode + "_" + cg.regions_group);

        // an alternative to mode_regions for repeats, check if region is unique
        let only_regions = new Set();
        only_regions.add(cg.regions_group);
        
        // search for repeats
        let repeat_count = 0;
        for (let j = 0; j < cgs.length; j++) {
            let cg_2 = cgs[j];

            if (cg.map != cg_2.map) { continue; }
            if (i == j) { continue; }
            if ("done" in cg_2) { continue; }
            if (only_regions.has(cg_2.regions_group)) { continue; }
            // if (mode_regions.has(cg_2.mode + "_" + cg_2.regions_group)) { continue; }
            
            if (
                (cg_2.players < cg_2.total) && 
                (cg_2.players >= repeats_min_players) && 
                ((cg_2.players / cg.players) >= repeats_min_player_ratio) && 
                (repeat_count < repeats_allowed)
            ) {
                cg_2.done = true;
                cg_2.status = "repeated";
                cgs_local_2.push(cg_2);

                mode_regions.add(cg_2.mode + "_" + cg_2.regions_group);
                only_regions.add(cg_2.regions_group);
                repeat_count += 1;
            }
        }
    }

    // sort lobbies by map
    cgs.sort((a, b) => compare_cgs_name(a, b, cgs));
    
    // append full lobbies
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];
        if ("done" in cg) { continue; }
        if (cg.players == cg.total) {
            cg.status = "full";
            cg.done = true;
            cgs_local_2.push(cg);
        }
    }

    // append non empty lobbies
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];
        if ("done" in cg) { continue; }
        if (cg.players > 0) {
            cg.status = "non-empty";
            cg.done = true;
            cgs_local_2.push(cg);
        }
    }

    // append empty lobbies
    for (let i = 0; i < cgs.length; i++) {
        let cg = cgs[i];
        if ("done" in cg) { continue; }
        if (cg.players == 0) {
            cg.status = "empty";
            cg.done = true;
            cgs_local_2.push(cg);
        }
    }

    return cgs_local_2;
}


async function populate_wrapper(mode_type, regions_group) {
    // update cgs_global if required
    if (update_cgs == true) {
        let update_cgs_return = await update_cgs_global();
        update_cgs = false;
    }

    // update global variables
    latest_mode_type = mode_type;
    latest_regions_group = regions_group;

    // sort cgs and populate table
    let cgs_local = polished_cgs(cgs_global, mode_type, regions_group);
    cgs_local = sorted_cgs(cgs_local);
    populate_table(cgs_local);
}


function main3() {
    try {
        // create wrapper and table
        let serverHolder = document.querySelector("#serverHolder");
        let cgs = document.querySelector("#cgs");
        if (serverHolder && !cgs) {
            let table = document.createElement("table");
            table.id = "cgs";
            table.className = "cgs-table";
            let parent = document.createElement("div");
            parent.className = "wrapper-browser-inner";
            let grandparent = document.createElement("div");
            grandparent.className = "wrapper-browser";
            let greatgrandparent = serverHolder.parentNode;
            parent.appendChild(table);
            grandparent.appendChild(parent);
            greatgrandparent.appendChild(grandparent);
            serverHolder.remove();
        }

        let cgs_is_populated = document.querySelector("#cgs > tbody > tr");
        if (!cgs_is_populated) {
            populate_wrapper();
            timeout_fetching_cgs();
        }

    } catch (e) {
        // do nothing
    }
}


async function main2() {
    let serverHolder_bool = false;
    const observer = new MutationObserver(function() {
        let serverHolder = document.querySelector("#serverHolder");
        let cgs = document.querySelector("#cgs");
        if (serverHolder && !cgs && !serverHolder_bool) {
            main3();
            // server browser window clears after a few seconds for some reason, try repeatedly
            for (let i = 1; i < 20; i++) { setTimeout(main3, i * 1000); }
            serverHolder_bool = true;
        }
        if (serverHolder_bool) { observer.disconnect(); }
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
        if (menuBtnBrowser_bool) { observer.disconnect(); }
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
