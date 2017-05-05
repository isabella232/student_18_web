const exec = require('child_process').execSync;
const fs = require('fs');
const parser = require('argv-parser');
const Inliner = require('inliner');

const GET_UPDATE_DATA_PREFIX = 'BlockData:';

// Get the url and the config genesis id
const params = parser.parse(process.argv, {rules: {
  block: {
    type: String,
    short: 'b'
  },
  file: {
    type: String,
    short: 'f'
  }
}}).parsed;

const baseURL = params.argv.remain[0];

if (!baseURL) {
  console.error("Missing URL argument");
  process.exit(-1);
}

if (!(params.block || params.file)) {
  console.error("Missing file or block id argument");
  process.exit(-1);
}

let config = {};
const pages = {};

/**
 * Fetch the page to the given url and search for more url of the same domain and recursively fill the
 * pages object
 * @param url {string} URL to fetch
 * @returns {Promise}
 */
function getPages(url) {
  console.log('Fetching ' + url);

  pages[url] = null;

  return new Promise((resolve, reject) => {
    new Inliner(url, {encoding: 'utf8'}, (error, html) => {
      if (error) {
        reject();
        return;
      }

      pages[url] = html;
      const regex = new RegExp(`<a href="(${baseURL}[^"]*)"`, 'g');
      const promises = [];

      let match;
      do {
        match = regex.exec(html);
        if (match && !pages.hasOwnProperty(match[1])) {
          promises.push(getPages(match[1]));
        }

      } while (match !== null);

      Promise.all(promises).then(resolve, reject);
    });
  });
}

/**
 * Check the config and create the skip-chain for pages that are not already in the config
 */
function populateConfig() {
  let mustBeUpdated = false;

  for (let url in pages) {
    if (!config.hasOwnProperty(url)) {
      console.log('Create skipchain for url ' + url);

      config[url] = createSkipChain(url);
      mustBeUpdated = true;
    }
  }

  // Update the data of the config skip-chain
  if (mustBeUpdated) {
    fs.writeFileSync('.tmp', JSON.stringify(config));
    const out = exec(`scmgr addWeb ${params.block} .tmp`).toString('utf8');

    console.log(extractLastLine(out));
  }
}

/**
 * Create a skip-chain for the given url and return its id
 * @param url
 * @returns {*}
 */
function createSkipChain(url) {
  const out = exec(`scmgr create --html ${url} ${params.file}`).toString('utf8');

  const matches = out.match(/[0-9a-f]{64}/);
  if (matches) {
    return matches[0];
  }

  throw new Error("Error when trying to create a page skip-chain");
}

/**
 * Using the config, replace the domain urls with the skip-chain url
 */
function updateURL() {
  for (let url in pages) {
    const regex = new RegExp(`<a href="(${baseURL}[^"]*)"`, 'g');

    const html = pages[url].replace(regex, (match, p1) => {
      return `<a href="javascript:void 0" onclick="window.parent.postMessage('skipchain://${config[p1]}', '*')"`;
    });

    updatePageSkipChain(html, url);
  }
}

/**
 * Update the data of the skip-chain
 * @param html {String} content to be updated
 * @param url {String} key to find the skip-chain id
 */
function updatePageSkipChain(html, url) {
  fs.writeFileSync('.tmp', html, 'utf8');

  const out = exec(`scmgr addWeb ${config[url]} .tmp`).toString('utf8');
  console.log(extractLastLine(out));
}

/**
 * Return the last line with content of the input text
 * @param out
 * @returns {*}
 */
function extractLastLine(out) {
  const lines = out.split('\n').filter(line => line.length !== 0);

  if (lines.length > 0) {
    return lines[lines.length - 1];
  }

  return '';
}


console.log('------------- Get or create the config file');

if (params.block) {
  const out = exec('scmgr update ' + params.block).toString('utf8');
  const lines = out.split("\n").filter(l => l.length > 0);

  let data = '';
  if (lines[lines.length - 1].startsWith(GET_UPDATE_DATA_PREFIX)) {
    data = lines[lines.length - 1].replace(GET_UPDATE_DATA_PREFIX, '');
    data = Buffer.from(data, 'base64').toString('utf8');
    data = data.substr(data.indexOf('{'));

    try {
      console.log(data);
      config = JSON.parse(data);
    }
    catch (e) {
      // console.log(e);
      console.error('Cannot parse the config from the skipchain. Are your sure you enter the good skipchain?');
      process.exit(-1);
    }
  }
}
else {
  console.log("Create the skipchain of the config");
  const re = /https?:\/\//;
  let out = '';
  try {
    out = exec(`scmgr create --html config://${baseURL.replace(re, '')} ${params.file}`).toString('utf8');
  }
  catch (e) {
    console.log(e.stdout.toString('utf8'));
  }

  const matches = out.match(/[0-9a-f]{64}/);
  if (matches) {
    params.block = matches[0];
    console.log(extractLastLine(out));
  }
  else {
    throw new Error("Cannot create the skip-chain for the config");
  }
}

console.log('------------- Fetch Pages');

getPages(baseURL)
  .then(() => {
    console.log('------------- Populate the config file');
    populateConfig();

    console.log('------------- Replace URLs in html file and update skip-chain');
    updateURL();

    console.log('------------- Ended correctly');
  })
  .catch((e) => console.log('something went wrong when fetching the pages', e.message))
  .then(() => fs.unlinkSync('.tmp'));
