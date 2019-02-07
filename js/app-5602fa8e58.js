const templates = require('./templates.js');
import instantsearch from 'instantsearch.js';
import { searchBox, menu, hits } from 'instantsearch.js/es/widgets';

const algoliaProjects = require('./../algolia-projects-96ee2871f9.json');

const appId = 'latency';
const apiKey = '6be0576ff61c053d5f9a3225e2a90f76';
const indexName = 'community.algolia.com';

const loadDefs = () => {
  fetch('/img/projects/projects-defs-58912d5cf1.svg')
    .then(r => r.text())
    .then(svg => {
      document.querySelector('.svg-icons').innerHTML = svg;
    });
};

function validateEmail(email) {
  /* eslint-disable */
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

window.addEventListener('load', () => {
  loadDefs();

  if (window.location.hash) {
    const hash = document.querySelector(`[href="${window.location.hash}"]`);
    setTimeout(() => {
      scrollToElement(hash, 400);
    }, 60);
  }
});

const easeInOutCubic = (t, b, c, d) =>
  -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;

const parentWithClass = (startingNode, matchClassName) => {
  let node = startingNode;
  while (node.parentNode) {
    if (node.className.split(' ').indexOf(matchClassName) > -1) {
      return node;
    }
    node = node.parentNode;
  }
};

function scrollToElement(nodeOrSelector, totalTime = 400) {
  let node;
  let scrollToNode;
  const time = {};

  time.start = performance.now();
  time.total = totalTime;

  if (typeof nodeOrSelector === 'string') {
    node = document.querySelectorAll(nodeOrSelector);
    if (node.length > 1) {
      throw new Error(
        `Selector matches ${
          node.length
        } elements, please provide a unique selector`
      );
    }
    scrollToNode = node[0];
  } else {
    scrollToNode = nodeOrSelector;
  }

  const startDistance = window.scrollY;
  const endDistance = scrollToNode.getBoundingClientRect().top - 64;

  const tick = now => {
    const elapsed = now - time.start;
    const position = Math.round(
      easeInOutCubic(elapsed, startDistance, endDistance, time.total)
    );
    window.scroll(0, position);
    if (elapsed < time.total) {
      window.requestAnimationFrame(tick);
    }
  };

  window.requestAnimationFrame(tick);
}

const groupProjectsByCategory = projects => {
  const grouped = [];

  projects
    .sort((a, b) => a.ranking - b.ranking)
    .forEach(p => {
    if (!Array.isArray(grouped[p.categoryRanking - 1])) {
      grouped[p.categoryRanking - 1] = [];
    }

    grouped[p.categoryRanking - 1].push(p);
  });
  return grouped;
};

const renderItem = item => {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'ais-hits--item';
  wrapperDiv.innerHTML = templates.hitTemplate(item);
  return wrapperDiv;
};

const renderResults = allProjectsByCategories => {
  const injectInside = document.querySelector('.alg-communityprojects__hits');

  allProjectsByCategories.forEach(allProjectsForCategory => {
    const categoryName = allProjectsForCategory[0].category;

    let viewMore = null;

    if (allProjectsForCategory.length > 4) {
      viewMore = allProjectsForCategory.length - 4;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'alg-communityprojects__hitswrapper';
    wrapper.innerHTML = templates.headerTemplate(categoryName, viewMore);
    const wrapperHits = wrapper.querySelector('.ais-hits');

    allProjectsForCategory.forEach(project => {
      const article = renderItem(project);
      wrapperHits.appendChild(article);
    });

    injectInside.appendChild(wrapper);
  });
};

window.pardotAppendIframe = function pardotAppendIframe(url) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.width = 1;
  iframe.height = 1;
  document.body.appendChild(iframe);
};

function submitPardotForm(event) {
  event.preventDefault();
  const $signupForm = this.parentNode;
  const $message = this.querySelector('.mc-signupmessage');
  const size = $signupForm.querySelector('input').getBoundingClientRect();
  const email = this.querySelector('#mce-EMAIL').value;
  const action =
    this.getAttribute('action') ||
    'https://go.pardot.com/l/139121/2016-06-09/f3kzm';

  const isValidEmail = validateEmail(email);

  if (!isValidEmail) return false;

  if (email) {
    window.pardotAppendIframe(`${action}?email=${encodeURI(email)}`);
    $signupForm.classList.toggle('newsletter-signup--success');
    $message.innerHTML =
      'Thank you for subscribing <svg xmlns="http://www.w3.org/2000/svg" width="36" height="35" viewBox="0 0 36 35"><path d="M18 4.02C16.552 2.25 14.057.297 10.103.297 3.373.297 0 6.63 0 12.547c0 9.776 15.135 20.15 16.99 21.435.607.422 1.413.422 2.02 0C20.864 32.695 36 22.322 36 12.546 36 6.63 32.627.298 25.896.298c-3.953 0-6.448 1.954-7.896 3.72v.002z" fill="#fb366e" fill-rule="evenodd"/></svg>';
    $message.style.width = `${size.width}px`;
    $message.style.height = `${size.height}px`;
  }

  return true;
}

const subscribeForm = document.querySelector('#mc-embedded-subscribe-form');
subscribeForm.addEventListener('submit', submitPardotForm);

const DefaultContainer = document.querySelector(
  '.alg-communityprojects__hits.default'
);
const SearchContainer = document.querySelector(
  '.alg-communityprojects__hits.is'
);
const ClearRefinements = document.querySelector('.alg-community--clearSearch');

const search = instantsearch({
  appId,
  apiKey,
  indexName,
  searchParameters: {
    hitsPerPage: 42
  },
  searchFunction: helper => {
    const hasCategoryRefinement =
      helper.state.hierarchicalFacetsRefinements.category &&
      helper.state.hierarchicalFacetsRefinements.category.length > 0;
    if (helper.state.query == '') {
      ClearRefinements.classList.remove('visible');
    } else {
      ClearRefinements.classList.add('visible');
    }
    if (helper.state.query == '' && !hasCategoryRefinement) {
      DefaultContainer.style.display = 'block';
      SearchContainer.style.display = 'none';
    } else {
      DefaultContainer.style.display = 'none';
      SearchContainer.style.display = 'block';
    }
    helper.search();
  },
});

search.addWidget(
  searchBox({
    container: '#alg-community__search',
    placeholder: 'Search for projects, libraries, plugins, demos...',
    autofocus: false,
  })
);

search.addWidget(
  menu({
    container: '.alg-communityprojects__facets__is',
    attributeName: 'category',
    limit: 10,
    templates: {
      item: templates.menuTemplateIs,
      header: templates.header(algoliaProjects.length),
    },
  })
);

// add a hits widget
search.addWidget(
  hits({
    container: '.alg-communityprojects__hits.is',
    hitsPerPage: 30,
    templates: {
      item: templates.hitTemplate,
      empty: templates.noHits,
    },
  })
);

function onViewMoreClick(event) {
  event.preventDefault();
  const parentWrapper = parentWithClass(
    this,
    'alg-communityprojects__hitswrapper'
  );
  if (parentWrapper.classList.contains('expanded')) {
    parentWrapper.classList.remove('expanded');
  } else {
    parentWrapper.classList.add('expanded');
  }
  scrollToElement(this);
}

renderResults(groupProjectsByCategory(algoliaProjects));

const viewMoreLinks = [...document.querySelectorAll('.alg-viewmore')];
viewMoreLinks.forEach(l => l.addEventListener('click', onViewMoreClick));

search.on('render', () => {
  const header = document.querySelector('[data-tag="All Projects"]');

  header.addEventListener('click', e => {
    e.preventDefault();
    search.helper.clearRefinements();
    search.helper.setQuery('');
    search.helper.search();
  });

  ClearRefinements.addEventListener('click', e => {
    e.preventDefault();
    search.helper.clearRefinements();
    search.helper.setQuery('');
    search.helper.search();
  });
});

search.start();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/serviceWorker.js', { scope: '/' })
    .then(() => {})
    .catch(error => {
      console.log(error); // eslint-disable-line no-console
    });
}
