const assert = require('reassert');

module.exports = getResponseObject;

function getResponseObject(responseSpec, {extractEtagHeader=false}={}) {
  if( responseSpec === null ) {
    return null;
  }

  Object.keys(responseSpec)
  .forEach(respArg => {
    const argList = ['body', 'headers', 'redirect', 'statusCode'];
    assert.usage(
      argList.includes(respArg),
      responseSpec,
      "Unknown argument `"+respArg+"` in response object printed above.",
      "The list of known arguments is:",
      argList
    );
  });

  const responseObject = {};

  {
    const {body} = responseSpec;
    assert.warning(
      !body || [String, Buffer].includes(body.constructor),
      body,
      body && body.constructor,
      "response `body` is not a String nor a Buffer"
    );
    responseObject.body = body;
  }

  {
    const {headers=[]} = responseSpec;
    assert.usage(headers && headers.forEach, headers);
    headers.forEach(headerSpec => {
      assert.usage(headerSpec && headerSpec.name && headerSpec.value, headers, headerSpec);
    });
    responseObject.headers = headers;
  }

  if( extractEtagHeader ) {
    let etag;
    responseObject.headers = (
      responseObject.headers
      .filter(({name, value}) => {
        const isEtagHeader = name.toLowerCase()==='etag';
     // const isEtagHeader = name==='ETag';
        if( isEtagHeader ) {
          assert.warning(
            value[0]==='"' && value.slice(-1)[0]==='"',
            "Malformatted etag",
            value
          );
          etag = value.slice(1, -1);
          return false;
        }
        return true;
      })
    );
    responseObject.etag = etag;
  }

  {
    const {redirect} = responseSpec;
    assert.warning(
      redirect===undefined || redirect && redirect.constructor===String,
      "response `redirect` is not a String",
      redirect,
    );
    responseObject.redirect = redirect;
  }

  assert.warning(
    !responseObject.body || !responseObject.redirect,
    "The response printed above has both a `body` and a `redirect` which doesn't make sense.",
    "The body will never be shown as the page will be redirected.",
  );

  {
    const {statusCode} = responseSpec;
    responseObject.statusCode = statusCode;
  }

  return responseObject;
}

