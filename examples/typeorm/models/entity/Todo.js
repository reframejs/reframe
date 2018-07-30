module.exports = {
    name: "Todo",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        text: {
            type: "text"
        }
    },
    relations: {
        categories: {
            target: "User",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
};
