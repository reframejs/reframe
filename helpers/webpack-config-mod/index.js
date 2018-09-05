const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const escapeRegexp = require('lodash.escaperegexp');

const webpackConfigMod = {setRule, getRule, getEntries, addBabelPreset, addBabelPlugin, modifyBabelOptions, addExtension};

module.exports = webpackConfigMod;

function getRule(config, filenameExtension, {canBeMissing=true}={}) {
    assert_filenameExtension(filenameExtension);

    const rules = getAllRules(config, {canBeMissing});

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

function setRule(config, filenameExtension, newRule, {canBeMissing=true}={}) {
    assert_filenameExtension(filenameExtension);

    newRule = {...newRule};
    if( ! newRule.test ) {
        newRule.test = new RegExp(escapeRegexp(filenameExtension)+'$');
    }

    const dummyFileName = 'dummy'+filenameExtension;
    assert_usage(
        runRuleTest(newRule.test, dummyFileName),
        "The new rule to be set doesn't match the filename extension `"+filenameExtension+"`.",
        "The new rule's test is:",
        newRule.test,
        "But it doesn't match the file name `"+dummyFileName+"`."
    );
    const ruleOld = getRule(config, filenameExtension, {canBeMissing});
    const rules = getAllRules(config, {canBeMissing});
    if( ! ruleOld ) {
        rules.push(newRule);
        return;
    }
    const ruleIndex = rules.indexOf(ruleOld);
    assert_internal(ruleIndex>=0, rules, ruleOld);
    rules[ruleIndex] = newRule;
}

function assert_filenameExtension(filenameExtension) {
    assert_usage(
        (filenameExtension||{}).startsWith && filenameExtension.startsWith('.'),
        'The filename extension should be a string starting with `.` but we got: `'+filenameExtension+'`'
    );
}

function modifyBabelOptions(config, action, {canBeMissing=true}) {
    const babelLoaders = getBabelLoaders(config, {canBeMissing});

    const alreadyPassed = [];
    babelLoaders.forEach(babelLoader => {
        if( alreadyPassed.includes(babelLoader) ) {
            return;
        }
        action(babelLoader);
        alreadyPassed.push(babelLoader);
    });
}

function getBabelLoaders(config, {canBeMissing}) {
    const rules = getAllRules(config, {canBeMissing});

    rules.forEach(rule => {
        normlizeLoaders(rule);
    });

    const rulesFound = rules.filter(rule => rule.use.some(isBabelLoader));

    if( rulesFound.length===0 && canBeMissing ) {
        return [];
    }

    assert_usage(
        rulesFound.length>0,
        "No rule found that uses `babel-loader`."
    );

    let babelLoaders = [];

    rulesFound
    .forEach(rule => {
        let babelLoader;
        rule.use.forEach(loader => {
            if( isBabelLoader(loader) ) {
                assert_usage(
                    !babelLoader,
                    "Wrong rule:",
                    rule,
                    'More than one babel loader found but we expect only one.',
                    'Wrong rule in question is printed above.'
                );
                babelLoader = loader;
            }
        });
        if( babelLoader ) {
            babelLoaders.push(babelLoader);
        }
    });

    assert_internal(babelLoaders.length>0);

    return babelLoaders;

}

function addBabelPreset(...args) {
    addBabelThing('presets', ...args)
}

function addBabelPlugin(...args) {
    addBabelThing('plugins', ...args)
}

function addBabelThing(where, config, babelThing, {canBeMissing=true}={}) {
    const {name, options, spec} = parseBabelThing(babelThing);
    modifyBabelOptions(
        config,
        loader => {
            assert_internal(isBabelLoader(loader));
            loader.options = loader.options || {};
            loader.options[where] = loader.options[where] || [];
            const idx = loader.options[where].findIndex(babelThing => parseBabelThing(babelThing).name===name);
            if( idx !== -1 ) {
                loader.options[where][idx] = spec;
            } else {
                loader.options[where].push(spec);
            }
        },
        {canBeMissing}
    );
}

// Works for babel presets as well as for babel plugins
function parseBabelThing(babelThing) {
    assert_usage([String, Array].includes(babelThing.constructor));
    let name;
    let options;
    if( babelThing.constructor === Array ) {
        name = babelThing[0];
        options = babelThing[1];
    } else {
        name = babelThing;
    }
    assert_usage(name.constructor===String, babelThing);
    spec = [name];
    if( options ) {
        spec.push(options);
    }
    return {name, options, spec};
}

function addExtension(config, extension) {
    assert_usage(config && extension);
    assert_usage(extension.constructor === String && extension.startsWith('.'));
    config.resolve = config.resolve || {};
    config.resolve.extensions = config.resolve.extensions || ['.js', '.json'];
    if( ! config.resolve.extensions.includes(extension) ) {
        config.resolve.extensions.push(extension);
    }
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
        "Malformatted rule:",
        rule,
        "Rule found that is not an object",
        "Make sure all your rules are objects",
        "Malformatted rule in question is printed above"
    )
    assert_usage(
        !rule.loader || !rule.use,
        "Malformatted rule:",
        rule,
        "Conflicting format `rule.loader` and `rule.use`.",
        "Choose either one but not both at the same time.",
        "Malformatted rule in question is printed above."
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
        "Malformatted rule:",
        Array.isArray(rule.use) || rule.use instanceof Object,
        "Unexpected rule format: `rule.use` should be an array or object.",
        "Malformatted rule in question:",
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
                "Malformatted loader:",
                loader,
                "Unexpected rule.use[i] format: `rule.use[i]` should either be a string or have a `rule.use[i].loader` string.",
                "Malformatted loader in question is printed above."
            );
        })
    );
}

function getAllRules(config, {canBeMissing}) {
    assert_usage(
        config,
        'Config is missing'
    );
    config.module = config.module || {};
    if( ! config.module.rules ) {
        assert_usage(
            canBeMissing,
            'Trying to get the rules of webpack config.',
            'But there are no rules at all.',
            '(`config.module.rules` is falsy.)'
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
        return {main: [...config.entry]};
    }
    if( config.entry.constructor===Object ) {
        const entries = {};
        Object.entries(config.entry)
        .forEach(([entryName, entryFiles]) => {
            if( entryFiles && entryFiles.constructor===Array ) {
                entries[entryName] = [...entryFiles];
                return;
            }
            if( entryFiles && entryFiles.constructor===String ) {
                entries[entryName] = [entryFiles];
                return;
            }
            assert_usage(false, entryFiles, entryName);
        });
        return entries;
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
