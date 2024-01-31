import './style.css';
import data from './profile.json';

const { hash } = data;

function contentComponent() {
  const content = document.createElement('div');
  content.id = 'content';

  const profile = document.createElement('div');

  profile.innerHTML = `<img class="profile-picture" src="https://www.gravatar.com/avatar/${hash}?s=200" alt="profile picture" />`;

  profile.appendChild(document.createElement('h1')).textContent = data.displayName;
  profile.appendChild(document.createElement('p')).textContent = data.description;

  // eslint-disable-next-line no-restricted-syntax
  for (const account of data.accounts) {
    const link = document.createElement('a');
    link.href = account.url;
    link.target = '_blank';
    link.innerHTML = `<img src="${account.iconUrl}" alt="${account.name}"/>`;
    profile.appendChild(link);
  }

  profile.appendChild(document.createElement('p')).innerHTML = `<img src="https://www.gravatar.com/${hash}.qr?s=20" alt="qr code" />`;
  content.appendChild(profile);
  return content;
}

document.body.appendChild(contentComponent());
