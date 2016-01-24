define(['./constants'], function(constants){

  /**
   * Generic tetra object constructor.
   * @param {number} the type of tetra
   * @return {void}
   */
  const Tetra = function(type, state){

    // The type of tetra
    if(typeof type === 'number'){
      this.type = type;
    }else{
      this.type = Math.floor(Math.random() * 5);
    }

    // The current rotational state of the tetra
    if(typeof state === 'number'){
      this.rotationalState = state;
    }else{
      this.rotationalState = Math.floor(Math.random() * 4);
    }

    // The values of the tetra in any given rotational state
    this.valueAt = [0, 0, 0, 0];

    // For each row (bottom up) this will contain an array (left to right)
    // of what bits are stored in the actual tetra
    this.rowStructure = [];

    // The width of the current tetra in block units given its type and rotationalState
    this.width = constants.WIDTH[this.type][this.rotationalState];

    // The leftmost x location on the grid
    // bit shift << leftMostLocations-1
    this.leftMostLocation = undefined;
  }

  /**
   * Creates the virtual model of the tetra and populates the row
   * values for each rotational state.
   * @param {void} 
   * @return {void}
   */
  Tetra.prototype.initializeVirtualModel = function(){
    var _type = this.type;
    var _rstate = this.rotationalState;

    var tetraStructure = constants.BLOCKS_PER_ROW[_type];

    tetraStructure.map(function(bluePrint){
      var curRow = [];
      while(bluePrint--){
        curRow.push(Math.floor(Math.random() * 2));
      }
      this.rowStructure.push(curRow);
    }.bind(this));

  }

  Tetra.prototype.calculateValue = function(){
    var val = 0;
    var base = 0;
    switch(this.type){
      case 0:
        switch(this.rotationalState){
          case 0:
            // bottom row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[0].length; ++i){
              val += (this.rowStructure[0][i] * base);
              base = base >> 1;
            }
            // next row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-2);
            for(var i=0; i<this.rowStructure[1].length; ++i){
              val += (this.rowStructure[1][i] * base);
              base = base >> 1;
            }
            return val;
            break;
          default:
            throw new Error("Invalid rotationalState in Tetra.calculateValue");
        }
        break;
      case 1:
        switch(this.rotationalState){
          case 0:
            // bottom row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[0].length; ++i){
              val += (this.rowStructure[0][i] * base);
              base = base >> 1;
            }
            return val;
            break;
            default:
              throw new Error("Invalid rotationalState in Tetra.calculateValue");
        }
        break;
      case 2:
        switch(this.rotationalState){
          case 0:
            // bottom row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[0].length; ++i){
              val += (this.rowStructure[0][i] * base);
              base = base >> 1;
            }
            // next row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[1].length; ++i){
              val += (this.rowStructure[1][i] * base);
              base = base >> 1;
            }
            return val;
            break;
            default:
              throw new Error("Invalid rotationalState in Tetra.calculateValue");
        }
        break;
      case 3:
        switch(this.rotationalState){
          case 0:
            // bottom row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[0].length; ++i){
              val += (this.rowStructure[0][i] * base);
              base = base >> 1;
            }
            // next row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[1].length; ++i){
              val += (this.rowStructure[1][i] * base);
              base = base >> 1;
            }
            // next row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-2);
            for(var i=0; i<this.rowStructure[2].length; ++i){
              val += (this.rowStructure[2][i] * base);
              base = base >> 1;
            }
            return val;
            break;
            default:
              throw new Error("Invalid rotationalState in Tetra.calculateValue");
        }
        break;
      case 4:
        switch(this.rotationalState){
          case 0:
            // bottom row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[0].length; ++i){
              val += (this.rowStructure[0][i] * base);
              base = base >> 1;
            }
            // next row
            base = Math.pow(2, constants.GRID_WIDTH-this.leftMostLocation-1);
            for(var i=0; i<this.rowStructure[1].length; ++i){
              val += (this.rowStructure[1][i] * base);
              base = base >> 1;
            }
            return val;
            break;
            default:
              throw new Error("Invalid rotationalState in Tetra.calculateValue");
        }
        break;
      default:
        throw new Error("Invalid type in Tetra.calculateValue");
    }
  }

  /**
   * Updates offset when tetra moves left.
   * @param {void} 
   * @return {void}
   */
  Tetra.prototype.shiftLeft = function(){
    if(this.offset >= constants.GRID_WIDTH){
      throw new Error("Tetra attempted to go out of bounds on the left.");
    }
  }

  /**
   * Updates width of the tetra.
   * @param {void} 
   * @return {void}
   */
  Tetra.prototype.updateWidth = function(){
    this.width = constants.WIDTH[this.type][this.rotationalState];
  }

  /**
   * Updates offset when tetra moves right.
   * @param {void} 
   * @return {void}
   */
  Tetra.prototype.shiftRight = function(){
    if(this.offset < 0){
      throw new Error("Tetra attempted to go out of bounds on the right.");
    }
  }

  /**
   * This returns the total value of the tetra given its rotational
   * state.
   * @param {void} 
   * @return {number} the value given the rotational state
   */
  Tetra.prototype.getValue = function(){
    return this.valueAt[this.rotationalState];
  }

  /**
   * Returns the type of tetra.
   * @param {void} 
   * @return {number} the type of tetra
   */
  Tetra.prototype.getType = function(){
    return this.type;
  }

  /**
   * The rotational state of the tetra.
   * @param {void} 
   * @return {number} the rotational state
   */
  Tetra.prototype.getRotationalState = function(){
    return this.rotationalState;
  }

  return Tetra;

});