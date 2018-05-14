const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const assert_internal = require('reassert/internal');

module.exports = CssConfig;

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

    const filename = get_style_filename(config);

    return {
        plugins: [
            new MiniCssExtractPlugin({filename}),
        ],
        module: {rules: {css: {
            use: [
                MiniCssExtractPlugin.loader,
                require.resolve("css-loader"),
            ],
        }}},
    };
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
    filename = filename.replace(/\[chunkhash\]/g, '[contenthash]');
    return filename
}

