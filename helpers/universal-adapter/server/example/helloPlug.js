const parseUri = require('@brillout/parse-uri');
const computeHash = require('./computeHash');

module.exports = helloPlug;

async function helloPlug(requestContext) {
  const {url, method} = requestContext;
  const {pathname} = parseUri(url);

  if( method!=='GET' ) {
    return null;
  }
  if( pathname==='/' ) {
    return {
      body: [
        "<html>",
        "<a href='/hello/alice'>/hello/alice</a>",
        "<br/>",
        "<a href='/hello/jon'>/hello/jon</a>",
        "</html>",
      ].join('\n')
    }
  }
  if( !pathname.startsWith('/hello/') ) {
    return null;
  }
  const body = 'hello '+pathname.slice('/hello/'.length);
  return {
    body,
    headers: [
      {name: 'ETag', value: '"'+computeHash(body)+'"'},
    ],
  };
}
