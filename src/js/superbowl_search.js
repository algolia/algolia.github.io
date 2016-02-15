/*jshint esversion: 6 */

let instantsearch = require('instantsearch.js');
const inceptionWidget = require('./widgets/inception.js');

let superbowlsearch = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'sb_ads',
  urlSync: true
});

window.search = superbowlsearch;

superbowlsearch.addWidget(
  instantsearch.widgets.searchBox({
    container: '#search',
    placeholder: 'Find ads from big games past&hellip;',
    wrapInput: false
  })
);

superbowlsearch.addWidget(
  instantsearch.widgets.hits({
    hitsPerPage: 30,
    container: '#results',
    templates: {
      empty: `<div class="no-results"><h2>No Results</h2>
        <p>What about starting a new search?</p></div>`,
      item: document.getElementById('hit-template').innerHTML
    },
    transformData: function(hit) {
      if (typeof hit !== 'undefined' && typeof hit._highlightResult !== 'undefined' ) {
        $.each(hit._highlightResult._tags, function( index, tag ) {
          if (tag.matchLevel === "full"){
            hit.matchedTag = '# ' + tag.value;
            return false;
          }
        });
      }
      return hit;
    }
  })
);

superbowlsearch.addWidget(
  instantsearch.widgets.menu({
    container: '#years',
    attributeName: 'year',
    limit: 1000,
    sortBy: ['name:desc'],
    templates: {
      item: '{{name}}'
    }
  })
);

superbowlsearch.addWidget(
  instantsearch.widgets.currentRefinedValues({
    container: "#refinements",
    clearAll: false,
    templates: {
      item: '<a href="javascript:void(0)">{{name}} <svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clear-icon"></use></svg></a>',
      clearAll: '<a href="javascript:void(0)"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#clear-icon"></use></svg> Clear All</a>',
    }
  })
);

superbowlsearch.addWidget(
  inceptionWidget({
    container: '#brands',
    mainSearchAttribute: 'brand',
    secondarySearchAttribute: 'name',
    index: 'sb_ads_brands'
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    maxPages: 20,
    padding: 1,
    showFirstLast: false
  })
);

superbowlsearch.on('render', function() {
  $('.hit img').one('load', function() {
    var img = $(this).attr('src');
    $(this).parent().css('background-image', 'url("' + img + '")');
    $(this).parent().addClass('loaded');
  }).each(function() {
      if(this.complete) $(this).load();
  });
  $('.ais-hits').removeClass('hide');
});

superbowlsearch.start();
