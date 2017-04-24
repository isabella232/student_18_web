const Inliner = require('inliner');

const url = "https://dedis.ch/post/overview/";
const baseURL = "https?:\/\/dedis\.ch\/?";
const mapping = {
  "https://dedis.ch": "6d51af979e9d5294bc6027560bf2374e435a9ee5768347a862f51ee3e7771e6e",
  "https://dedis.ch/post/cothority-v1/": "7e497b72e4172b022cf040ffdc2b430b155d46264ffce6441b66293c6b8185a4",
  "https://dedis.ch/post/cosi-binary-1605/": "91bda65a836dd39e4d03d2f4f2fe9231693890f8556ecbecd50f2b43f90e70f0",
  "https://dedis.ch/post/master_1604/": "3e8aeaa8c63a362d40faf2c911fd7866cf5f47e0bb9693c88857b22b81cd2089",
  "https://dedis.ch/post/cosi-binary/": "e5784372568dce7486a591391b1dcff8c452634423088ec012aabf7aa5f718e7",
  "https://dedis.ch/post/overview/": "1e4888e368e2df30d72020649be8875a4f34c42bbc68e71e7d06264ca460d33d"
};

new Inliner(url, {encoding: 'utf8'}, (error, html) => {
  if (error) {
    console.error(error);
  }

  const regex = new RegExp(`<a href="(${baseURL}[^"]*)"`, 'g');

  let match;
  do {
    match = regex.exec(html);
    if (match) {
      const url = match[1];

      if (url in mapping) {
        html = html.replace(match[0], `<a href="javascript:void 0" onclick="window.parent.postMessage('skipchain://${mapping[url]}', '*')"`);
      }
      else {
        console.error('missing mapping for ' + url);
        process.exit(-1);
      }
    }

  } while (match !== null);

  console.log(html);

});