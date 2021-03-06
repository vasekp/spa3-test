import './components/spa-scroll.js';
import {loadModule} from './main.js';
import * as i18n from './i18n.js';

export default function(root) {
  i18n.moduleList.then(items => {
    const cont = root.getElementById('list');
    items.sort((a, b) => i18n.compare(a.displayName, b.displayName));
    for(const item of items) {
      if(item.moduleName === 'list')
        continue;
      const div = document.createElement('div');
      div.textContent = item.displayName;
      div.dataset.moduleName = item.moduleName;
      div.setAttribute('tabindex', 0);
      div.classList.add('inner-outline');
      div.dataset.active = 1;
      cont.appendChild(div);
    }
    cont.addEventListener('click', e => loadModule(root.host.id, e.target.dataset.moduleName));
  });

  return {};
}
