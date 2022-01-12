import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const class_names = props.isWinner ? "square highlight-win":"square"
  return (
    <button className={class_names} onClick={props.onClick}>
      {props.value}
    </button>
  );  
}

  
class Board extends React.Component {
  renderSquare(i) {
    const isWinner = ((this.props.winners) && (this.props.winners.includes(i))) ? true:false
    return <Square 
      value={this.props.squares[i]} 
      onClick = {() => this.props.onClick(i)}
      key={'square'+i}
      isWinner = {isWinner}
      />;
}

  renderRow(i){
    let squares = []
    
    for (let j = 0; j<3 ; j++){
      squares.push(this.renderSquare(i*3+j))
    } 

    return <div className="board-row" key={'row'+i}>{squares}</div>
  }



  render() {
    let rows = [];
    for (let i = 0;i<3;i++){
      rows.push(this.renderRow(i))
    }

    return <div>{rows}</div>
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
      move_coords : [[0,0],],
      selected_move: null,
      isReversed: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice()
    let move_coords = this.state.move_coords.slice(0, this.state.stepNumber + 1)
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X':'O'
    move_coords = move_coords.concat([calculate_coords(i)])
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
      selected_move:step
    })
  }

  invertPlayState(){
    this.setState({
      isReversed: !this.state.isReversed
    })
  }

  renderInvertButton(){
    return(
      <button onClick={() => this.invertPlayState()} >
          Invert
      </button>
    )
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const moves = history.map((step,move) => {
      const new_move = this.state.isReversed ? (this.state.history.length-move-1):move 
      const move_col = this.state.move_coords[new_move][0]
      const move_row = this.state.move_coords[new_move][1]
      const desc = new_move ?
        'Go to move (' + move_col +',' + move_row +')' :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(new_move)} 
          style = { (this.state.selected_move===new_move) ? { fontWeight: 'bold' } : { fontWeight: 'normal' }}>
          {desc}
          </button>
        </li>
      )
    })

    const reorder = this.renderInvertButton()

    let status
    if (winner){
      status = 'Winner: ' + current.squares[winner[0]]
    }else if (checkDraw(current.squares)){
      status = "It's a draw!"
    }else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X':'O')
    }
    return (
    <div className="game">
        <div className="game-board">
        <Board 
          squares = {current.squares}
          onClick = {(i) => this.handleClick(i)}
          winners = {winner}
        />
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        {reorder}
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
      return [a,b,c]
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

function checkDraw(squares){
  return !squares.includes(null)
}