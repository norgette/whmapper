// ==UserScript==
// @name         BestPath Wormhole
// @namespace    https://mapper.eveuniversity.org/
// @version      0.2
// @description  Finds the best wormhole for a given source or destination.
// @author       Norgette Audier
// @match        https://mapper.eveuniversity.org/map/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://gitlab.com/norganna-eve/pathfinder/raw/master/js/pathfinder.js
// @grant        unsafeWindow
// ==/UserScript==

(function() {
  'use strict';

  const win = unsafeWindow ? unsafeWindow : window;
  const pf = window.PathFinder;

  const finder = $('<button id="btnPath" class="btn btn-xs btn-primary">PathFinder</button>');
  const search = $('<div id="pathFinderSearch" style="margin: 0.25em 0;">');
  const searchBox = $('<input type="text" id="findSystem" class="systemAuto form-control input-sm" style="width: 400px; display: inline-block;" placeholder="System Name"/>');
  const searchButton = $('<button id="btnSearch" class="btn btn-sm btn-primary">Search</button>')
  const searchResults = $('<div>');
  search.append(searchBox).append(searchButton).append(searchResults).hide();

  finder.on('click', () => search.toggle());
  searchButton.on('click', () => showPathFinder(searchBox.val()));

  $('.btn-toolbar').append(finder).after(search);

  function showPathFinder(search) {
    const s = win.systemsJSON;
    const results = [];
    const distance = {};
    const path = {};
    for (let i = 0; i < s.length; i++) {
      const ss = s[i];
      if (pf.jumps[ss.sysID]) {
        const found = pf.findPath(ss.sysID, search);
        if (found) {
          results.push(ss.Name);
          distance[ss.Name] = found.length + ss.LevelX - 1;
          const steps = [];
          for (let j = 0; j < found.length; j++) {
            const hop = found[j];
            steps.push(hop.system + ' (' + hop.security + ')')
          }
          path[ss.Name] = steps.join(', ');
        }
      }
    }

    searchResults.text('');
    results.sort((a,b) => distance[a]-distance[b]);
    for (let i = 0; i < results.length; i++) {
      const k = results[i];
      const d = distance[k];
      const p = path[k];
      searchResults.append($('<div>').attr('title', p).text(k + ': ' + d + ' jumps'));
    }
  }
})();
