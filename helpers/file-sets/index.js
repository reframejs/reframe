const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const touch = require('touch');
const pathModule = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');


module.exports = FileSets;


function FileSets({pathBase}={}) {
    assert_usage(pathBase && pathModule.isAbsolute(pathBase));

    const written_files = [];

    const sessions = {};

    let current_session = null;

    return {
        writeFile,
        startFileSet,
        endFileSet,
    };

    function startFileSet(session_name) {
        assert_usage(current_session===null);
        current_session = session_name;
        const session_object = sessions[current_session] = sessions[current_session] || {};
        session_object.written_files__previously = session_object.written_files__current || [];
        session_object.written_files__current = [];
        session_object.is_first_session = session_object.is_first_session===undefined ? true : false;
    }
    function endFileSet() {
        assert_usage(current_session);
        const session_object = sessions[current_session];
        removePreviouslyWrittenFiles(session_object);
        current_session = null;
    }

    function writeFile({filePath, fileContent, noFileSet}) {
        assert_usage(noFileSet || current_session);
        if( pathBase ) {
            filePath = path__resolve(pathBase, filePath);
        }
        assert_usage(pathModule.isAbsolute(filePath));

        let session_object;
        if( ! noFileSet ) {
            session_object = sessions[current_session];
            session_object.written_files__current.push(filePath);
        }

        const no_changes = fs__path_exists(filePath) && fs__read(filePath)===fileContent;
        if( no_changes ) {
            return filePath;
        }

        global.DEBUG_WATCH && console.log('FILE-CHANGED: '+filePath);

        fs__write_file(filePath, fileContent);

        if( ! noFileSet && session_object.is_first_session ) {
            // Webpack bug fix
            //  - https://github.com/yessky/webpack-mild-compile
            //  - https://github.com/webpack/watchpack/issues/25
            //  - alternative solution: `require('webpack-mild-compile')`
            const twelve_minutes = 1000*60*12;
            const time = new Date() - twelve_minutes;
            touch.sync(filePath, {time});
        }

        return filePath;
    }

    function removePreviouslyWrittenFiles(session_object) {
        session_object.written_files__previously.forEach(filePath => {
            if( ! session_object.written_files__current.includes(filePath) ) {
                global.DEBUG_WATCH && console.log('FILE-REMOVED: '+filePath);
                fs__remove(filePath);
            }
        });
    }
}

function fs__read(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}
function fs__write_file(filePath, fileContent) {
    assert_internal(pathModule.isAbsolute(filePath));
    mkdirp.sync(pathModule.dirname(filePath));
    fs.writeFileSync(filePath, fileContent);
}
function fs__remove(filePath) {
    if( fs__file_exists(filePath) ) {
        fs.unlinkSync(filePath);
    }
}
function fs__file_exists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    }
    catch(e) {
        return false;
    }
}
function fs__path_exists(filePath) {
    try {
        fs.statSync(filePath);
        return true;
    }
    catch(e) {
        return false;
    }
}
function path__resolve(path1, path2, ...paths) {
    assert_internal(path1 && pathModule.isAbsolute(path1), path1);
    assert_internal(path2 && path2.constructor===String, path2);
    return pathModule.resolve(path1, path2, ...paths);
}
