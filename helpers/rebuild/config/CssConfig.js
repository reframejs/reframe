const assert = require('reassert');
const assert_internal = assert;

module.exports = CssConfig;
module.exports.add_extract_text_plugin = add_extract_text_plugin;

function CssConfig() {
    return config_css;
}

function config_css(config) {
   /*
   return {
        module: {rules: {css: {
            use: (
                [
                    require.resolve('style-loader'),
                    require.resolve('css-loader'),
                ]
            ),
        }}},
   };
   */
    /*
    if( ! is_production() ) {
       return {
            module: {rules: {css: {
                use: (
                    [
                        require.resolve('style-loader'),
                        require.resolve('css-loader'),
                    ]
                ),
            }}},
       };
    }
    */

    const {extract_plugin, extract_loader} = (
        add_extract_text_plugin({
            config,
            loaders: [
                require.resolve('css-loader'),
            ],
        })
    );

    return {
        plugins: [
            extract_plugin,
        ],
        module: {rules: {css: {
            use: [
                extract_loader,
                require.resolve("css-loader"),
            ],
        }}},
    };
}

function add_extract_text_plugin({config, loaders}) {
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");

    const filename = get_style_filename(config);

    const extract_plugin = new MiniCssExtractPlugin({filename});

    const extract_loader = MiniCssExtractPlugin.loader;

    return {extract_plugin, extract_loader};
}

function get_style_filename(config) {
    let filename = config.output.filename;
    assert_internal(filename);
    {
        const DOT_JS = /\.js$/;
        assert_internal(DOT_JS.test(config.output.filename));
        filename = filename.replace(DOT_JS, '.css');
    }
    if( filename.includes('.entry.') ) {
        filename = filename.replace('.entry.', '.style.');
    } else {
        const NAME = '[name]';
        assert_internal(config.output.filename.includes(NAME));
        filename = filename.replace(NAME, NAME+'.style');
    }
 // filename = filename.replace(/\[chunkhash\]/g, '[contenthash]');
    return filename
}

