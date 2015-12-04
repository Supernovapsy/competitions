function test()
{
  state = {
    "history1": [],
    "history": [{"player":12345, "move": [0, 3]}],
    "grid1": [ [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null] ],
    "grid": [ ['x', 'x', 'x', 'o', null, null, null, null, null],
            ['x', null, null, 'x', 'x', 'x', null, null, null],
            [null, 'o', null, 'o', 'x', null, null, null, null],
            ['x', 'x', 'x', null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null] ],
    "marker": { "Supernovapsy": 'x', "randomOther": 'o' }
  };
  
  var history = state["history"];
  
  var grid = state["grid"];
  
  var marker = state["marker"];
  
  var myMarker = null;
  var opMarker = null;

  var blockSize = 9;
  var opts = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];

  var returnStr = function(BI, I) { return "[" + BI + " " + I + "]"; }

  var local_winning_moves = function(block_index, marker)
  {
    var open_squares = squaresOpen(grid[block_index]);
    var ret = [];
    for (var i = 0; i != open_squares.length; ++i)
    {
      var temp_block = grid[block_index].slice();
      temp_block[open_squares[i]] = marker;
      if (blockDecided(temp_block))
        ret.push(open_squares[i]);
    }
    return ret;
  }

  //var winning_combos_current

  var in_array = function(a, arr){
    for (var i = 0; i != arr.length; ++i)
    {
      if (arr[i] == a) {
        return true;
      }
    }
    return false;
  }

  var impetus = function(decided_blocks_we, decided_blocks_they)
  {
    var ret = 0;
    for (var i = 0; i != opts.length; ++i)
    {
      var opt_impetus = 0;
      for (var j = 0; j != opts[i].length; ++j)
      {
        if (in_array(opts[i][j], decided_blocks_we))
        {
          ++opt_impetus;
        }
        else if (in_array(opts[i][j], decided_blocks_they))
        {
          opt_impetus = 0;
          break;
        }
      }
      ret += opt_impetus;
    }
    return ret;
  }

  var impetus_change = function(decided_blocks_we, decided_blocks_they, block_to_win)
  {
    var temp = decided_blocks_we.slice()
    temp.push(block_to_win)
    return impetus(temp, decided_blocks_they) - impetus(decided_blocks_we, decided_blocks_they);
  }

  var append_non_duplicate = function(arr, append)
  {
    for (var i = 0; i != append.length; ++i)
      if (!in_array(append[i], arr))
        arr.push(append[i]);
    return arr;
  }

  var comp = function(a, b)
  {
    if (a[0] < b[0])
      return 1;
    else if (a[0] > b[0])
      return -1;
    return 0;
  }

  var get_ith_element = function(arr, j)
  {
    var ret = [];
    for (var i = 0; i != arr.length; ++i)
      ret.push(arr[i][j]);
    return ret;
  }

  var local_move_ranking = function(block_index)
  {
    var winning_moves = local_winning_moves(block_index, myMarker);
    var losing_moves = local_winning_moves(block_index, opMarker);
    append_non_duplicate(winning_moves, losing_moves);
    var open_squares = squaresOpen(grid[block_index]);
    var otherMoves = [];
    for (var i = 0; i != open_squares.length; ++i)
      otherMoves.push([impetus_change(squaresOcc(grid[block_index], myMarker), squaresOcc(grid[block_index], opMarker), open_squares[i]), open_squares[i]]);
    otherMoves.sort(comp);
    //console.log(otherMoves);
    otherMoves = get_ith_element(otherMoves, 1);
    //console.log(otherMoves);
    var ret = append_non_duplicate(winning_moves, otherMoves);
    //console.log(ret);
    return ret;
  }

  var blockDecided = function(block) {
    var won = false;
    for(var i = 0; i < opts.length; i++) {
      var o = opts[i];
      if(block[o[0]] != null && block[o[0]] == block[o[1]] && block[o[0]] == block[o[2]]) {
        return true;
      }
    };
    return false;
  };

  var squaresOcc = function(block, marker)
  {
    var ret = [];
    for (var i = 0; i != block.length; ++i)
    {
      if (block[i] == marker)
      {
        ret.push(i);
      }
    }
    return ret;
  }

  var blockIndicesOpen = function()
  {
    var ret = [];
    for (var i = 0; i != grid.length; ++i)
    {
      if (!blockDecided(grid[i]))
      {
        ret.push(i);
      }
    }
    return ret;
  };

  var squaresOpen = function(block)
  {
    var ret = [];
    for (var i = 0; i != block.length; ++i)
      if (block[i] == null)
        ret.push(i);
    return ret;
  };

  var rnfip = function(arr)
  {
    for (var i = 0; i != arr.length; ++i)
    {
      if (arr[i] != 4)
        return arr[i];
    }
    return arr[0];
  }
  
  if (history.length == 0)
  {
    return returnStr(4, 4);
  }
  else
  {
    if (history.length % 2 == 1)
    {
      opFirstMove = history[0]["move"];
      opMarker = grid[opFirstMove[0]][opFirstMove[1]];
      if (opMarker == 'x')
        myMarker = 'o';
      else
        myMarker = 'x';
    }
    else
    {
      myFirstMove = history[0]["move"];
      myMarker = grid[myFirstMove[0]][myFirstMove[1]];
      if (myMarker == 'x')
        opMarker = 'o';
      else
        opMarker = 'x';
    }
    var last_move = history[history.length - 1]["move"];
    var bi = last_move[1]; // index to which the block is restricted if not free to play
    var free_to_play = blockDecided(grid[bi]);
    if (!free_to_play)
    {
      localRanking = local_move_ranking(bi)
      if (bi == 4)
        return returnStr(bi, localRanking[0]);
      else
        return returnStr(bi, rnfip(localRanking));
      
      //block_to_play = grid[bi];
      //open_squares = squaresOpen(block_to_play);
      // Minimum working bot:
      //return returnStr(bi, open_squares[0]);
    }
    else
    {
      open_blocks = blockIndicesOpen();
      if (blockDecided(grid[4]))
        block_to_play = open_blocks[0];
      else
        block_to_play = 4;
      localRanking = local_move_ranking(block_to_play)
      return returnStr(block_to_play, localRanking[0]);
      // Minimum working bot:
      //block_to_play = open_blocks[0];
      //open_squares = squaresOpen(grid[block_to_play]);
      //return returnStr(block_to_play, open_squares[0]);
    }
  }
}

console.log(test())

/*
If there is a winning move, make it.
Otherwise, try to win the centre square.
  If forced to make a move
    If in the centre, make the best move in the centre
    If not in the centre, make the move that tries to win a block that gives the best chances:
      That is: try to win the block which 

  Principles:
  Do not give the other bot a free move if possible.
  Do not make a centre square move for a block unless it makes the opponent win.
  Make the move which gives the most possibilities for winning.
    If can win some blocks which gives game winning potential 2, then try to win the block in that list which is the closest to winning (i.e. highest block winning potential)
    In general, try to win the block which gives the highest game-winning potentials.
      If there is a direct winning potential in a move, then try to win that square.
      If there is not a direct winning potential, then try to win the square which gives 

Rank of moves:

winning moves
winning moves of opponent
#critical moves
impetus moves which do not give opponent winning move, nor an impetus move of a higher value.
if current move is non-limiting, look at block with highest potential, else just look at block to which I am limited:
  for each local move:
    make the best local move in the block which
    1. Does not give opponent winning move
    2. Gives opponent a move in a block with a higher potential than the current.
losing moves

implementation:
local move ranking
locally_winning_moves(block, marker)
block_potential(decided_block_we, decided_block_they)
impetus_moves(restricted_block = null, locally_winning_moves, decided_blocks_we, decided_blocks_they) # returns a mapping of impetus moves to their impetus gained.
limiting_moves(restricted_block = null)
non_limiting_moves(restricted_block = null)
decided_blocks_for_marker(grid, marker)
winning_combos_current(decided_blocks_we, decided_blocks_they)
critical_blocks(winning_combos_current)
impetus(block_to_win, decided_block_we, winning_combos_current) returns total impetus AND highest impetus
#critical_moves(critical_blocks, restricted_block = null)
winning_moves(grid, restricted_block = null, decided_blocks_we, decided_blocks_they)
update_grid(opponent_marker)
in(a, arr) # if a is in the array arr
*/
