const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const escapeRegexp = require('lodash.escaperegexp');

const webpackUtils = {getRule, setRule, addBabelPreset, addBabelPlugin, modifyBabelConfig, getEntries};

module.exports = webpackUtils;

function getRule(config, filenameExtension, {canBeMissing=false}={}) {
    assert_filenameExtension(filenameExtension);

    const rules = getAllRules(config);

    const dummyFileName = 'dummy'+filenameExtension;

    const rulesFound = (
        rules
        .filter(rule => {
            if( ! rule.test ) {
                return false;
            }
            return runRuleTest(rule.test, dummyFileName);
        })
    );

    assert_usage(
        rulesFound.length>=0 || canBeMissing,
        rules,
        "Can't find any rule that matches the filename extension `"+filenameExtension+"`.",
        "E.g. no rule matches `"+dummyFileName+"`.",
        "The rules are printed above."
    );
    assert_usage(
        rulesFound.length<=1,
        "More than one rule matches the filename extension `"+filenameExtension+"`.",
        "E.g. more than one rule matches `"+dummyFileName+"`."
    );

    return rulesFound[0];
}

function setRule(config, filenameExtension, ruleNew) {
    assert_filenameExtension(filenameExtension);

    ruleNew = {...ruleNew};
    if( ! ruleNew.test ) {
        ruleNew.test = new RegExp(escapeRegexp(filenameExtension)+'$');
    }

    const dummyFileName = 'dummy'+filenameExtension;
    assert_usage(
        runRuleTest(ruleNew.test, dummyFileName),
        "The new rule to be set doesn't match the filename extension `"+filenameExtension+"`.",
        "The new rule's test is:",
        ruleNew.test,
        "But it doesn't match the file name `"+dummyFileName+"`."
    );
    const ruleOld = getRule(config, filenameExtension, {canBeMissing: true});
    const rules = getAllRules(config);
    if( ! ruleOld ) {
        rules.push(ruleNew);
        return;
    }
    const ruleIndex = rules.indexOf(ruleOld);
    assert_internal(ruleIndex>=0, rules, ruleOld);
    rules[ruleIndex] = ruleNew;
}

function assert_filenameExtension(filenameExtension) {
    assert_usage(
        (filenameExtension||{}).startsWith && filenameExtension.startsWith('.'),
        'The filename extension should be a string starting with `.` but we got: `'+filenameExtension+'`'
    );
}

function modifyBabelConfig(config, action) {
    const rules = getAllRules(config);

    rules.forEach(rule => {
        normlizeLoaders(rule);
    });

    const rulesFound = rules.filter(rule => rule.use.some(isBabelLoader));

    assert_usage(
        rulesFound.length>0,
        "No rule that uses babel-loader found."
    );

    rulesFound
    .forEach(rule => {
        let babelLoaderFound;
        rule.use.forEach(loader => {
            if( isBabelLoader(loader) ) {
                assert_usage(
                    !babelLoaderFound,
                    rule,
                    'More than one babel loader found but we expect only one.',
                    'Rule in question is printed above.'
                );
                babelLoaderFound = true;
                action(loader);
            }
        })
    })
}

function addBabelPreset(config, babelPreset) {
    modifyBabelConfig(
        config,
        loader => {
            assert_internal(isBabelLoader(loader));
            loader.options = loader.options || {};
            loader.options.presets = loader.options.presets || [];
            loader.options.presets.push(babelPreset);
        }
    );
}

function addBabelPlugin(config, babelPlugin) {
    modifyBabelConfig(
        config,
        loader => {
            assert_internal(isBabelLoader(loader));
            loader.options = loader.options || {};
            loader.options.plugins = loader.options.plugins || [];
            loader.options.plugins.push(babelPlugin);
        }
    );
}

function runRuleTest(ruleTest, filename) {
    const testNormalized = normalizeCondition(ruleTest);
    const isMatch = testNormalized(filename);
    return isMatch;
}

function isBabelLoader(loader) {
    assert_internal(loader.loader.constructor===String);
    return loader.loader.includes('babel-loader');
}

function normlizeLoaders(rule) {
    assert_usage(
        rule instanceof Object,
        rule,
        "Rule found that is not an object",
        "Make sure all your rules are objects",
        "The rule in question is printed above"
    )
    assert_usage(
        !rule.loader || !rule.use,
        rule,
        "Conflicting format `rule.loader` and `rule.use`.",
        "Choose either one but not both at the same time.",
        "Rule in question is printed above."
    );
    if( rule.loader) {
        rule.use = [{loader: rule.loader}];
        delete rule.loader;
        return;
    }
    if( ! rule.use ) {
        rule.use = [];
        return;
    }
    if (typeof rule.use === "string") {
        rule.use = [{loader: rule}]
        return;
    }
    assert_usage(
        Array.isArray(rule.use) || rule.use instanceof Object,
        "Unexpected rule format: `rule.use` should be an array or object.",
        "Rule in question:",
        rule
    );
    rule.use = (
        (Array.isArray(rule.use) ? rule.use : [rule.use])
        .filter(Boolean)
        .map(loader => {
            if( loader.constructor === String ) {
                return {loader};
            }
            if( loader.loader && loader.loader.constructor===String ) {
                return loader;
            }
            assert_usage(
                false,
                "Unexpected rule.use[i] format: `rule.use[i]` should either be a string or have a `rule.use[i].loader` string.",
                "Loader in question:",
                loader
            );
        })
    );
}

function getAllRules(config, {canBeMissing}={}) {
    assert_usage(
        config,
        'Config is missing'
    );
    config.module = config.module || {};
    if( ! config.module.rules ) {
        assert_usage(
            canBeMissing,
            'There are no rules at all.',
            'In other words `config.module.rules` is falsy.'
        );
        config.module.rules = config.module.rules || [];
    }
    const {rules} = config.module;
    assert_usage(
        Array.isArray(rules),
        "`config.module.rules` should be an array but it is a `"+rules.constructor+"`."
    );
    return rules;
}

// Webpack's normalizing code at webpack/lib/EntryOptionPlugin.js
function getEntries(config) {
    assert_usage(config && config.entry);
    if( config.entry.constructor===String ) {
        return {main: [config.entry]};
    }
    if( config.entry.constructor===Array ) {
        return {main: config.entry};
    }
    if( config.entry.constructor===Object ) {
        return config.entry;
    }
    assert_usage(false);
}

// Copy of webpack/lib/RuleSet.js: normalizeCondition
function normalizeCondition(condition) {
    if (!condition) throw new Error("Expected condition but got falsy value");
    if (typeof condition === "string") {
        return str => str.indexOf(condition) === 0;
    }
    if (typeof condition === "function") {
        return condition;
    }
    if (condition instanceof RegExp) {
        return condition.test.bind(condition);
    }
    if (Array.isArray(condition)) {
        const items = condition.map(c => normalizeCondition(c));
        return orMatcher(items);
    }
    if (typeof condition !== "object")
        throw Error(
            "Unexcepted " +
                typeof condition +
                " when condition was expected (" +
                condition +
                ")"
        );

    const matchers = [];
    Object.keys(condition).forEach(key => {
        const value = condition[key];
        switch (key) {
            case "or":
            case "include":
            case "test":
                if (value) matchers.push(RuleSet.normalizeCondition(value));
                break;
            case "and":
                if (value) {
                    const items = value.map(c => RuleSet.normalizeCondition(c));
                    matchers.push(andMatcher(items));
                }
                break;
            case "not":
            case "exclude":
                if (value) {
                    const matcher = RuleSet.normalizeCondition(value);
                    matchers.push(notMatcher(matcher));
                }
                break;
            default:
                throw new Error("Unexcepted property " + key + " in condition");
        }
    });
    if (matchers.length === 0)
        throw new Error("Excepted condition but got " + condition);
    if (matchers.length === 1) return matchers[0];
    return andMatcher(matchers);
}
function orMatcher(items) {
	return function(str) {
		for (let i = 0; i < items.length; i++) {
			if (items[i](str)) return true;
		}
		return false;
	};
}
function notMatcher(matcher) {
	return function(str) {
		return !matcher(str);
	};
}
function andMatcher(items) {
	return function(str) {
		for (let i = 0; i < items.length; i++) {
			if (!items[i](str)) return false;
		}
		return true;
	};
}
