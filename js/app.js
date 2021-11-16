/**
* 
* Manipulating the DOM exercise.
* Exercise programmatically builds navigation,
* scrolls to anchors from navigation,
* and highlights section in viewport upon scrolling.
* 
* Dependencies: None
* 
* JS Version: ES2015/ES6
* 
* JS Standard: ESlint
* 
*/

/**
* Comments should be present at the beginning of each procedure and class.
* Great to have comments before crucial code sections within the procedure.
*/

/**
* Define Global Variables
* 
*/
const TIMEOUT = 9000;
const PAGE_FOLD = 160;

const header = document.querySelector('.page__header');
const navbar = document.querySelector('.navbar__list');
const toTopBtn = document.querySelector('.to-top-btn');
const sections = document.body.querySelectorAll('section');

let timeoutId = setTimeout(() => hideElement(header), TIMEOUT);

/**
* End Global Variables
* 
* Start Helper Functions
*/

/**
* Helper function to identify which section is in viewport.
* A section is considered in viewport if more than 50% of its height shows up in the viewport
*/

const sectionInViewport = sections => {
  let sectionInViewportId;

  for (const section of sections) {
    const sectionMiddleLineY = section.getBoundingClientRect().height / 2;
    const sectionTop = section.getBoundingClientRect().top;
    const sectionBreakingLine = sectionTop + sectionMiddleLineY;
    // Check whether the section middle line shows up in the viewport
    if (sectionBreakingLine > 0 && sectionBreakingLine <= window.innerHeight) {
      sectionInViewportId = section.id;
    } 
  }
  return sectionInViewportId;
};

// Helper function to hide an element
function hideElement (element) {
  element.classList.add('hidden');
}

// Helper function to show an element
function showElement (element) {
  element.classList.remove('hidden');
}

/**
* End Helper Functions
* 
* Begin Main Functions
*/

// build the nav
function buildNav () {
  const fragment = document.createDocumentFragment();
  
  for (const section of sections) {
    const navItem = document.createElement('li');
    const content = `<a class="menu__link" href="#${section.id}">${section.dataset.nav}</a>`;
 
    navItem.innerHTML = content;
    fragment.appendChild(navItem);
  }
  navbar.append(fragment);
}

// Add class 'active' to section when near top of viewport
function setSectionActive (activeSectionId) {
  for (const section of sections) {
    if (section.id === activeSectionId) {
      section.classList.add('active');
    } else {
      section.classList.remove('active');
    }
  }
}

// Add class 'active' to a nav item according to the related active section
function setNavItemActive (activeSectionId) {
  const menuLinks = document.querySelectorAll('.menu__link');
  const activeSection = document.getElementById(activeSectionId);
  for (const menuLink of menuLinks) {
    if (activeSectionId !== undefined && menuLink.textContent === activeSection.dataset.nav) {
      menuLink.classList.add('active');
    } else {
      menuLink.classList.remove('active');
    }
  }
}

// Scroll to a section
function scrollToSection (section) {
  section.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
}

/**
* End Main Functions
* 
* Begin Events
*/

// Build menu 
document.addEventListener('DOMContentLoaded', () => buildNav());

// Scroll to section on link click
navbar.addEventListener('click', ev => {
  if (ev.target.nodeName === 'A') {
    ev.preventDefault();
    const linkText = ev.target.textContent;
    for (const section of sections) {
      if (section.dataset.nav === linkText) {
        scrollToSection(section);
      }
    }
  }
});

// Set sections and nav items as active
// Show navigation and set timeout to hide it when not scrolling
window.addEventListener('scroll', () => {
  setSectionActive(sectionInViewport(sections));
  setNavItemActive(sectionInViewport(sections));
  showElement(header);
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => hideElement(header), TIMEOUT);
  // Check whether the page has been scrolled under the fold of the page
  if (document.body.scrollTop > PAGE_FOLD) {
    showElement(toTopBtn);
  } else {
    hideElement(toTopBtn);
  }
});

// Scroll to top on click
toTopBtn.addEventListener('click', ev => {
  ev.preventDefault();
  document.body.scrollTo({top: 0, left: 0, behavior: 'smooth'});
});