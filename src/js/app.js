
const templates = require('./templates.js');
const instantsearch = require('instantsearch.js');

const projects = require('./../algolia-projects.json');
const config = require('./../../config.json');

let { appID, apiKey, index } = config.algolia;

appID = "HXQH62TCI4";
apiKey = "0b9f3069b37517348a864b7239a8abfa";
index = "community";

const loadDefs = () => {
  fetch('/img/projects/projects-defs.svg')
    .then(r => r.text())
    .then(svg => {
      document.querySelector('.svg-icons').innerHTML = svg;
    })
}

window.addEventListener('load',() => {
  loadDefs();
});

const easeInOutCubic = (t, b, c, d) => {
  return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
}

const parentWithClass = (startingNode, matchClassName) => {
  let node = startingNode;
  while(node.parentNode){
    if(node.className.split(' ').indexOf(matchClassName) > -1){
      return node;
    }
    node = node.parentNode;
  }
}

function scrollToElement(nodeOrSelector, totalTime = 400){
  let node,
      scrollToNode,
      time = {};

  time.start = performance.now();
  time.total = totalTime;

  if(typeof nodeOrSelector === "string"){
    node = document.querySelectorAll(nodeOrSelector);
    if(node.length > 1){
      throw new Error(`Selector matches ${node.length} elements, please provide a unique selector`);
    }
    scrollToNode = node[0];
  } else {
    scrollToNode = nodeOrSelector;
  }

  const startDistance = window.scrollY;
  const endDistance = scrollToNode.getBoundingClientRect().top - 64;

  const tick = now => {
    const elapsed = now - time.start;
    const position = Math.round(easeInOutCubic(elapsed, startDistance, endDistance, time.total));
    window.scroll(0, position);
    elapsed < time.total ? window.requestAnimationFrame(tick) : null;
  }

  window.requestAnimationFrame(tick);
}

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
  let sortedProjects = [];

  Object.keys(projects).forEach(cat => {
    sortedProjects.push(projects[cat])
  });

  sortedProjects.sort((a,b) => a.length < b.length);

  sortedProjects.forEach(p => {
    p.sort((a,b) => a.ranking < b.ranking);
  })

  sortedProjects.forEach(projectsArray => {
    let cat = projectsArray[0].category || "Misc"
    let categoryArray = projects[cat]
    let dummyArray = projects[cat]
    let viewMore = null

    if(categoryArray.length > 4){
      viewMore = dummyArray.length - 4;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "alg-communityprojects__hitswrapper";
    wrapper.innerHTML = templates.headerTemplate(cat, viewMore);
    const wrapperHits = wrapper.querySelector('.ais-hits');

    if(categoryArray && categoryArray.length) {
      categoryArray.forEach(project => {
        const article = renderItem(project);
        wrapperHits.appendChild(article);
      });
    }
    injectInside.appendChild(wrapper);
  });
}

const renderItem = (data) => {
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "ais-hits--item";
  wrapperDiv.innerHTML = templates.hitTemplate(data);
  return wrapperDiv;
}

const renderMenuList = (projects) => {
  const listContainer = document.querySelector(".alg-communityprojects__facets ul");
  const totalProjects = Object.keys(projects).reduce((prev, current) => prev += projects[current].length, 0);
  const totalLi = renderMenuItem("All Projects", totalProjects, true);
  listContainer.appendChild(totalLi);

  let sortedProjects = [];
  Object.keys(projects).forEach(type => {
    const typeCategory = projects[type];
    sortedProjects.push(typeCategory);
  });

  sortedProjects.sort((a,b) => a.length < b.length);

  sortedProjects.forEach(projectArray => {
    if(projectArray && projectArray.length){
      const li = renderMenuItem(projectArray[0].category || "Misc", projectArray.length)
      listContainer.appendChild(li);
    }
  })
}

const renderMenuItem = (category, count, isHeader) => {
  const li = document.createElement("li");
  li.className = "ais-menu--item";
  li.innerHTML = templates.menuTemplate(category, count, isHeader)
  return li;
}


window.pardotAppendIframe = function pardotAppendIframe(url) {
  var iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = 1;
  iframe.height = 1;
  document.body.appendChild(iframe);
};

function submitPardotForm(event) {
  event.preventDefault()
  var $signupForm = this.parentNode
  var $message = this.querySelector('.mc-signupmessage')
  var size = $signupForm.querySelector('input').getBoundingClientRect()
  var email = this.querySelector('#mce-EMAIL').value
  var action =
    this.getAttribute('action') ||
    'https://go.pardot.com/l/139121/2016-06-09/f3kzm'

  const isValidEmail = validateEmail(email)

  if (!isValidEmail) return false

  if (email) {
    pardotAppendIframe(action + '?email=' + encodeURI(email))
    $signupForm.classList.toggle('newsletter-signup--success')
    $message.innerHTML =
      'Thank you for subscribing <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 36 35"><path d="M18 4.02C16.552 2.25 14.057.297 10.103.297 3.373.297 0 6.63 0 12.547c0 9.776 15.135 20.15 16.99 21.435.607.422 1.413.422 2.02 0C20.864 32.695 36 22.322 36 12.546 36 6.63 32.627.298 25.896.298c-3.953 0-6.448 1.954-7.896 3.72v.002z" fill="#fb366e" fill-rule="evenodd"/></svg>'
    $message.style.width = size.width + 'px'
    $message.style.height = size.height + 'px'
  }
}

const subscribeForm = document.querySelector('#mc-embedded-subscribe-form')
subscribeForm.addEventListener('submit', submitPardotForm)

const addTagToHelper = (event) => {
  search.helper.toggleRefine('category', event.target.dataset.tag);
  search.helper.search();
}

const DefaultContainer = document.querySelector('.alg-communityprojects__hits.default');
const SearchContainer = document.querySelector('.alg-communityprojects__hits.is');
const ClearRefinements = document.querySelector('.alg-community--clearSearch');

let search = instantsearch({
  appId: appID,
  apiKey: apiKey,
  indexName: index,
  searchFunction: (helper) => {
    const hasCategoryRefinement = helper.state.hierarchicalFacetsRefinements.category && helper.state.hierarchicalFacetsRefinements.category.length > 0;
    if(helper.state.query == ""){
      ClearRefinements.classList.remove('visible');
    } else {
      ClearRefinements.classList.add('visible');
    }
    if(helper.state.query == "" && !hasCategoryRefinement) {
      DefaultContainer.style.display = "block";
      SearchContainer.style.display = "none";
    } else {
      DefaultContainer.style.display = "none";
      SearchContainer.style.display = "block";
    }
    helper.search()
  }
});

// search.addWidget(
//   instantsearch.widgets.clearAll()
// )

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#alg-community__search',
    placeholder: 'Search for projects, libraries, plugins, demos...',
    autofocus: false
  })
);

search.addWidget(
  instantsearch.widgets.menu({
    container: '.alg-communityprojects__facets__is',
    attributeName: 'category',
    limit: 10,
    templates: {
      item: templates.menuTemplate_is,
      header: templates.header(projects.length)
    }
  })
);

// add a hits widget
search.addWidget(
  instantsearch.widgets.hits({
    container: '.alg-communityprojects__hits.is',
    hitsPerPage: 30,
    templates:{
      item: templates.hitTemplate,
      empty: templates.noHits
    }
  })
);

function onViewMoreClick(event) {
  event.preventDefault();
  const parentWrapper = parentWithClass(this, "alg-communityprojects__hitswrapper");
  parentWrapper.classList.contains('expanded') ?
  parentWrapper.classList.remove('expanded') :
  parentWrapper.classList.add('expanded');
  scrollToElement(this);
};

const sorted = sortProjectsByCategory(projects);
renderResults(sorted);

const viewMoreLinks = [...document.querySelectorAll('.alg-viewmore')];
viewMoreLinks.forEach(l => l.addEventListener('click', onViewMoreClick));

search.on('render', () => {

  const header = document.querySelector('[data-tag="All Projects"]');

  header.addEventListener('click', (e) => {
    e.preventDefault();
    search.helper.clearRefinements();
    search.helper.setQuery('');
    search.helper.search();
  });

  ClearRefinements.addEventListener('click', (e) => {
    e.preventDefault();
    search.helper.clearRefinements();
    search.helper.setQuery('');
    search.helper.search();
  });

})

search.start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js', { scope: '/' })
    .then(function(registration) {
    })
    .catch(function(error) {
      console.log(error)
    })
}



