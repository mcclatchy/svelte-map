import './modules/bling';
import App from './components/App.svelte';
import { removeNodes, removeCardsBelowStory } from 'https://www.miamiherald.com/static/hi/themes/enhancements.js';

// Remove crufts from story page in a WPS-preferred way
const deadpool = [
    '.story-body header.header',
    '.trinity-player-iframe-wrapper',
    '.commenting-container',
    '#zone-el-101',
    '.gallery.slider',
    '.upper-nav',
    'section#flag',
    '.responsive-image',
    'footer',
    '#zone-el-14',
    'section.bottom-nav'
];

if (pageInfo['marketInfo.allow_ads'] === 'false') {
    deadpool.push(
      '#zone-el-2',
      '#zone-el-102',
      '#zone-el-104',
      '.zone.grid.combo'
    );
}

removeNodes(deadpool);
removeCardsBelowStory();

const embed = $1('#embedRoot');
embed.parentElement.classList.add('full-bleed')

const app = new App({
    target: embed
})

export default app;