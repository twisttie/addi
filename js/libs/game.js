
define(['./phaser', './constants', './tetra', './bottombar'], function(Phaser, constants, Tetra, BottomBar){

  const game = new Phaser.Game(
    constants.WINDOW_WIDTH,
    constants.WINDOW_HEIGHT,
    Phaser.CANVAS,
    'rendered-game',
    {
      preload: preload,
      create: create,
      update: update
    }
  );

  /**
   * Global references to SPRITES.
   */
  var currentTetra;
  var bottomBar;
  var targetNumber;

  var FPS = 100;
  var frame = 0;

  /**
   * Global references to OBJECTS.
   */
  var _currentTetra;
  var _bottomBar;
  var _targetNumber;

  /**
   * Global control flags.
   */
  var EVENT = {
    FIRED: false // Handles when the user is allowed to have their input read
  }

  var fallingSpeed = 1;

  var startBitRotate = false;
  var rotateBits = 0;
  var bitSpeed = 5;

  var startTetraRotate = false;
  var rotateTetra = 0;
  var tetraSpeed = 5;

  var startLeftSlide = false;
  var leftSlide = 0;
  var startRightSlide = false;
  var rightSlide = 0;
  var slideSpeed = constants.GRID_SIZE/5;




  /**
   * Prerenders sprites and other assets.
   * @param {void}
   * @return {void}
   */
  function preload(){

    game.load.image('one', 'img/assets/sprites/one.png');
    game.load.image('zero', 'img/assets/sprites/zero.png');

    game.load.image('background', 'img/assets/sprites/background.png');
    //...
  }

  /**
   * Create sprites and assets onto the canvas.
   * @param {void}
   * @return {void}
   */
  function create(){
    var x, y;
    // Enable physics engine
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Set key listener
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    rightKey.onDown.add(shiftRight, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    leftKey.onDown.add(shiftLeft, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);

    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(rotate, this);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.SPACEBAR);

    // Background
    var backgroundLayer = game.add.group();
    backgroundLayer.z = 0;
    backgroundLayer.add(new Phaser.Sprite(game, 0, 0, 'background'));

    // Bottom Bar Model
    _bottomBar = new BottomBar(8);

    // Bottom Bar GUI
    bottomBar = game.add.group();
    bottomBar.enableBody = true;
    bottomBar.physicsBodyType = Phaser.Physics.ARCADE;
    bottomBar.x = constants.GRID_SIZE;
    bottomBar.z = 1;

    // Create the bottom bar on the screen based on its model
    initializeBottomBar();

    // Create the tetra piece
    createTetra();

  }

  function createTetra(){
    console.log('creating tetra');
    // Model tetra
    var leftMostLocation = parseInt(constants.GRID_WIDTH/2);//Always the center
    _currentTetra = new Tetra(0, 0);
    _currentTetra.leftMostLocation = leftMostLocation;
    // Create a random set of numbers for the empty tetra
    _currentTetra.initializeVirtualModel();

    // GUI tetra
    currentTetra = game.add.group();
    currentTetra.enableBody = true;
    currentTetra.physicsBodyType = Phaser.Physics.ARCADE;
    currentTetra.x = constants.GRID_SIZE*leftMostLocation;
    currentTetra.y = 0;
    currentTetra.z = 1;

    // Create the tetra (based on _currentTetra.getType() and _currentTetra.getRotationalState())
    generateTetra(_currentTetra.getType(), _currentTetra.getRotationalState());
  }

  /** @event-resolve
   * Updates each time a frame is rendered.
   * @param {void}
   * @return {void}
   */
  function update(){
    var speed = fallingSpeed;
    if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
      speed = fallingSpeed*10;
    }

    // Test for collision
    game.physics.arcade.overlap(currentTetra, bottomBar, collisionHandler, null, this);

    // rotate bits
    if(startBitRotate){
      currentTetra.children.map(function(bit){
        bit.angle -= bitSpeed;
      });
      if(++rotateBits >= (90/bitSpeed)){
        startBitRotate = false;
        rotateBits = 0;
        EVENT.FIRED = false;
      }
    }

    // rotate tetra
    if(startTetraRotate){
      currentTetra.angle += tetraSpeed;
      if(++rotateTetra >= (90/tetraSpeed)){
        startTetraRotate = false;
        rotateTetra = 0;
        EVENT.FIRED = false;
      }
    }

    // slide to left
    if(startLeftSlide){
      currentTetra.x -= slideSpeed;
      if(++leftSlide >= (constants.GRID_SIZE/slideSpeed)){
        startLeftSlide = false;
        leftSlide = 0;
        EVENT.FIRED = false;
      }
    }

    // slide to right
    if(startRightSlide){
      currentTetra.x += slideSpeed;
      if(++rightSlide >= (constants.GRID_SIZE/slideSpeed)){
        startRightSlide = false;
        rightSlide = 0;
        EVENT.FIRED = false;
      }
    }

    // Collision with the bottom of the window
    if(currentTetra.y < constants.WINDOW_HEIGHT + constants.GRID_SIZE){  
      currentTetra.y += speed;
    }
  }

  /** @event
   * Shifts the tetra to the left by 1 grid space.
   * @param {void}
   * @return {void}
   */
  function shiftLeft(){
    // Check for bounds on x axis
    if(_currentTetra.leftMostLocation >= 1){
      if(EVENT.FIRED) return;
      EVENT.FIRED = true;
      startLeftSlide = true;
      --_currentTetra.leftMostLocation;
    }
  }

  /** @event
   * Shifts the tetra to the left by 1 grid space.
   * @param {void}
   * @return {void}
   */
  function shiftRight(){
    // Check for bounds on x axis
    if(_currentTetra.leftMostLocation <= constants.GRID_WIDTH - _currentTetra.width-1){
      if(EVENT.FIRED) return;
      EVENT.FIRED = true;
      startRightSlide = true;
      ++_currentTetra.leftMostLocation;
    }
  }

  /** @event
   * Begins the rotating process of the tetra.
   * @param {void}
   * @return {void}
   */
  function rotate(){
    if(EVENT.FIRED) return;
    EVENT.FIRED = true;

    // Check to see if valid rotate on left x axis
    if(_currentTetra.leftMostLocation - constants.ROTATIONAL_OFFSET[_currentTetra.getType()][_currentTetra.getRotationalState()] < 0){
      EVENT.FIRED = false;
      return;
    }

    // Check to see if valid rotate on right x axis
    if(_currentTetra.leftMostLocation - constants.ROTATIONAL_OFFSET[_currentTetra.getType()][_currentTetra.getRotationalState()] > constants.GRID_WIDTH - _currentTetra.width-1){
      EVENT.FIRED = false;
      return;
    }

    startTetraRotate = true;
    startBitRotate = true;

    // Update leftMostLocation
    _currentTetra.leftMostLocation -= constants.ROTATIONAL_OFFSET[_currentTetra.getType()][_currentTetra.getRotationalState()];

    // Update tetra rotational state
    _currentTetra.rotationalState = (_currentTetra.rotationalState + 1) % 4;
    _currentTetra.updateWidth();
  }

  /** @event
   * Instantly rotates the tetra when its created.
   * @param {number} number * 90 deg to rotate
   * @return {void}
   */
  function bruteRotate(n){
    if(EVENT.FIRED) return;
    EVENT.FIRED = true;

    for(var i=0; i<n; ++i){

      currentTetra.angle += 90;
      currentTetra.children.map(function(bit){
        bit.angle -= 90;
      });

      if(!parseInt(_currentTetra.leftMostLocation)){
        throw new Error("_currentTetra.leftMostLocation is unset when attempting to brute rotate.");
      }

      // Update leftMostLocation
      _currentTetra.leftMostLocation -= constants.ROTATIONAL_OFFSET[_currentTetra.getType()][i];

      _currentTetra.updateWidth();

    }
    EVENT.FIRED = false;
  }

  /** @event
   * Begins the adding process with the bottom bar and the
   * tetra rows.
   * @param {void}
   * @return {void}
   */
  function collisionHandler(){
    if(EVENT.FIRED) return;
    EVENT.FIRED = true;

    _bottomBar.addToState(_currentTetra.calculateValue());

    // destroy old tetra values
    currentTetra.children.forEach(function(bit){
      bit.kill();
    });

    // destroy old bottom bar values
    bottomBar.children.forEach(function(bit){
      bit.kill();
    });

    // Reset round
    setTimeout(function(){
      createTetra();
      EVENT.FIRED = false;
    }, 500);

    initializeBottomBar();
  }


  /* Generating the bottom bar */

  function initializeBottomBar(){
    var i = constants.GRID_WIDTH-1,
        n = _bottomBar.state,
        iterations = constants.GRID_WIDTH;
    while(iterations--){
      if(n & 1){
        bottomBar.create((constants.GRID_SIZE*i)-constants.GRID_OFFSET, constants.WINDOW_HEIGHT-constants.GRID_SIZE+constants.GRID_OFFSET, 'one');
      }else{
        bottomBar.create((constants.GRID_SIZE*i)-constants.GRID_OFFSET, constants.WINDOW_HEIGHT-constants.GRID_SIZE+constants.GRID_OFFSET, 'zero');
      }
      n = n >> 1;
      --i;
    }

    bottomBar.children.forEach(function(bit){
      bit.width = constants.GRID_SIZE;
      bit.height = constants.GRID_SIZE;
      bit.anchor.setTo(0.5, 0.5);
    });
  }

  /* Generating a tetra */

  /**
   * Based on the current type and rotational state of the tetra, it is
   * drawn onto the board.
   * @param {type} the type of tetra
   * @param {rotationalState} the rotational state
   * @return {void}
   */
  function generateTetra(type, rotationalState){
    var x, y, sprite;
    switch(type){
      case 0:
        x = 0;
        y = -1;
        sprite = _currentTetra.rowStructure[0][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -1;
        sprite = _currentTetra.rowStructure[0][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 2;
        y = -1;
        sprite = _currentTetra.rowStructure[0][2] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -2;
        sprite = _currentTetra.rowStructure[1][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        switch(rotationalState){
          case 0:
            // do nothing
          break;
          case 1:
            bruteRotate(1);
          break;
          case 2:
            bruteRotate(2);
          break;
          case 3:
            bruteRotate(3);
          break;
          default:
            throw new Error("Invalid state in generateTetra");
        }
        break;
      case 1:
        x = 0;
        y = -1;
        sprite = _currentTetra.rowStructure[0][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -1;
        sprite = _currentTetra.rowStructure[0][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 2;
        y = -1;
        sprite = _currentTetra.rowStructure[0][2] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 3;
        y = -1;
        sprite = _currentTetra.rowStructure[0][3] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        switch(rotationalState){
          case 0:
            // do nothing
          break;
          case 1:
            bruteRotate(1);
          break;
          case 2:
            bruteRotate(2);
          break;
          case 3:
            bruteRotate(3);
          break;
          default:
            throw new Error("Invalid state in generateTetra");
        }
        break;
      case 2:
        x = 0;
        y = -1;
        sprite = _currentTetra.rowStructure[0][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -1;
        sprite = _currentTetra.rowStructure[0][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 0;
        y = -2;
        sprite = _currentTetra.rowStructure[1][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -2;
        sprite = _currentTetra.rowStructure[1][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        switch(rotationalState){
          case 0:
            // do nothing
          break;
          case 1:
            bruteRotate(1);
          break;
          case 2:
            bruteRotate(2);
          break;
          case 3:
            bruteRotate(3);
          break;
          default:
            throw new Error("Invalid state in generateTetra");
        }
        break;
      case 3:
        x = 0;
        y = -1;
        sprite = _currentTetra.rowStructure[0][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 0;
        y = -2;
        sprite = _currentTetra.rowStructure[1][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -2;
        sprite = _currentTetra.rowStructure[1][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -3;
        sprite = _currentTetra.rowStructure[2][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        switch(rotationalState){
          case 0:
            // do nothing
          break;
          case 1:
            bruteRotate(1);
          break;
          case 2:
            bruteRotate(2);
          break;
          case 3:
            bruteRotate(3);
          break;
          default:
            throw new Error("Invalid state in generateTetra");
        }
        break;
      case 4:
        x = 0;
        y = -1;
        sprite = _currentTetra.rowStructure[0][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 1;
        y = -1;
        sprite = _currentTetra.rowStructure[0][1] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 2;
        y = -1;
        sprite = _currentTetra.rowStructure[0][2] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        x = 0;
        y = -2;
        sprite = _currentTetra.rowStructure[1][0] ? 'one' : 'zero';
        currentTetra.create(constants.GRID_OFFSET+constants.GRID_SIZE*x, constants.GRID_OFFSET+constants.GRID_SIZE*y, sprite);
        switch(rotationalState){
          case 0:
            // do nothing
          break;
          case 1:
            bruteRotate(1);
          break;
          case 2:
            bruteRotate(2);
          break;
          case 3:
            bruteRotate(3);
          break;
          default:
            throw new Error("Invalid state in generateTetra");
        }
        break;
      default:
        throw new Error("Invalid type in generateTetra.\n"+type);
    }
    // Scale bits to grid size
    currentTetra.children.forEach(function(bit){
      bit.width = constants.GRID_SIZE;
      bit.height = constants.GRID_SIZE;
      bit.anchor.setTo(0.5, 0.5);
    });
  }

  return game;

});