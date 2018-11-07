const WildcardApi = require('./WildcardApi');
module.exports = global.__globalWildcardApi = new WildcardApi();
module.exports.WildcardApi = module.exports.WildcardApi || WildcardApi;
