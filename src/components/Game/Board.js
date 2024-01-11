import React from 'react';
import * as utils from './utils.js';

function Square(props) {
    const squareClasses = props['squareClasses'];
    const onClick = props['onClick'];
    const classNames = squareClasses.split(' ');
    const isPlayer1 = classNames.includes("player1");
    const isPlayer2 = classNames.includes("player2");
    const player1 = props['player1'];
    const player2 = props['player2'];

    const hasAvatarPlayer1 = isPlayer1 && player1.avatar;
    const hasAvatarPlayer2 = isPlayer2 && player2.avatar;

    return (
        <button 
            style={
                (hasAvatarPlayer1 || hasAvatarPlayer2) ? 
                {
                    backgroundImage: 'none',
                } : {}
            } 
            className={"square " + squareClasses} 
            onClick={onClick} 
        > 
            {hasAvatarPlayer1 ? (
                <img 
                    className='user__img'
                    src={URL.createObjectURL(player1.avatar)} 
                    alt="player1-avatar"
                />
            ) : hasAvatarPlayer2 ? (
                <img 
                    className='user__img'
                    src={URL.createObjectURL(player2.avatar)} 
                    alt="player2-avatar"
                />
            ) : null}
        </button> 
    );
}

export default class Board extends React.Component {

    renderSquare(coordinates, squareClasses) {
        return (
            <Square
                key = {coordinates}
                squareClasses = {squareClasses}
                player1 = {this.props.player1Exists}
                player2 = {this.props.player2Exists}
                onClick = {() => this.props.onClick(coordinates) }
            />
        );
    }

    render() {
        let boardRender = [];
        let columnsRender = [];

        const moves = this.props.moves;

        for (let coordinates in this.props.boardState) {

            if (!this.props.boardState.hasOwnProperty(coordinates)) {
                continue;
            }

            const col = utils.getColAsInt(this.props.columns, coordinates);
            const row = utils.getRowAsInt(coordinates);

            const currentPlayer = utils.returnPlayerName(this.props.currentPlayer);

            const colorClass  = ( (utils.isOdd(col) && utils.isOdd(row)) || (!utils.isOdd(col) && !(utils.isOdd(row)) ) ) ? 'white' : 'black';

            let squareClasses = [];

            squareClasses.push(coordinates);
            squareClasses.push(colorClass);

            if (this.props.activePiece === coordinates) {
                squareClasses.push('isActive');
            }

            if (moves.indexOf(coordinates) > -1) {
                let moveClass = 'movable ' + currentPlayer + '-move';
                squareClasses.push(moveClass);
            }

            if (this.props.boardState[coordinates] !== null) {
                squareClasses.push(this.props.boardState[coordinates].player + ' piece');
                if (this.props.boardState[coordinates].isKing === true ) {
                    squareClasses.push('king');
                }
            }

            squareClasses = squareClasses.join(' ');

            columnsRender.push(this.renderSquare(coordinates, squareClasses, this.props.boardState[coordinates]));

            if (columnsRender.length >= 5) {
                columnsRender = columnsRender.reverse();
                // console.log(columnsRender)
                boardRender.push(<div key={boardRender.length} className="board-col">{columnsRender}</div>);
                columnsRender = [];
            }
        }

        return (boardRender);
    }
}