import React from 'react';
import { returnPlayerName } from './utils.js';
import { ReactCheckers } from './ReactCheckers.js';
import Board from './Board.js';
import './index.css';

export class Checkers extends React.Component {
    constructor(props) {
        super(props);

        this.columns = this.setColumns();

        this.ReactCheckers = new ReactCheckers(this.columns);

        this.state = {
            history: [{
                boardState: this.createBoard(),
                currentPlayer: false,
            }],
            activePiece: null,
            moves: [],
            jumpKills: null,
            hasJumped: null,
            stepNumber: 0,
            winner: null,
            player1Points: 0,
            player2Points: 0,
            timerSeconds: 300,
            timerRunning: false,
            gameEnded: false,
        }
    }

    componentDidMount() {
        this.startTimer();
    }

    startTimer = () => {
        this.setState({ timerRunning: true });
        this.timerInterval = setInterval(() => {
          if (this.state.timerSeconds === 0) {
            clearInterval(this.timerInterval);
            this.handleGameEnd();
          } else {
            this.setState({ timerSeconds: this.state.timerSeconds - 1 });
          }
        }, 1000);
    };

    handleGameEnd = () => {
        const { player1Points, player2Points } = this.state;
        const winner = player1Points > player2Points ? 'player1' : player2Points > player1Points ? 'player2' : null;
        const gameStatus =
          winner !== null
            ? `${winner} wins!`
            : 'It\'s a draw!';
    
        this.setState({ gameStatus, gameEnded: true });
    };

    setColumns() {
        const columns = {};
        columns.a = 0;
        columns.b = 1;
        columns.c = 2;
        columns.d = 3;
        columns.e = 4;

        return columns;
    }

    createBoard() {
        let board = {};

        for (let key in this.columns) {
            if (this.columns.hasOwnProperty(key)) {
                for (let n = 1; n <= 5; ++n) { // ошибка playera coordinates - 5
                    let row = key + n;
                    board[row] = null;
                }
            }
        }

        board = this.initPlayers(board);

        return board;
    }

    initPlayers(board) {
        const player1 = ['a5', 'b5', 'c5', 'd5', 'e5'];
        const player2 = ['a1', 'b1', 'c1', 'd1', 'e1'];

        let self = this;

        player1.forEach(function (i) {
            board[i] = self.createPiece(i, 'player1');
        });

        player2.forEach(function (i) {
            board[i] = self.createPiece(i, 'player2');
        });

        return board;
    }

    createPiece(location, player) {
        let piece = {};

        piece.player = player;
        piece.location = location;
        piece.isKing = true;

        return piece;
    }

    getCurrentState() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        return history[history.length - 1];
    }

    handleClick(coordinates) {
        if (this.state.gameEnded) {
            return
        }

        if (typeof(this.state.winner) === Object) {
            return;
        }

        const currentState = this.getCurrentState();
        const boardState = currentState.boardState;
        const clickedSquare = boardState[coordinates];

        // Clicked on a piece
        if (clickedSquare !== null) {
            // Can't select opponents pieces
            if (clickedSquare.player !== returnPlayerName(currentState.currentPlayer)) {
                return;
            }

            // Unset active piece if it's clicked
            if (this.state.activePiece === coordinates && this.state.hasJumped === null) {
                this.setState({
                    activePiece: null,
                    moves: [],
                    jumpKills: null,
                });
                return;
            }

            // Can't choose a new piece if player has already jumped.
            if (this.state.hasJumped !== null && boardState[coordinates] !== null) {
                return;
            }

            // Set active piece
            let movesData = this.ReactCheckers.getMoves(boardState, coordinates, clickedSquare.isKing, false);

            this.setState({
                activePiece: coordinates,
                moves: movesData[0],
                jumpKills: movesData[1],
            });

            return;
        }

        // Clicked on an empty square
        if (this.state.activePiece === null) {
            return;
        }

        // Moving a piece
        if (this.state.moves.length > 0) {
            const postMoveState = this.ReactCheckers.movePiece(coordinates, this.state);

            if (postMoveState === null) {
                return;
            }

            this.updateStatePostMove(postMoveState);
        }
    }

    updateStatePostMove(postMoveState) {
        this.setState({
            history: this.state.history.concat([{
                boardState: postMoveState.boardState,
                currentPlayer: postMoveState.currentPlayer,
            }]),
            activePiece: postMoveState.activePiece,
            moves: postMoveState.moves,
            jumpKills: postMoveState.jumpKills,
            hasJumped: postMoveState.hasJumped,
            stepNumber: this.state.history.length,
            winner: postMoveState.winner,
        });
    }

    render() {
        const columns = this.columns;
        const stateHistory = this.state.history;
        const activePiece = this.state.activePiece;
        const currentState = stateHistory[this.state.stepNumber];
        const boardState = currentState.boardState;
        const currentPlayer = currentState.currentPlayer;
        const moves = this.state.moves;
        const { PlayersState } = this.props;
        const { timerSeconds } = this.state;

        const getRemainingPieces = () => {
            const winner = this.state.winner;
            if (winner) {
              const player1Pieces = winner.player1Pieces;
              const player2Pieces = winner.player2Pieces;
              if (player1Pieces !== undefined && player2Pieces !== undefined) {
                return {
                    player1: (Math.max(player2Pieces, 0) + Math.min(player2Pieces, -5)) * -1,
                    player2: (Math.max(player1Pieces, 0) + Math.min(player1Pieces, -5)) * -1,
                };
              }
            }
            return {
              player1: 0,
              player2: 0,
            };
        }; 
      
        const navigateToResult = () => {
            setTimeout(() => {
                this.props.navigate('/result', {
                  state: {
                    player1: {
                      player1Exists,
                    },
                    player2: {
                      player2Exists,
                    },
                    points: this.state.winner
                  },
                });
            }, 5000)
        }

        const player1Exists = PlayersState && PlayersState.player1;
        const player2Exists = PlayersState && PlayersState.player2;
      
        let gameStatus;
      
        switch (this.state.winner) {
            case 'player1pieces':
              gameStatus = 'Player One Wins!';
              navigateToResult();
              break;
            case 'player2pieces':
              gameStatus = 'Player Two Wins!';
              navigateToResult();
              break;
            case 'player1moves':
              gameStatus = 'No moves left - Player One Wins!';
              navigateToResult();
              break;
            case 'player2moves':
              gameStatus = 'No moves left - Player Two Wins!';
              navigateToResult();
              break;
            default:
              gameStatus =
                currentPlayer === true
                  ? player1Exists ? `Player ${PlayersState.player1.name}` : 'Player One'
                  : player2Exists ? `Player ${PlayersState.player2.name}` : 'Player Two';
              break;
        }                   
      
        return (
          <div className="reactCheckers">
            <div className="timer-container">
                <div className="timer">Осталось: {timerSeconds}</div>
            </div>
            <div className='user_box'>
                    {player1Exists && player1Exists.avatar ? (
                        <img 
                            className='user_avatar' 
                            alt='user_avatar' 
                            src={URL.createObjectURL(player1Exists.avatar)}
                        />
                    ) : (
                        null
                    )}
                <div className='user'>
                    <h1>{player1Exists && player1Exists.name}</h1>
                    -
                    <h1>{getRemainingPieces().player1}</h1>
                </div>
            </div>
            <div className="game-status">{gameStatus}</div>
            <div className="game-board">
              <Board
                boardState={boardState}
                currentPlayer={currentPlayer}
                activePiece={activePiece}
                moves={moves}
                columns={columns}
                player1Exists={player1Exists}
                player2Exists={player2Exists}
                onClick={(coordinates) => this.handleClick(coordinates)}
              />
            </div>
            <div className='user_box'>
                {player2Exists && player2Exists.avatar ? (
                    <img 
                        className="user_avatar" 
                        alt='user_avatar' 
                        src={URL.createObjectURL(player2Exists.avatar)}
                    />
                ) : (
                    null
                )}
                <div className='user'>
                    <h1>{player2Exists && player2Exists.name}</h1>
                    -
                    <h1>{getRemainingPieces().player2}</h1>
                </div>
            </div>
          </div>
        );
    }                  
}