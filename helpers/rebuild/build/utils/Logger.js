const assert_internal = require('reassert/internal');
const assert_tmp = assert_internal;
const ora = require('ora');
const log = require('reassert/log');
const log_title = require('../utils/log_title');
const commondir = require('commondir');
const {colorEmp, strDir, colorWarning, colorErr, symbolSuccess, symbolError} = require('@brillout/cli-theme');

module.exports = {Logger};

function Logger(opts) {
    let current_spinner;

    Object.assign(
        this, {
            onNewBuildState: new BuildStateManager(this),

            symbols: {
                success_symbol: symbolSuccess,
                failure_symbol: symbolError,
            },

            loading_spinner: {
                start_spinner,
                stop_spinner,
            },

            getBuildStartText,
            getBuildEndText,
            getEnvText,
            getRebuildText,
            on_first_compilation_result,
            on_compilation_fail,
            on_first_compilation_success,
            on_re_compilation_success,
        },
        opts
    );

    return this;

    function on_first_compilation_result({compilation_info, is_failure}) {
        if( log_config_and_stats ) {
            log_compilation_info({compilation_info});
            return;
        }
        /*
        if( is_failure ) {
            log_compilation_info({compilation_info});
        }
        */
    }

    function on_compilation_fail({compilation_info}) {
        process.stdout.write('\n');
        log_compilation_error({compilation_info});
        process.stdout.write('\n');
        console.log(this.symbols.failure_symbol+'Build failed');
        process.stdout.write('\n');
    }

    function on_first_compilation_success({compilation_info}) {
        log_compilation_distribution.call(this, {compilation_info});
    }

    function on_re_compilation_success() {
        console.log(this.symbols.success_symbol+'Re-built');
    }

    function log_compilation_info({compilation_info}) {
        compilation_info
        .filter(Boolean)
        .sort(({is_success: is_success_1}, {is_success: is_success_2}) => is_success_2 - is_success_1)
        .forEach(({webpack_config, webpack_stats, output}) => {
            process.stdout.write('\n');
            log_config(webpack_config);
            process.stdout.write('\n');
         // log_webpack_output(output);
         // process.stdout.write('\n');
            log_webpack_stats(webpack_stats);
        });
    }

    function log_compilation_error({compilation_info}) {
        const infos = (
            compilation_info
            .filter(Boolean)
            .filter(({is_success}) => !is_success)
        );
        assert_internal(infos.length>0);
        infos.forEach(({webpack_stats}) => {
            log_stats_errors({webpack_stats});
        });
    }

    function log_compilation_distribution({compilation_info}) {
        const output_directories = (
            compilation_info
            .filter(Boolean)
            .map(compilationInfo => {
                assert_internal(compilationInfo.output, compilationInfo);
                assert_internal(compilationInfo.output.dist_root_directory, compilationInfo);
                return compilationInfo.output.dist_root_directory;
            })
        );
        const output_directory__base = commondir(output_directories);
        process.stdout.write(
            [
                log_config_and_stats && '\n',
                this.symbols.success_symbol,
                this.getBuildEndText(),
                output_directory__base && ' '+strDir(output_directory__base),
                this.getEnvText(),
                '\n\n'
            ]
            .filter(Boolean).join('')
        );
    }

    function start_spinner(text) {
        assert_internal(!current_spinner);
        current_spinner = ora({
            text,
         // spinner: 'line',
        });
        current_spinner.start();
    }
    function stop_spinner() {
        spinner_run('stop');
    }
    function spinner_run(fn_name) {
        if( ! current_spinner ) {
            return;
        }
        current_spinner[fn_name]();
        current_spinner = null;
    }
}

function getBuildStartText() {
    return 'Transpiling & Bundling';
}
function getBuildEndText() {
    return 'Code built';
}
function getEnvText() {
    return ' (for '+colorEmp(get_build_env())+')';
}

function getRebuildText() {
    return 'Re-building';
}

function get_build_env() {
    return process.env.NODE_ENV || 'development';
}

function log_stats_errors({webpack_stats}) {
    const has_errors = webpack_stats.hasErrors();
    const has_warnings = webpack_stats.hasWarnings();
    if( !has_errors && !has_warnings ) {
        return;
    }

    const info = webpack_stats.toJson();

    if (has_errors) {
        log_title('Error');
        if( info.errors.forEach ) {
            info.errors.forEach(error => {
                const prefix = 'ERROR in ';
                print_err(colorErr(prefix+error));
            });
        } else {
            print_err(info.errors);
        }
    }

    if (has_warnings) {
        log_title('Warning');
        if( info.warnings.forEach ) {
            info.warnings.forEach(error => {
                print_warn(colorWarning(error));
            });
        } else {
            print_warn(info.warnings);
        }
    }
}

function log_config(config) {
    log_title('Webpack Config');
    log(config);
}

function log_webpack_stats(webpack_stats) {
    if( ! webpack_stats ) {
        return;
    }

    log_title('Webpack Stats');
    print(webpack_stats.toString({colors: true, reasons: true}));
}

function log_webpack_output(output) {
    log_title('Webpack Output');
    log(output);
}

function print() {
    /*
    readline.clearLine(process.stdout);
    readline.cursorTo(process.stdout, 0);
    */
    console.log.apply(console, arguments);
}

function print_err() {
    console.error.apply(console, arguments);
}

function print_warn() {
    console.warn.apply(console, arguments);
}

function BuildStateManager(logger) {
    const logging_state = {
        has_logged_first_compilation_start: false,
        logging_is_compiling: false,
        has_been_successful_before: false,
        has_finished_compiled_before: false,
    };

    return onNewBuildState;

    function onNewBuildState(new_state) {
        const {is_compiling, is_failure, compilation_info} = logger.build_state = new_state;

        assert_internal(is_compiling || [true, false].includes(is_failure));

        if( is_compiling && ! logging_state.logging_is_compiling ) {
            logging_state.logging_is_compiling = true;
            let spinner_text;
            if( ! logging_state.has_logged_first_compilation_start ) {
                logging_state.has_logged_first_compilation_start = true;
                spinner_text = logger.getBuildStartText()+logger.getEnvText();
            } else {
                spinner_text = logger.getRebuildText();
            }
            assert_tmp(spinner_text);
            spinner_text && logger.loading_spinner.start_spinner(spinner_text);
        }

        if( ! is_compiling && ! logging_state.has_logged_first_compilation_start ) {
            return;
        }

        assert_compilation_info({compilation_info, is_compiling, is_failure});

        if( ! is_compiling && logging_state.logging_is_compiling ) {
            logging_state.logging_is_compiling = false;
            logger.loading_spinner.stop_spinner();
        }

        if( ! is_compiling && ! logging_state.has_finished_compiled_before ) {
            logger.on_first_compilation_result({compilation_info, is_failure});
            logging_state.has_finished_compiled_before = true;
        }

        if( ! is_compiling && is_failure ) {
            logger.on_compilation_fail({compilation_info});
        }

        if( ! is_compiling && ! is_failure ) {
            if( ! logging_state.has_been_successful_before ) {
                logger.on_first_compilation_success({compilation_info});
            } else {
                logger.on_re_compilation_success();
            }
            logging_state.has_been_successful_before = true;
        }

    }
}

function assert_compilation_info({compilation_info, is_compiling, is_failure}) {
    if( is_compiling ) {
        return;
    }
    assert_internal(compilation_info.constructor===Array, compilation_info);
    compilation_info.forEach(comp_info => {
        if( is_failure && comp_info === null ) {
            return;
        }
        assert_internal(comp_info, {comp_info, is_compiling, is_failure});
        assert_internal(comp_info.output, comp_info);
        assert_internal(comp_info.output.dist_root_directory, comp_info);
    });
}
