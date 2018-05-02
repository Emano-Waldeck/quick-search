'use strict';

chrome.webRequest.onHeadersReceived.addListener(({responseHeaders, type}) => {
  if (type === 'sub_frame') {
    for (const [i, {name}] of responseHeaders.entries()) {
      if (name.toLowerCase() === 'x-frame-options') {
        responseHeaders.splice(i, 1);
        return {
          responseHeaders: responseHeaders
        };
      }
    }
  }
}, {
  urls: ['*://*.amazon.com/*']
}, ['blocking', 'responseHeaders']);

chrome.webRequest.onBeforeSendHeaders.addListener(({requestHeaders, type}) => {
  if (type === 'sub_frame') {
    requestHeaders.push({
      name: 'User-Agent',
      value: 'Mozilla/5.0 (Linux; Android 7.0; SM-G920F Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36'
    });
    return {
      requestHeaders: requestHeaders
    };
  }
}, {
  urls: ['*://*.amazon.com/*']
}, ['blocking', 'requestHeaders']);

var iframe = document.querySelector('iframe');
iframe.onload = () => {
  document.body.dataset.loading = false;
  document.body.dataset.hide = true;
};

chrome.tabs.query({
  active: true,
  currentWindow: true
}, ([{id}]) => {
  chrome.tabs.executeScript(id, {
    code: 'window.getSelection().toString()',
    allFrames: true,
    matchAboutBlank: true,
    runAt: 'document_start'
  }, (rs = []) => {
    if (chrome.runtime.lastError === undefined) {
      const query = rs.filter(a => a).shift();
      if (query) {
        document.querySelector('input[type=search]').value = query;
        document.body.dataset.loading = true;
        iframe.src = 'https://www.amazon.com/gp/aw/s/ref=is_s?k=' + encodeURIComponent(query);
      }
    }
  });
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const query = document.querySelector('input[type=search]').value;
  document.body.dataset.loading = true;
  iframe.src = 'https://www.amazon.com/gp/aw/s/ref=is_s?k=' + encodeURIComponent(query);
});

