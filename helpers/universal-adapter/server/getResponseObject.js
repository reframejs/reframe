const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');

module.exports = getResponseObject;

function getResponseObject(responseSpec, {extractEtagHeader=false}={}) {
  if( responseSpec === null ) {
    return null;
  }

  Object.keys(responseSpec)
  .forEach(respArg => {
    const argList = ['body', 'headers', 'redirect', 'statusCode'];
    assert_usage(
      argList.includes(respArg),
      responseSpec,
      "Unknown argument `"+respArg+"` in response object printed above.",
      "The list of arguments is:",
      argList
    );
  });

  const responseObject = {};

  {
    const {body} = responseSpec;
    assert_warning(
      body && [String, Buffer].includes(body.constructor),
      body,
      body.constructor,
      "response `body` is not a String nor a Buffer"
    );
    responseObject.body = body;
  }

  {
    const {headers=[]} = responseSpec;
    assert_usage(headers && headers.forEach, headers);
    headers.forEach(headerSpec => {
      assert_usage(headerSpec && headerSpec.name && headerSpec.value, headers, headerSpec);
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
          assert_warning(
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
    assert_warning(
      redirect===undefined || redirect && redirect.constructor===String,
      "response `redirect` is not a String",
      redirect,
    );
    responseObject.redirect = redirect;
  }

  {
    const {statusCode} = responseSpec;
    responseObject.statusCode = statusCode;
  }

  return responseObject;
}

