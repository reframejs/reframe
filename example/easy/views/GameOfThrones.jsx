const React = require('react');

const GameOfThronesComponent = ({characters}) => (
    <div>
        <h3>Game of Thrones Characters</h3>
        <table border="7" cellPadding="5"><tbody>{
            characters.map(({name}) => (
                <tr key={name}><td>{name}</td></tr>
            ))
        }</tbody></table>
    </div>
);

const GameOfThronesData = {
    loadData: () => (
        new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    characters: [
                        {name: 'Jon Snow'},
                        {name: 'Daenerys Targaryen'},
                        {name: 'Cersei Lannister'},
                        {name: 'Tyrion Lannister'},
                        {name: 'Sansa Stark'},
                    ],
                });
            }, 1000);
        })
    ),
};

module.exports = {GameOfThronesComponent, GameOfThronesData};
