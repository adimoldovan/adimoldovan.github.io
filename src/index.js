import './style.css';
import data from './profile.json';

const { hash } = data;

const content = document.getElementById('content');

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

function showHintsWithTimeout() {
  const activeSection = document.querySelector('section.active');
  const hints = activeSection ? activeSection.querySelectorAll('.section-nav-hint') : [];

  hints.forEach((hint) => {
    if (!hint.classList.contains('auto-hide')) {
      return;
    }

    hint.classList.remove('hidden');

    setTimeout(() => {
      hint.classList.add('hidden');
    }, 5000);
  });
}

function activateSection(sectionId) {
  const sections = Array.from(document.querySelectorAll('section'));
  const targetSection = document.getElementById(sectionId);
  sections.forEach((section) => section.classList.remove('active'));
  targetSection.classList.add('active');
  showHintsWithTimeout();
}

function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  targetSection.scrollIntoView({ behavior: 'smooth' });
  activateSection(sectionId);
}

function getSectionIdFromTitle(title) {
  if (Array.isArray(title)) {
    return title.join('-').toLowerCase().replace(/ /g, '-');
  }

  return title.toLowerCase().replace(/ /g, '-');
}

function scrollToNext() {
  const currentSection = document.querySelector('.active');
  const nextSection = currentSection?.nextElementSibling;
  if (nextSection) {
    scrollToSection(nextSection.id);
  }
}

function scrollToPrevious() {
  const currentSection = document.querySelector('.active');
  const prevSection = currentSection?.previousElementSibling;
  if (prevSection) {
    scrollToSection(prevSection.id);
  }
}

function createProfileSectionContent(firstSectionId) {
  const profileSection = document.createElement('section');
  profileSection.id = 'profile';
  profileSection.innerHTML = `<img class="profile-picture" src="https://www.gravatar.com/avatar/${hash}?s=200" alt="profile picture" />`;

  profileSection.appendChild(document.createElement('h1')).textContent = data.displayName;
  profileSection.appendChild(document.createElement('p')).textContent = data.description;

  // Import icons
  const r = require.context('./assets/social', false, /\.(png|jpe?g|svg)$/);
  const icons = {};
  // eslint-disable-next-line array-callback-return
  r.keys().map((item) => { icons[item.replace('./', '')] = r(item); });

  const socialLinks = document.createElement('div');
  socialLinks.className = 'social-links';

  // eslint-disable-next-line no-restricted-syntax
  for (const account of data.accounts) {
    const link = document.createElement('a');
    link.href = account.url;
    link.target = '_blank';

    const img = document.createElement('img');
    img.src = icons[account.icon];
    img.alt = account.name;
    link.appendChild(img);
    socialLinks.appendChild(link);
  }

  profileSection.appendChild(socialLinks);

  const scrollIndicator = createNavHint('next', '');
  scrollIndicator.addEventListener('click', () => {
    scrollToSection(getSectionIdFromTitle(firstSectionId));
  });

  profileSection.appendChild(scrollIndicator);
  content.appendChild(profileSection);
}

function createSections() {
  createProfileSectionContent(getSectionIdFromTitle(data.sections[0].title));

  // Create Intersection Observer
  const observerOptions = {
    root: null, // use viewport
    threshold: 0.4, // trigger when 50% of the section is visible
    rootMargin: '0px',
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollToSection(entry.target.id);
      }
    });
  }, observerOptions);

  // Observe profile section
  const profileSection = document.getElementById('profile');
  sectionObserver.observe(profileSection);

  data.sections.forEach((section, i) => {
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

function handleKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      console.log('down key pressed');
      scrollToNext();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      console.log('up key pressed');
      scrollToPrevious();
    }
  });
}

createSections();
handleKeyboardNavigation();
document.addEventListener('mousemove', showHintsWithTimeout);
document.addEventListener('wheel', showHintsWithTimeout);
