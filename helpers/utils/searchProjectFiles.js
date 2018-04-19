const assert_internal = require('reassert/internal');
//const glob = require('glob');
const ignore_module = require('ignore');
const glob_gitignore = require('glob-gitignore');
const find_up_module = require('find-up');
const path_module = require('path');
const fs = require('fs');

module.exports = searchProjectFiles;

function searchProjectFiles(filename, {only_dir, no_dir, cwd}) {
    assert_internal(!filename.includes('/'));
    assert_internal(cwd.startsWith('/'));

    const glob_pattern = '**/'+filename+(only_dir ? '/' : '');

    const glob_options = {
        cwd,
        nodir: no_dir, // doesn't seem to always work in `glob-gitignore` and `glob`
        ignore: get_ignore({cwd}),
    };

    const paths_found = (
        /*
        glob.sync(glob_pattern, glob_options)
        /*/
        glob_gitignore.sync(glob_pattern, glob_options)
        //*/
        .map(relative_path => path_module.join(cwd, relative_path))
    );
    assert_internal(paths_found.length>=0 && paths_found.every(path_found => path_found.startsWith('/')), paths_found);
    return paths_found;
}

function get_ignore({cwd}) {
    const gitignore = get_gitignore_content({cwd});

 // if( ! gitignore ) {
 //     return '**/node_modules/**/*';
 // }

    const gitignore_content = (
        get_gitignore_content({cwd}) || 'node_modules/'
    );

    const ignore = ignore_module().add(gitignore_content);

    return ignore;
}

function get_gitignore_content({cwd}) {
    const gitignore_path = find_up('.gitignore', {cwd, no_dir: true});

    let gitignore_content = null;
    try {
        gitignore_content = fs.readFileSync(gitignore_path).toString();
    } catch(e) {}

    return gitignore_content;
}

function find_up(filename, {only_dir, no_dir, cwd}) {
    assert_internal(filename);
    assert_internal(cwd.startsWith('/'));

    /* TODO
    assert_not_implemented(!only_dir);
    assert_not_implemented(!no_dir);
    */

    const found_path = find_up_module.sync(filename, {cwd});

    assert_internal(found_path===null || found_path.constructor===String && found_path.startsWith('/'));

    return found_path;
}
