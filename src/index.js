import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );  
}

  
class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      value={this.props.squares[i]} 
      onClick = {() => this.props.onClick(i)}
      />;
}

  render() {
    return (
    <div>
        <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
        </div>
        <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
        </div>
        <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
        </div>
    </div>
    );
  }
}


class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      move_coords : [[0,0],]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    let move_coords = this.state.move_coords.slice(0, this.state.stepNumber + 1)
    console.log(move_coords)
    // const move_coords = this.state.move_coords[step_number]
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X':'O'
    move_coords = move_coords.concat([calculate_coords(i)])
    console.log(move_coords)
    this.setState({
      history:history.concat([
        {
        squares:squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      move_coords: move_coords
    })
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step,move) => {
      const move_col = this.state.move_coords[move][0]
      const move_row = this.state.move_coords[move][1]
      // console.log(move)
      // console.log(this.state.move_coords)
      const desc = move ?
        'Go to move (' + move_col +',' + move_row +')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })



    let status
    if (winner){
      status = 'Winner: ' + winner
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O')
    }
    return (
    <div className="game">
        <div className="game-board">
        <Board 
          squares = {current.squares}
          onClick = {(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        </div>
    </div>
    );
  }
}
  
// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function calculate_coords(i){
  const col = (i%3)+1
  let row
  if (i<3){
    row = 1
  } else if (i<6){
    row = 2
  } else {
    row =3
  }
  return [col,row]
}