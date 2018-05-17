const semver = require('semver');
const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

// async/await support
//  - Node v7.6
//    - https://www.infoq.com/news/2017/02/node-76-async-await

// Object spread operator
//  - Node v8.3
//    - https://stackoverflow.com/questions/40066731/node-v6-failing-on-object-spread

// `paths` options of `require.resolve`
// - Node v8.9.0
//   - https://nodejs.org/api/modules.html#modules_require_resolve_paths_request

// `paths` options of `require.resolve` bugfix
// - Node v8.10.0
//   - https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V8.md#8.10.0
//   - https://github.com/nodejs/node/pull/17113
// - Node v9.8.0

const minVersion = '9.8.0';
const minVersionLts = '8.10.0';
const versionLts = '8.x.x';

module.exports = checkNodejsVersion;

function checkNodejsVersion() {
    const nodeJsVersion = process.version;

    assert_validFunction();

    assert_usage(
        isValidVersion(nodeJsVersion),
        "You are using Node "+nodeJsVersion,
        "But Reframe requires a more recent Node version",
        "Supported versions:",
        "  - Node v"+minVersion+" or above",
        "  - Node v8 LTS above v"+minVersionLts
    );
}

function isValidVersion(version) {
    return (
        semver.gte(version, minVersion) ||
        semver.gte(version, minVersionLts) && semver.satisfies(version, versionLts)
    );
}

function assert_validFunction(){
    assert_internal(isValidVersion('v8.10.0'));
    assert_internal(isValidVersion('v8.11.0'));
    assert_internal(isValidVersion('v9.8.0'));
    assert_internal(isValidVersion('v9.9.0'));
    assert_internal(isValidVersion('v10.0.0'));
    assert_internal(isValidVersion('v11.0.0'));

    assert_internal(!isValidVersion('v7.0.0'));
    assert_internal(!isValidVersion('v8.9.0'));
    assert_internal(!isValidVersion('v9.7.0'));
}
