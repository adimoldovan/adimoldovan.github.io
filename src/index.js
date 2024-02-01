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

  // Import icons
  const r = require.context('./assets/social', false, /\.(png|jpe?g|svg)$/);
  const icons = {};
  // eslint-disable-next-line array-callback-return
  r.keys().map((item) => { icons[item.replace('./', '')] = r(item); });

  // eslint-disable-next-line no-restricted-syntax
  for (const account of data.accounts) {
    const link = document.createElement('a');
    link.href = account.url;
    link.target = '_blank';

    const img = document.createElement('img');
    img.src = icons[account.icon];
    img.alt = account.name;
    link.appendChild(img);
    profile.appendChild(link);
  }

  profile.appendChild(document.createElement('p')).innerHTML = `<img src="https://www.gravatar.com/${hash}.qr?s=20" alt="qr code" />`;
  content.appendChild(profile);
  return content;
}

document.body.appendChild(contentComponent());
