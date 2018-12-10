// Such file shouldn't be public.
// But for the sake of this example we do make it public.

const GITHUB_CLIENT_ID = '3c81714764dde8e268e1';
const GITHUB_CLIENT_SECRET = (
  '00b3e6dde42cadb2ffc88a'+
  // At least we make it less accessible to crawlers
  975197.4979704999/Math.PI.toPrecision(8)+
  'ab9840fc2339'
);

// We don't deploy this example, so it's fine to have this secret public
const COOKIE_SECRET = '6978801547562701';

module.exports = {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  COOKIE_SECRET,
};
