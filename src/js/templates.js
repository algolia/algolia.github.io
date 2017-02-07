exports.hitTemplate = (hit) => `
  <article class="alg-communityhit">
    <div class="alg-communityhit__details">
      <div class="alg-communityhit__icon">
        <svg xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="#icon-${hit.icon}"></use>
        </svg>
      </div>
      <p class="alg-communityhit__type">${hit.type}</p>
      <h3 class="alg-communityhit__name">${hit.name}</h3>
      <p class="alg-communityhit__description">${hit.description}</p>
    </div>
    <div class="alg-communityhit__stats">
      <div class="alg-communitystat">
        <a>
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M0 9.835c0 4.345 2.765 8.03 6.6 9.33.484.09.66-.212.66-.473 0-.234-.008-.852-.013-1.672-2.685.594-3.25-1.32-3.25-1.32-.44-1.135-1.073-1.438-1.073-1.438-.877-.61.066-.597.066-.597.97.07 1.48 1.013 1.48 1.013.86 1.503 2.258 1.07 2.808.817.088-.635.337-1.068.613-1.314-2.143-.247-4.396-1.09-4.396-4.86 0-1.073.376-1.952.993-2.64-.1-.247-.43-1.248.095-2.6 0 0 .81-.266 2.654 1.007.77-.22 1.596-.327 2.417-.33.82.003 1.645.11 2.416.33 1.842-1.273 2.65-1.008 2.65-1.008.528 1.352.197 2.353.098 2.6.618.688.992 1.567.992 2.64 0 3.778-2.258 4.61-4.407 4.853.346.304.654.904.654 1.82 0 1.316-.01 2.377-.01 2.7 0 .262.173.568.662.472 3.832-1.303 6.595-4.987 6.595-9.33C19.305 4.403 14.983 0 9.652 0 4.322 0 0 4.403 0 9.835z" fill="currentColor" fill-rule="evenodd"/></svg>
        </a>
      </div>

      <div class="alg-communitystat">
        <a>
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M10.536 12.725c-.434.052-.88.08-1.333.08-4.582 0-8.296-2.753-8.296-6.15C.907 3.262 4.62.51 9.203.51c4.582 0 8.297 2.75 8.297 6.146 0 2.154-1.494 4.05-3.757 5.147l1.074 5.358-4.28-4.435z" fill="currentColor" fill-rule="evenodd"/></svg>
          ${hit.comments}
        </a>
      </div>

      <div class="alg-communitystat">
        <a>
          <svg width="21" height="11" viewBox="0 0 21 11" xmlns="http://www.w3.org/2000/svg"><path d="M6.977 8.396H4.823c-1.358 0-2.482-1.12-2.482-2.528v-.954c0-1.384 1.1-2.53 2.483-2.53h3.863c1.357 0 2.48 1.122 2.48 2.53v1.073c0 .668.516 1.193 1.172 1.193.655 0 1.17-.525 1.17-1.193V4.914C13.508 2.218 11.355 0 8.686 0H4.823C2.177 0 0 2.194 0 4.914v.954c0 2.695 2.154 4.913 4.823 4.913h2.154c.655 0 1.17-.523 1.17-1.19 0-.67-.515-1.194-1.17-1.194zM16.177 0h-1.873c-.655 0-1.17.525-1.17 1.193 0 .667.515 1.192 1.17 1.192h1.873c1.358 0 2.482 1.12 2.482 2.53v.953c0 1.383-1.1 2.528-2.483 2.528h-3.63c-1.356 0-2.48-1.12-2.48-2.528v-.835c0-.668-.515-1.193-1.17-1.193-.656 0-1.17.525-1.17 1.193v.835c0 2.695 2.153 4.913 4.82 4.913h3.63C18.823 10.78 21 8.588 21 5.87v-.954C21 2.218 18.823 0 16.177 0z" fill="currentColor" fill-rule="evenodd"/></svg>
        </a>
      </div>
    </div>
  </article>
`;

exports.menuTemplate = (menuItem) => `
  <span class="alg-facet__tile" data-type="${menuItem.name}"></span>
  <span class="alg-facet__name">${menuItem.name}</span>
  <span class="alg-facet__number">${menuItem.count}</span>
`;