
var Draggable = require('./vendors/Draggable.js');

// https://github.com/samthor/rippleJS, not a commonJS module
require('./vendors/ripple.js');

function assignEasterEggs(){
  var cloudinary = 'https://res.cloudinary.com/hilnmyskv/image/upload/fl_lossy,';
  var links = {
    'w_277,h_150,f_auto,c_fill/ee_balance-bear_zqsw68.gif': 'balanceBear',
    'h_310,w_565,f_auto,c_fit/ee_client_wmg5na.gif': 'clientReaction',
    'w_277,h_150,f_auto,c_fill/ee_gianluca_wjxviy.png': 'gianlucaMeme',
    'f_auto,c_fill/ee_pizza_tpfwrg.gif': 'pizzaGradient',
    'w_277,h_150,f_auto,c_fill/ee_catshirt_jlxmqe.gif ': 'catShirt',
    'w_277,h_150,f_auto,c_fill/ee_nyan_tqq2lj.gif ': 'psychoCat',
    'w_277,h_150,f_auto,c_fill/ee_pushforce_ruydz3.gif': 'pushForce',
    'w_277,h_310,f_auto,c_fill/ee_too-quick-devops_cl8kov.gif': 'tooQuickDevops',
    'w_565,h_310,f_auto,c_fill/ee_ux-glass_bi6kb0.gif': 'uxGlass',
    'w_277,h_310,f_auto,c_fill/ee_vvo_gzsxfu.jpg': 'vvoThumb',
    'b_rgb:214062,e_displace/h_310,w_277,f_auto,c_fill/ee_pumpgirl_wsbhu8.gif': 'pumpIt',
    'f_auto,c_fill/ee_flyingsquirrels_hfuw6n.gif': 'flyingSquirrels',
    'w_277,h_150,f_auto,c_fill/ee_trainblocked_tg1wsv.gif': 'blockedTrain',
    'w_565,h_150,f_auto,c_fill/ee_dance_lpj2nj.gif': 'dancers',
    'f_auto,c_fill/v1491315491/RJbawzOeVYmIg_bpvg7b.gif': 'android'
  };
  for (var key in links) {
    if (links.hasOwnProperty(key)) {
      document.getElementById(links[key]).src = cloudinary + key
    }
  }

  // Perfs matters
  $('figure').on('mouseenter hover focus', function(){
    $(this).parent().find('> .ee img').css('visibility', 'visible')
  }).on('mouseleave', function(){
    $(this).parent().find('> .ee img').css('visibility','hidden')
  })
}


function ifSafari() {
  var isSafari = /constructor/i.test(window.HTMLElement);
  if(isSafari){
    document.body.classList.add('safari')
  }
}
function ifMobile(){
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return;
  }

  var droppableArr = [];
  // initialize draggable(s)
  $( '.draggable' ).map( function(i) {
    new Draggable( this, droppableArr, {
      draggabilly : { containment: document.body }
    } );
  } );

  assignEasterEggs()

}

const analytics = require('./analytics.js');
const templates = require('./templates.js');
const instantsearch = require('instantsearch.js');

const navigation = require('./navigation.js');

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


const addTagToHelper = (event) => {
  search.helper.toggleRefine('category', event.target.dataset.tag);
  search.helper.search();
}

const DefaultContainer = document.querySelector('.alg-communityprojects__hits.default');
const SearchContainer = document.querySelector('.alg-communityprojects__hits.is');

let search = instantsearch({
  appId: appID,
  apiKey: apiKey,
  indexName: index,
  searchFunction: (helper) => {
    const hasCategoryRefinement = helper.state.hierarchicalFacetsRefinements.category && helper.state.hierarchicalFacetsRefinements.category.length > 0;
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

// add a searchBox widget
search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#alg-community__search',
    placeholder: 'search projects...'
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
    hitsPerPage: 10,
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

search.start();