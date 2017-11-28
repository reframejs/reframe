const React = require('react');

const GameOfThronesComponent = ({characters}) => (
    <div>
        <h3>Game of Thrones Characters</h3>
        <table border="7" cellPadding="5"><tbody>{
            characters.map(({name, details}) => (
                <tr key={name}><td>
                    <a href={details}>
                        {name}
                    </a>
                </td></tr>
            ))
        }</tbody></table>
    </div>
);

module.exports = {GameOfThronesComponent};
