module.exports = EasyQL;

function EasyQL () {
    Object.assign(this, {
        QueryHandlers: [],
        ParamHandlers: [],
    });

    return this;
}
