'use strict';

if (window.top !== window) {
  document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && a.href && a.dataset.asin) {
      e.preventDefault();
      chrome.runtime.sendMessage({
        method: 'open',
        url: a.href
      });
    }
  });
}
