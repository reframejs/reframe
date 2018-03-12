module.exports = log_title;

function log_title(title, min_bar_length=40) {
    title = ' '+title+' ';
    const bar_length = Math.max(min_bar_length, title.length+6);
    const margin = Math.floor((bar_length - title.length) / 2);
    const bar = new Array(bar_length).fill('*').join('');
    const title_bar = (
        bar
        .split('')
        .map((char_, pos) => {
            const pos_in_title = pos-margin;
            if( 0 <= pos_in_title && pos_in_title < title.length ) {
                return title.split('')[pos_in_title];
            }
            return char_;
        })
        .join('')
    );
    console.log(
        [
            bar,
            title_bar,
            bar,
        ].join('\n')
    );
}
