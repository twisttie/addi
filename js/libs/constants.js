define(function(){
  
  const constants = {
    WINDOW_WIDTH      : 400,
    WINDOW_HEIGHT     : 600,
    GRID_WIDTH        : 10,
    WIDTH             : [[3, 2, 3, 2], [4, 1, 4, 1], [2, 2, 2, 2], [2, 3, 2, 3], [3, 2, 3, 2]],
    ROTATIONAL_OFFSET : [[0, 3, -1, -2], [0, 4, -3, -1], [0, 2, 0, -2], [0, 2, 1, -3], [0, 3, -1, -2]],
    BLOCKS_PER_ROW    : [[3, 1], [4], [2, 2], [1, 2, 1], [3, 1]],
    BLOCK_MAPPING     : [[]]
  }

  constants.GRID_SIZE = constants.WINDOW_WIDTH/constants.GRID_WIDTH;
  constants.GRID_OFFSET = constants.GRID_SIZE/2;

  return constants;

});