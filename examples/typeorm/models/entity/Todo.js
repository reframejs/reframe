module.exports = {
    name: "Todo",
    columns: {
        id: {
            primary: true,
            type: Number,
            generated: true
        },
        text: {
            type: String,
        },
        isCompleted: {
            type: Boolean,
        },
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            eager: true,
            cascade: false,
            /*
            joinColumn: {
                name: 'author',
            },
            */
            nullable: false
        }
    }
};
