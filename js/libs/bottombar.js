
define(['./constants'], function(constants){
  
  /**
   * Generic bottom bar object constructor.
   * @param {number} starting value of the bottom bar
   * 
   */
  const BottomBar = function(start){
    if(typeof start !== 'undefined' && typeof start !== 'number'){
      throw new TypeError("Expected number as an argument in BottomBar constructor\nstart: "+start);
    }

    // The current value of the bottom bar in base 10
    // Initialized at zero unless otherwise specified
    this.state = start || 0;

    // This is the highest value the bottom bar can hold before
    // the state is reset to zero (with carry if implied)
    this.overflow = 2 << (constants.GRID_WIDTH - 1);

  }

  /**
   * Adds to the current state and handles overflow.
   * @param {number} the number to add to the state
   * @return {void}
   */
  BottomBar.prototype.addToState = function(numToAdd){
    if(typeof numToAdd !== 'number'){
      throw new Error("bruh");
    }
    console.log(this.state + " + " + numToAdd + " % " + this.overflow)
    this.state = (this.state + numToAdd) % this.overflow;
  }

  /**
   * Returns the current state of the bottom bar.
   * @param {void}
   * @return {state} the current state
   */
  BottomBar.prototype.getState = function(){
    return this.state;
  }

  return BottomBar;

});