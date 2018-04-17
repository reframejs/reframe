const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

function create_file_writer(isoBuilder) {
    const fs_handler = new FileSystemHandler();
    return {
        startWriteSession: fs_handler.startWriteSession,
        endWriteSession: fs_handler.endWriteSession,
        writeFile: ({filePath, fileContent, noSession}) => {
            assert_usage(fileContent);
            assert_usage(filePath);
            assert_usage(!is_abs(filePath));
            assert_isoBuilder(isoBuilder);
            const {outputDir} = isoBuilder;
            const file_path = path__resolve(outputDir, filePath);
            fs_handler.writeFile(file_path, fileContent, noSession);
            return file_path;
        },
    };
}

function FileSystemHandler() {
    const written_files = [];

    const sessions = {};

    let current_session = null;

    return {
        writeFile,
        startWriteSession,
        endWriteSession,
    };

    function startWriteSession(session_name) {
        assert_usage(current_session===null);
        current_session = session_name;
        const session_object = sessions[current_session] = sessions[current_session] || {};
        session_object.written_files__previously = session_object.written_files__current || [];
        session_object.written_files__current = [];
        session_object.is_first_session = session_object.is_first_session===undefined ? true : false;
    }
    function endWriteSession() {
        assert_usage(current_session);
        const session_object = sessions[current_session];
        removePreviouslyWrittenFiles(session_object);
        current_session = null;
    }

    function writeFile(path, content, noSession) {
        assert_usage(noSession || current_session);
        assert_usage(is_abs(path));

        let session_object;
        if( ! noSession ) {
            session_object = sessions[current_session];
            session_object.written_files__current.push(path);
        }

        const no_changes = fs__path_exists(path) && fs__read(path)===content;
        if( no_changes ) {
            return;
        }

        global.DEBUG_WATCH && console.log('FILE-CHANGED: '+path);

        fs__write_file(path, content);

        if( ! noSession && session_object.is_first_session ) {
            // Webpack bug fix
            //  - https://github.com/yessky/webpack-mild-compile
            //  - https://github.com/webpack/watchpack/issues/25
            //  - alternative solution: `require('webpack-mild-compile')`
            const twelve_minutes = 1000*60*12;
            const time = new Date() - twelve_minutes;
            touch.sync(path, {time});
        }
    }

    function removePreviouslyWrittenFiles(session_object) {
        session_object.written_files__previously.forEach(path => {
            if( ! session_object.written_files__current.includes(path) ) {
                global.DEBUG_WATCH && console.log('FILE-REMOVED: '+path);
                fs__remove(path);
            }
        });
    }
}

function fs__read(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}
function fs__write_file(path, content) {
    assert_internal(is_abs(path));
    mkdirp.sync(pathModule.dirname(path));
    fs.writeFileSync(path, content);
}
function fs__remove(path) {
    if( fs__file_exists(path) ) {
        fs.unlinkSync(path);
    }
}
function fs__file_exists(path) {
    try {
        return fs.statSync(path).isFile();
    }
    catch(e) {
        return false;
    }
}
function fs__path_exists(path) {
    try {
        fs.statSync(path);
        return true;
    }
    catch(e) {
        return false;
    }
}
