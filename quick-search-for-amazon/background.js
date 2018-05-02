'use strict';

chrome.runtime.onMessage.addListener(({method, url}) => {
  if (method === 'open') {
    chrome.tabs.create({
      url
    });
  }
});
