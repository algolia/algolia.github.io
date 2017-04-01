function header() {
  const navRoot = document.querySelector('.cm-dropdownroot');
  const navItems = document.querySelectorAll('a[data-enabledropdown="true"]');

  const navBg = document.querySelector('.cm-dropdownroot__dropdownbg');
  const navArrow = document.querySelector('.cm-dropdownroot__dropdownarrow');

  const dropDownContainer = document.querySelector('.cm-dropdownroot__dropdowncontainer');
  const ARROW_WIDTH = 10;

  const refs = {
    developers: {
      id: 0,
      nodes: document.querySelectorAll('[data-dropdown="developers"]')
    },
    support: {
      id: 1,
      nodes: document.querySelectorAll('[data-dropdown="support"')
    }
  }

  const state = {
    isOpen: false
  }

  const triggerMenu = (event) => {
    const nextTarget = refs[event.target.getAttribute('data-dropdown')];
    const nodes = document.querySelectorAll('.cm-dropdownroot__section');

    const nextTargetContainer = nextTarget.nodes[1];
    const nextTargetContent = nextTarget.nodes[2];
    const currentActive = document.querySelector('.cm-dropdownroot__section.active');
    const nextTargetContentCoordinates = _utils.getCoordinates(nextTargetContent);
    const currentCoordinates = _utils.getCoordinates(dropDownContainer);
    const coordinates = _utils.getCoordinates(event.target);
    const dropDownCenter = coordinates.center - nextTargetContentCoordinates.rw / 2
    const navBgCoordinates = _utils.getCoordinates(navBg);
    const scalex = nextTargetContentCoordinates.rh / HEIGHT;

    const WIDTH = 490;
    const HEIGHT = 360;

    const scale = {
      x: (nextTargetContentCoordinates.rw / WIDTH),
      y: (nextTargetContentCoordinates.rh / HEIGHT),
      halfdistance: nextTargetContentCoordinates.rw / 2
    }

    var bgCenter = coordinates.center - scale.halfdistance > 15 ? coordinates.center - scale.halfdistance : -25;
    var ddCenter = dropDownCenter > 15 ? dropDownCenter : -25;

    navBg.style.cssText = `transform:translateX(${ bgCenter }px)
    scaleX(${scale.x}) scaleY(${ scale.y })`;
    navArrow.style.cssText = `transform:translateX(${ coordinates.center - ARROW_WIDTH }px) rotate(45deg)`;

    dropDownContainer.style.cssText = `transform:translateX(${ ddCenter }px);
    width:${nextTargetContentCoordinates.rw}px;
    height:${nextTargetContentCoordinates.rh + 10}px`;

    setTimeout(() => {
      if(currentActive){
        currentActive.classList.remove('active');
      }
      nextTargetContainer.classList.add('active');
      navRoot.className = "cm-dropdownroot activeDropdown";
    }, 10);
  }

  const closeMenu = (event) => {
    if(event.relatedTarget && event.relatedTarget.className === 'cm-dropdownroot__dropdowncontainer'){
      return;
    }
    const currentActive = document.querySelector('.cm-dropdownroot__section.active');
    currentActive.classList.remove('active');
    navRoot.className = "cm-dropdownroot notransition";
    state.isOpen = false;
  }

  const _utils = {};

  _utils.setClassNames = (id) => {
    const nodeCount = Object.keys(refs);
    nodeCount.forEach((ref, index) => {
      const node = refs[ref].nodes[1];
      if (index < id) {
        node.className = 'cm-dropdownroot__section left';
      } else if (index === id) {
        node.className = 'cm-dropdownroot__section active';
      } else {
        node.className = 'cm-dropdownroot__section right';
      }
    });
  }

  _utils.getCoordinates = (target) => {
    const box = target.getBoundingClientRect();
    const realWidth = target.offsetWidth;
    const realHeight = target.offsetHeight;

    return {
      x: box.left,
      y: box.top,
      w: box.width,
      h: box.height,
      rh: realHeight,
      rw: realWidth,
      center: box.left + box.width / 2
    }
  }

  navItems.forEach(item => {
    item.addEventListener('mouseenter', triggerMenu);
    item.addEventListener('click', triggerMenu);
  });

  navItems.forEach(item => {
    item.addEventListener('mouseleave', closeMenu);
  });

  document.querySelectorAll('.cm-dropdownroot__content').forEach(node => {
    node.addEventListener('mouseleave',closeMenu);
  });
}