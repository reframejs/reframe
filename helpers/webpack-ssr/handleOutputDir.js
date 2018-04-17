const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const mkdirp = require('mkdirp');
const pathModule = require('path');
const fs = require('fs');

module.exports = handleOutputDir;

function handleOutputDir({outputDir}) {
    moveAndStampOutputDir({outputDir});
}

function moveAndStampOutputDir({outputDir}) {
    assert_usage(outputDir && pathModule.isAbsolute(outputDir), outputDir);
    const stamp_path = path__resolve(outputDir, 'build-stamp');

    handle_existing_output_dir();
    assert_emtpy_output_dir();
    create_output_dir();

    return;

    function create_output_dir() {
        mkdirp.sync(pathModule.dirname(outputDir));
        const timestamp = get_timestamp();
        assert_internal(timestamp);
        const stamp_content = get_timestamp()+'\n';
        fs__write_file(stamp_path, stamp_content);
    }

    function get_timestamp() {
        const now = new Date();

        const date = (
            [
                now.getFullYear(),
                now.getMonth()+1,
                now.getDate(),
            ]
            .map(pad)
            .join('-')
        );

        const time = (
            [
                now.getHours(),
                now.getMinutes(),
                now.getSeconds(),
            ]
            .map(pad)
            .join('-')
        );

        return date+'_'+time;

        function pad(n) {
            return (
                n>9 ? n : ('0'+n)
            );
        }
    }

    function handle_existing_output_dir() {
        if( ! fs__path_exists(outputDir) ) {
            return;
        }
        assert_usage(
            fs__path_exists(stamp_path),
            "Reframe's stamp `"+stamp_path+"` not found.",
            "It is therefore assumed that `"+outputDir+"` has not been created by Reframe.",
            "Remove `"+outputDir+"`, so that Reframe can safely write distribution files."
        );
        move_old_output_dir();
    }

    function assert_emtpy_output_dir() {
        if( ! fs__path_exists(outputDir) ) {
            return;
        }
        const files = fs__ls(outputDir);
        assert_internal(files.length<=1, files);
        assert_internal(files.length===1, files);
        assert_internal(files[0].endsWith('previous'), files);
    }

    function move_old_output_dir() {
        const stamp_content = fs__path_exists(stamp_path) && fs__read(stamp_path).trim();
        assert_internal(
            stamp_content,
            'Reframe stamp is missing at `'+stamp_path+'`.',
            'Remove `'+outputDir+'` and retry.',
        );
        assert_internal(stamp_content && !/\s/.test(stamp_content), stamp_content);
        const graveyard_path = path__resolve(outputDir, 'previous', stamp_content);
        move_all_files(outputDir, graveyard_path);
    }

    function move_all_files(path_old, path_new) {
        const files = fs__ls(path_old);
        files
        .filter(filepath => !path_new.startsWith(filepath))
        .forEach(filepath => {
            const filepath__relative = pathModule.relative(path_old, filepath);
            assert_internal(filepath__relative.split(pathModule.sep).length===1, path_old, filepath);
            const filepath__new = path__resolve(path_new, filepath__relative);
            fs__rename(filepath, filepath__new);
        });
    }
}


function fs__read(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}
function fs__write_file(path, content) {
    assert_internal(pathModule.isAbsolute(path));
    mkdirp.sync(pathModule.dirname(path));
    fs.writeFileSync(path, content);
}
function fs__rename(path_old, path_new) {
    assert_internal(pathModule.isAbsolute(path_old));
    assert_internal(pathModule.isAbsolute(path_new));
    mkdirp.sync(pathModule.dirname(path_new));
    fs.renameSync(path_old, path_new);
}
function fs__ls(dirpath) {
    assert_internal(pathModule.isAbsolute(dirpath));
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => path__resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(pathModule.isAbsolute(filepath), dirpath, files);
        assert_internal(pathModule.relative(dirpath, filepath).split(pathModule.sep).length===1, dirpath, files);
    });
    return files;
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
function path__resolve(path1, path2, ...paths) {
    assert_internal(path1 && pathModule.isAbsolute(path1), path1);
    assert_internal(path2 && path2.constructor===String, path2);
    return pathModule.resolve(path1, path2, ...paths);
}
