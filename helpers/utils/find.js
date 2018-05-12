const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const assert_not_implemented = assert_internal;
const find_up_module = require('find-up');
const path_module = require('path');
const find_down = require('@brillout/find-package-files');


module.exports = find;


function find(
    input,
    {
      noDir: no_dir = false,
      onlyDir: only_dir = input && input.endsWith('/'),
      anchorFiles: anchor_files,
      canBeMissing: can_be_missing = false,
      cwd = process.cwd(),
    }={}
) {
    assert_usage(input);

    anchor_files = !anchor_files && ['.git'] || anchor_files.constructor===Array && anchor_files || [anchor_files];

    const filename = input.replace(/\/*$/, '');
    assert_usage(!filename.includes('/'));

    assert_usage(!no_dir || !only_dir);

    return find_file({filename, input, no_dir, only_dir, anchor_files, can_be_missing, cwd});
}

function find_file({filename, input, no_dir, only_dir, anchor_files, can_be_missing, cwd}) {
    assert_internal(!filename.endsWith('/'));

    const project_root = find_project_root({cwd, anchor_files});

    const paths_found__up = ! project_root && find_up(filename, {cwd, no_dir, only_dir});

    const paths_found__down = project_root && find_down(filename, {cwd: project_root, no_dir, only_dir});

    const paths_found = [
        ...(
            ! paths_found__up ? [] : [paths_found__up]
        ),
        ...(
            ! paths_found__down ? [] : paths_found__down
        ),
    ];
    assert_internal(paths_found.every(path_found => path_found.startsWith('/')));

    assert_can_be_missing({can_be_missing, paths_found, input, project_root, anchor_files});

    if( paths_found.length===0 ) {
        return null;
    }

    paths_found.sort(cwd_distance_sorter(cwd));

    /*
    const dir = path_module.resolve(within_directory, paths_found[0]);
    return dir;
    */

    const found = paths_found[0];
    assert_internal(found.startsWith('/'));
    return found;
}

function assert_can_be_missing({can_be_missing, paths_found, input, project_root, anchor_files}) {
    assert_usage(
        can_be_missing || paths_found.length>0,
        ...(
            [
                "Could not find `"+input+".`",
                project_root && "Could find project root: `"+project_root+"`",
                ! project_root && "Could not find project root.",
                ! project_root && (
                    [
                        "Project root is determined by searching for ",
                        anchor_files.map(s => '`'+s+'`').join(', '),
                        '.',
                    ].filter(Boolean).join('')
                ),
            ].filter(Boolean)
        )
    );
}

function find_project_root({cwd, anchor_files}) {
    assert_internal(cwd);

    const file_at_root = (
        anchor_files
        .map(root_file => {
            const file_path = !anchor_files ? null : find_up(anchor_files, {cwd});
            assert_internal(file_path===null || file_path.startsWith('/'));
            return file_path;
        })
        .filter(Boolean)
        .sort(cwd_distance_sorter(cwd))
        [0]
    );

    assert_internal(file_at_root===undefined || file_at_root.startsWith('/'));
    if( ! file_at_root ) {
        return null;
    }

    const project_root = path_module.join(file_at_root, '../');
    return project_root;
}

function find_up(filename, {only_dir, no_dir, cwd}) {
    assert_internal(filename);
    assert_internal(cwd.startsWith('/'));

    /* TODO-eventually
    assert_not_implemented(!only_dir);
    assert_not_implemented(!no_dir);
    */

    const found_path = find_up_module.sync(filename, {cwd});

    assert_internal(found_path===null || found_path.constructor===String && found_path.startsWith('/'));

    return found_path;
}

function cwd_distance_sorter(cwd) {
    return (
        (file1, file2) => {
            return get_distance_with_cwd(file1, cwd) - get_distance_with_cwd(file2, cwd);
        }
    );
}

function get_distance_with_cwd(path, cwd) {
    assert_internal(cwd);
    assert_internal(path_module.isAbsolute(cwd));
    assert_internal(path);
    assert_internal(path_module.isAbsolute(path));
    const path__relative = path_module.relative(cwd, path);
    const distance = path_depth(path__relative);
    return distance;
}

function path_depth(file) {
    return (
        path_module
        .normalize(file)
        .split(path_module.sep)
        .length
    );
}
