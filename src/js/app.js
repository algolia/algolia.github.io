const analytics = require('./analytics.js');
const templates = require('./templates.js');
const instantsearch = require('instantsearch.js');

const navigation = require('./navigation.js');

const projects = require('./../algolia-projects.json');
const config = require('./../../config.json');

let { appID, apiKey, index } = config.algolia;

appID = "HXQH62TCI4";
apiKey = "0b9f3069b37517348a864b7239a8abfa";
index = "community_testing";

const sortProjectsByCategory = (projects) => {
  let sorted = {};
  projects.sort((a, b) => {
    const catA = a.category,
          catB = b.category;
    if(catA > catB) return -1;
    else if ( catA < catB ) return 1;
    return 0;
  });

  projects.forEach((p, index) => {
    if(!sorted[p.category]){
      sorted[p.category] = [];
    }
    sorted[p.category].push(p);
  });
  return sorted;
}

const renderResults = (projects) => {
  const injectInside = document.querySelector(".alg-communityprojects__hits");

  Object.keys(projects).forEach(cat => {
    const wrapper = document.createElement("div");
    wrapper.className = "alg-communityprojects__hitswrapper";
    wrapper.innerHTML = renderCategoryTemplate(cat);
    const wrapperHits = wrapper.querySelector('.ais-hits');

    if(projects[cat] && projects[cat].length) {
      const categoryArray = projects[cat];
      categoryArray.forEach(project => {
        const article = renderItem(project);
        wrapperHits.appendChild(article);
      });
    }
    injectInside.appendChild(wrapper);
  });
}

const renderCategoryTemplate = (category) => {
  return `
    <header>
      <h3 class="alg-communityprojects__hitstype" data-type="${category}">${category}</h3>
      <p>${ 'Latest projects or big updates, you should definitely check that projects.' }</p> 
    </header>
    <div class="ais-hits"></div>
  `;
}

const renderItem = (data) => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "ais-hits--item";
  wrapperDiv.innerHTML = templates.hitTemplate(data);
  return wrapperDiv;
} 

const renderMenuList = (projects) => {
  const listContainer = document.querySelector(".alg-communityprojects__facets ul");

  Object.keys(projects).forEach(type => {
    const typeCategory = projects[type];
    if(typeCategory && typeCategory.length){
      const li = renderMenuItem(type, typeCategory.length)
      listContainer.appendChild(li);
    }
  });
}

const renderMenuItem = (category, count) => {
  const li = document.createElement("li");
  li.className = "ais-menu--item";
  li.innerHTML = `
    <li class="ais-menu--item">
      <a href="#">
        <span class="alg-facet__tile" data-type="${category}">
        </span><span class="alg-facet__name">${category}</span>
        <span class="alg-facet__number">${count}</span>
      </a>
    </li>
  `;
  return li;
}


window.pardotAppendIframe = function pardotAppendIframe(url) {
  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = 1;
  iframe.height = 1;
  document.body.appendChild(iframe);
};

$('#mc_embed_signup').on('submit', function success(event) {
  event.preventDefault();
  var $signupForm = $('#mc_embed_signup');
  var $message = $('.mc-signupmessage');
  var email = $('#mce-EMAIL').val();
  if (email) {
    window.pardotAppendIframe('https://go.pardot.com/l/139121/2016-06-09/f3kzm?email=' + encodeURI(email));
    $signupForm.addClass('mc_embed_signup--success');
    $message.html('Thank you for subscribing <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 36 35"><path d="M18 4.02C16.552 2.25 14.057.297 10.103.297 3.373.297 0 6.63 0 12.547c0 9.776 15.135 20.15 16.99 21.435.607.422 1.413.422 2.02 0C20.864 32.695 36 22.322 36 12.546 36 6.63 32.627.298 25.896.298c-3.953 0-6.448 1.954-7.896 3.72v.002z" fill="#fb366e" fill-rule="evenodd"/></svg>');
  }
});

window.onload = () => {
  search.start();
  const sorted = sortProjectsByCategory(projects);
  renderMenuList(sorted);
  renderResults(sorted);
}

const DefaultContainer = document.querySelector('#alg-communitycontainer--default');
const SearchContainer = document.querySelector('#alg-communitycontainer');

let search = instantsearch({
  appId: appID,
  apiKey: apiKey,
  indexName: index,
  searchFunction: (helper) => {
    if(helper.state.query == ""){
      DefaultContainer.style.display = "flex";
      SearchContainer.style.display = "none";
    } else {
      DefaultContainer.style.display = "none";
      SearchContainer.style.display = "flex";
      helper.search()
    }
  }
});

// add a searchBox widget
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#alg-community__search',
    placeholder: 'Search for libraries in France...'
  })
);

search.addWidget(
  instantsearch.widgets.menu({
    container: '.alg-communityprojects__facets__is',
    attributeName: 'category',
    limit: 10,
    templates: {
      item: templates.menuTemplate
    }
  })
);

// add a hits widget
search.addWidget(
  instantsearch.widgets.hits({
    container: '.alg-communityprojects__hits__is',
    hitsPerPage: 10,
    templates:{
      item: templates.hitTemplate,
    }
  })
);
