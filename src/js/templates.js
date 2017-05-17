
exports.hitTemplate = (data) => `
 <article class="alg-communityhit elevation1 radius6 pos-rel">
      <div class="alg-communityhit__details">
        <div class="alg-communityhit__icon">
          <div id="icon-${data.name.replace('.js','').toLowerCase()}" class="elevation1 alg-communityhit__iconcontainer alg-icon-${data.category.toLowerCase().split(" ").join("-")}">
            <img src="/img/projects/${data.icon}.svg" alt="" />
          </div>
        </div>
        <p class="alg-communityhit__type text-demi text-sm m-t-none m-b-none padder">${data.category}</p>
        <h3 class="alg-communityhit__name text-lg padder m-t-none m-b-small">${data.name}</h3>
        <p class="alg-communityhit__description text-sm m-t-none padder m-b">${data.description}</p>
        <div class="alg-communityhit__stats">
          ${data.url_github ? `
           <div class="alg-communitystat alg-communitystat--github">   
             <a href="${data.url_github}">   
               <svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-github"></use>
               </svg>    
             </a>    
           </div>`: ""}
           ${data.url_forum ? `
           <div class="alg-communitystat alg-communitystat--discourse">   
             <a href="${data.url_forum}">   
               <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-comments"></use></svg>    
               24    
             </a>    
           </div>`: ""}
           ${data.url_home ? `    
           <div class="alg-communitystat alg-communitystat--home">   
             <a href="${data.url_home}">   
               <svg width="21" height="11" viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg">
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
      <h3 class="alg-communityprojects__hitstype text-xl">
      ${category}
      ${displayShowMore ? `<a class="alg-viewmore text-sm" href="">SEE ${viewMore} MORE<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M7.046 8.347l3.643-3.25L12 6.64 5.99 12 0 6.64l1.313-1.542L5 8.518V0h2.046v8.347z" fill="currentColor" fill-rule="evenodd"></path></svg></a>` : ""}</h3>
      <p class="alg-communityprojects__hitsdesc">${ 'Latest projects or big updates, you should definitely check that projects.' }</p> 
  </header>
  <div class="ais-hits"></div>`;
}

