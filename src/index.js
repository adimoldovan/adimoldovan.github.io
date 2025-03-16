import './style.css';
import data from './profile.json';

const { hash } = data;
const content = document.getElementById('content');

/**
 * Creates a navigation hint element with an arrow and title
 * @param {string} type - The type of hint ('prev' or 'next')
 * @param {string} title - The text to display in the hint
 * @param {boolean} [autoHide=true] - Whether the hint should auto-hide after a timeout
 * @returns {HTMLElement} The created navigation hint element
 */
function createNavHint(type, title, autoHide = true) {
  const hint = document.createElement('div');
  hint.className = `section-nav-hint ${type}`;

  if (autoHide) {
    hint.classList.add('auto-hide');
  }

  const textContainer = document.createElement('div');

  const arrowSvg = `
     <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="arrow-top" d="M7 8L12 13L17 8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="arrow-bottom" d="M7 13L12 18L17 13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  textContainer.innerHTML = type === 'prev' ? `${arrowSvg}<br/>${title}` : `${title}<br/>${arrowSvg}`;
  hint.appendChild(textContainer);

  return hint;
}

/**
 * Shows navigation hints for the active section and hides them after a timeout
 * Only affects hints with the 'auto-hide' class
 */
function showHintsWithTimeout() {
  const activeSection = document.querySelector('section.active');
  const hints = activeSection ? activeSection.querySelectorAll('.section-nav-hint.auto-hide') : [];
  console.log(`Showing ${hints.length} hints for section ${activeSection?.id}`);

  hints.forEach((hint) => {
    hint.classList.remove('hidden');

    setTimeout(() => {
      hint.classList.add('hidden');
    }, 5000);
  });
}

/**
 * Activates a section by ID and deactivates all others
 * @param {string} sectionId - The ID of the section to activate
 */
function activateSection(sectionId) {
  console.log('Activating section:', sectionId);
  const sections = Array.from(document.querySelectorAll('section'));
  const targetSection = document.getElementById(sectionId);
  sections.forEach((section) => section.classList.remove('active'));
  targetSection.classList.add('active');
  showHintsWithTimeout();
}

/**
 * Smoothly scrolls to a section and activates it
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
  console.log('Scrolling to section:', sectionId);
  const targetSection = document.getElementById(sectionId);
  targetSection.scrollIntoView({ behavior: 'smooth' });
  activateSection(sectionId);
}

/**
 * Converts a section title to a valid ID
 * @param {string|string[]} title - The section title or array of title parts
 * @returns {string} The generated section ID
 */
function getSectionIdFromTitle(title) {
  if (Array.isArray(title)) {
    return title.join('-').toLowerCase().replace(/ /g, '-');
  }
  return title.toLowerCase().replace(/ /g, '-');
}

/**
 * Scrolls to the next section if available
 */
function scrollToNext() {
  const currentSection = document.querySelector('.active');
  const nextSection = currentSection?.nextElementSibling;
  console.log('Scrolling to next section:', { current: currentSection?.id, next: nextSection?.id });
  if (nextSection) {
    scrollToSection(nextSection.id);
  }
}

/**
 * Scrolls to the previous section if available
 */
function scrollToPrevious() {
  const currentSection = document.querySelector('.active');
  const prevSection = currentSection?.previousElementSibling;
  console.log('Scrolling to previous section:', { current: currentSection?.id, previous: prevSection?.id });
  if (prevSection) {
    scrollToSection(prevSection.id);
  }
}

/**
 * Creates and appends the profile section to the page
 * @param {string} firstSectionId - The ID of the first content section
 */
function createProfileSection(firstSectionId) {
  const profileSection = document.createElement('section');
  profileSection.id = 'profile';
  profileSection.innerHTML = `<img class="profile-picture" src="https://www.gravatar.com/avatar/${hash}?s=200" alt="profile picture" />`;

  profileSection.appendChild(document.createElement('h1')).textContent = data.displayName;
  profileSection.appendChild(document.createElement('p')).textContent = data.description;

  // Import icons
  const r = require.context('./assets/social', false, /\.(png|jpe?g|svg)$/);
  const icons = {};
  r.keys().map((item) => {
    icons[item.replace('./', '')] = r(item);
    return item;
  });

  const socialLinks = document.createElement('div');
  socialLinks.className = 'social-links';

  data.accounts.forEach((account) => {
    const link = document.createElement('a');
    link.href = account.url;
    link.target = '_blank';

    const img = document.createElement('img');
    img.src = icons[account.icon];
    img.alt = account.name;
    link.appendChild(img);
    socialLinks.appendChild(link);
  });

  profileSection.appendChild(socialLinks);

  const scrollIndicator = createNavHint('next', '', false);
  scrollIndicator.addEventListener('click', () => {
    scrollToSection(getSectionIdFromTitle(firstSectionId));
  });

  profileSection.appendChild(scrollIndicator);
  content.appendChild(profileSection);
}

/**
 * Creates and initializes all content sections with navigation and intersection observers
 */
function createSections() {
  console.log('Initializing sections from data:', data.sections.length, 'sections found');
  createProfileSection(getSectionIdFromTitle(data.sections[0].title));

  // Create Intersection Observer
  const observerOptions = {
    root: null, // use viewport
    threshold: 0.4, // trigger when 40% of the section is visible
    rootMargin: '0px',
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log('Section intersecting:', entry.target.id, 'Intersection ratio:', entry.intersectionRatio);
        scrollToSection(entry.target.id);
      }
    });
  }, observerOptions);

  // Observe profile section
  const profileSection = document.getElementById('profile');
  sectionObserver.observe(profileSection);

  data.sections.forEach((section, i) => {
    console.log('Creating section:', section.title);
    const sectionElement = document.createElement('section');
    sectionElement.id = getSectionIdFromTitle(section.title);
    sectionElement.innerHTML = `<div class="section-title">${section.title.join('<br/>')}</div><div class="section-content">${section.content}</div>`;

    const prevTitle = i === 0 ? 'Profile' : data.sections[i - 1].title.join(' ');
    const prevHint = createNavHint('prev', prevTitle);
    prevHint.addEventListener('click', () => scrollToSection(getSectionIdFromTitle(prevTitle)));
    sectionElement.appendChild(prevHint);

    if (i < data.sections.length - 1) {
      const nextTitle = data.sections[i + 1].title.join(' ');
      const nextHint = createNavHint('next', nextTitle);
      nextHint.addEventListener('click', () => scrollToSection(getSectionIdFromTitle(nextTitle)));
      sectionElement.appendChild(nextHint);
    }

    content.appendChild(sectionElement);
    sectionObserver.observe(sectionElement);
  });

  activateSection('profile');
}

/**
 * Sets up keyboard navigation handlers for the page
 */
function handleKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      console.log('Navigation: Down key pressed');
      scrollToNext();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      console.log('Navigation: Up key pressed');
      scrollToPrevious();
    }
  });
}

// Initialize the application
console.log('Initializing application...');
createSections();
handleKeyboardNavigation();
document.addEventListener('mousemove', showHintsWithTimeout);
document.addEventListener('wheel', showHintsWithTimeout);
