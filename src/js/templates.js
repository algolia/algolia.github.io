exports.hitTemplate = (data) => `
 <article class="alg-communityhit">
      <div class="alg-communityhit__details">
        <div class="alg-communityhit__icon">
          <div id="icon-${data.name.replace('.js','').toLowerCase()}" class="alg-communityhit__iconcontainer alg-icon-${data.category.toLowerCase().split(" ").join("-")}">
            <img src="/img/projects/${data.icon}.svg" alt="" />
          </div>
          <svg class="icon-glass" width="84px" height="87px" viewBox="0 0 84 87" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-glass"></use>
          </svg>
        </div>
        <p class="alg-communityhit__type">${data.category}</p>
        <h3 class="alg-communityhit__name">${data.name}</h3>
        <p class="alg-communityhit__description">${data.description}</p>
        <div class="alg-communityhit__stats">   
           <div class="alg-communitystat">   
             <a>   
               <svg width="20" height="20" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
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

exports.menuTemplate = (menuItem) => `
  <a href="#">
    <span class="alg-facet__tile" data-type="${menuItem.name}"></span>
    <span class="alg-facet__name">${menuItem.name}</span>
    <span class="alg-facet__number">${menuItem.count}</span>
  </a>
`;