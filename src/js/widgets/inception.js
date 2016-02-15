const template = {
  main: function(data){
    return `
      <div class='menu'>
        <form name="brand" role="search" novalidate="novalidate" class="searchbox sbx-custom" onsubmit="return false;">
            <input name="brandquery" type="search" placeholder="Search for a brand" autocomplete="off" required="required" class="sbx-custom__input ais-search-box--input" autocapitalize="off" autocorrect="off" role="textbox" spellcheck="false">
            <button type="submit" class="sbx-custom__submit">
              <svg role="img" aria-label="Search">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-search-6"></use>
              </svg>
            </button>
            <button type="reset" class="sbx-custom__reset">
              <svg role="img" aria-label="Reset">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sbx-icon-clear-3"></use>
              </svg>
            </button>
          </form>
        <ul class='items'></ul>
      </div>`;
  },
  item: function(value, highlight){
    return `<li data-facet-value="${value}">${highlight}</li>`;
  }
}

const inceptionWidget = function(config){

  const container = config.container;
  const mainSearchAttribute = config.mainSearchAttribute;
  const secondarySearchAttribute = config.secondarySearchAttribute;
  const index = config.index;
  const title = config.title;

  return {
    getConfiguration: function(){
      const widgetConfiguration = {
        'disjunctiveFacets': [mainSearchAttribute]
      };

      return widgetConfiguration;
    },
    init: function(params){
      const helper = params.helper;
      const $container = document.querySelector(container);

      $container.innerHTML = template.main({title: title});

      setTimeout(function(){
        const $input = $container.querySelector('input[type="search"]');
        const $list = $container.querySelector('ul');
        const $menu = $container.querySelector('.menu');
        const $reset = $container.querySelector('.sbx-custom__reset');

        $input.addEventListener('keyup', function(e){
          const query = $input.value;
          if(query === '') {
            const results = helper.lastResults
            updateList($list, mainSearchAttribute, results);
          }
          else {
            helper.searchOnce({
              index: index,
              query: query,
              facets: [],
              facetsRefinements: [],
              disjunctiveFacetsRefinements: [],
              disjunctiveFacets: []
            }).then(updateListSearchOnce.bind(undefined, secondarySearchAttribute, $list));
          }
        });
        $reset.addEventListener('click', function(e){
          $input.value = '';
          const results = helper.lastResults;
          updateList($list, mainSearchAttribute, results);
        });

        $list.addEventListener('click', function(e){
          const target = e.target;
          const facetValue = target.dataset.facetValue;
          if(!facetValue) return;
          helper.clearRefinements(mainSearchAttribute)
                .addDisjunctiveFacetRefinement(mainSearchAttribute, facetValue)
                .search();
          $input.value = '';
        });
        // $menu.classList.add('hide');
        // $button.addEventListener('click', () => {
        //   $menu.classList.remove('hide');
        // });
      }, 0);
    },
    render: function(params){
      // updates when the search change
      const results = params.results;
      const $container = document.querySelector(container);
      const $list = $container.querySelector('ul');

      updateList($list, mainSearchAttribute, results);
    }
  };
};

function updateList ($list, attribute, results){
  const facets = results.getFacetValues(attribute);

  const list = facets.map(function(facet){
    return template.item(facet.name, facet.name);
  }).join('');

  $list.innerHTML = list;
};

function updateListSearchOnce(attribute, $list, response) {
  const results = response.content;

  if(results.nbHits === 0) {
    $list.innerHTML = '';
    return;
  }

  const list = results.hits.map(function(hit){
    const hlValue = (hit._highlightResult[attribute] && hit._highlightResult[attribute].value)|| hit[attribute];
    return template.item(hit[attribute], hlValue);
  }).join('');

  $list.innerHTML = list;
};


module.exports = inceptionWidget;
