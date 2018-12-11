const User = require('../../db/models/User');

module.exports = {getUser};

function getUser(context) {
  if( ! context.user ) {
    return null;
  }
  const {userProviderId, oauthProvider} = context.user;
  return User.query().findOne({oauthProvider, userProviderId});
}
