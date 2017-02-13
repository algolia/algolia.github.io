
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
  wrapperDiv.innerHTML = `
    <article class="alg-communityhit">
      <div class="alg-communityhit__details">
        <div class="alg-communityhit__icon">
          <svg width="84px" height="87px" viewBox="0 0 84 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-${data.icon}"></use>
          </svg>
        </div>
        <p class="alg-communityhit__type">${data.category}</p>
        <h3 class="alg-communityhit__name">${data.name}</h3>
        <p class="alg-communityhit__description">${data.description}</p>
        <div class="alg-communityhit__stats">   
           <div class="alg-communitystat">   
             <a>   
               <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-github"></use>
               </svg>    
             </a>    
           </div>    
           <div class="alg-communitystat">   
             <a>   
               <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-comments"></use></svg>    
               24    
             </a>    
           </div>    
           <div class="alg-communitystat">   
             <a>   
               <svg width="21" height="11" viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use>
               </svg>
             </a>    
           </div>    
         </div>
      </div>
    </article>
  `;
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
    attributeName: 'type',
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
