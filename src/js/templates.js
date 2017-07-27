function HTMLescape(html){
    return document.createElement('div')
        .appendChild(document.createTextNode(html))
        .parentNode
        .innerHTML
}
exports.hitTemplate = (data) => `
 <article class="alg-communityhit elevation1 radius6 pos-rel">
      <div class="alg-communityhit__details">
        <div class="alg-communityhit__icon">
          <div class="elevation1 alg-communityhit__iconcontainer alg-icon-${data.category.toLowerCase().split(" ").join("-")}">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <title>${data.name} ${data.category}</title>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#${data.icon}"></use>
            </svg>
          </div>
        </div>
        <p class="alg-communityhit__type text-demi text-sm m-t-none m-b-none padder">${data.category}</p>
        <a href="${data.url_home || data.url_github || data.url_forum}" class="hit-namelink"><h3 class="alg-communityhit__name text-lg padder m-t-none m-b-small">${data.name}</h3></a>
        <p class="alg-communityhit__description text-sm m-t-none padder m-b">${HTMLescape(data.description)}</p>
        <div class="alg-communityhit__stats">
          ${data.url_github ? `
           <div class="alg-communitystat alg-communitystat--github">
             <a href="${data.url_github}" target="_blank" rel="noopener">
               <svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <title>Github repository icon</title>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-github"></use>
               </svg>
             </a>
           </div>`: ""}
           ${data.url_forum ? `
           <div class="alg-communitystat alg-communitystat--discourse">
             <a href="${data.url_forum}" target="_blank" rel="noopener">
               <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <title>Discouse Icon</title>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-comments"></use></svg>
             </a>
           </div>`: ""}
           ${data.url_home ? `
           <div class="alg-communitystat alg-communitystat--home">
             <a href="${data.url_home}" target="_blank" rel="noopener">
               <svg width="21" height="11" viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg">
                <title>Project homepage</title>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-link"></use>
               </svg>
             </a>
           </div>`:""}
         </div>
      </div>
    </article>
`;

exports.menuTemplate = (name, value, isHeader) => `
  <div class="${isHeader ? "ais-menu--item--header": ""} ais-menu--item alg-facet-${name.toLowerCase().split(" ").join("-")}">
    <a href="#" data-tag="${name}">
      <span class="alg-facet__tile">
      </span><span class="alg-facet__name">${name}</span>
      <span class="alg-facet__number">${value}</span>
    </a>
  </div>
`;

exports.menuTemplate_is = (category) => `
  <div class="ais-menu--item alg-facet-${category.name.toLowerCase().split(" ").join("-")}">
    <a href="#">
      <span class="alg-facet__tile">
      </span><span class="alg-facet__name">${category.name}</span>
      <span class="alg-facet__number">${category.count}</span>
    </a>
  </div>
`;

exports.headerTemplate = (category, viewMore) => {
  const displayShowMore = typeof viewMore === "number" && viewMore > 0;

  return `<header class="alg-header-${category.toLowerCase().split(" ").join("-")}">
    <div>
      <a href="#${category.split(' ').join('').toLowerCase()}"> 
        <h3 class="alg-communityprojects__hitstype text-xl">
        ${category}
        ${displayShowMore ? `<a class="alg-viewmore text-sm" href="">SEE ${viewMore} MORE<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><use xlink:href="#icon-arrow"></use></svg></a>` : ""}</h3>
      </a>
      <p class="alg-communityprojects__hitsdesc">${ '' }</p> 
  </header>
  <div class="ais-hits"></div>`;
}

exports.noHits = (query) => {
  return `
    <div class="empty-query">
      <img src="/img/logos/community-mark-dark.svg" alt="Algolia Community"/>
      <h4 class="m-b-none" >Your search query <span class="color-radical-red">"${HTMLescape(query.query)}"</span> did not return any search results,</br> but maybe our community can help?</h4>
      <div class="spacer24"></div>
      <a href="https://discourse.algolia.com" class="btn btn-static-secondary">
        Ask our community
      </a>
    </div>
  `
}

exports.header = (count) => `
    <div class="ais-menu--item--header ais-menu--item alg-facet-all-projects">
      <a href="#" data-tag="All Projects">
        <span class="alg-facet__tile">
        </span><span class="alg-facet__name">All Projects</span>
        <span class="alg-facet__number">${count}</span>
      </a>
    </div>`
