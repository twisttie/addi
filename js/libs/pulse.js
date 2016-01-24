/*!
 // Pulse v1.1.0 | MIT 
 // Copyright (c) 2015 Nick Zuber <zuber.nicholas@gmail.com>
 */
 
define(function(){

    /*
     * Initialize Pulse object as a queue, initializing its bag (which will be holding the queued functions)
     * as an empty array, and sets the delay in milliseconds as either the parameter of type int or defaults 
     * the delay to zero. The delay will act as the timing between the functions in the bag firing.
     * @param {int}
     * @return {void}
     */
    var pulse = function queue(d){
      this.bag = []; // Empty array to be used to store the queued functions
      this.delay = d||0; // This particular object's delay between function firing
      return;
    };

    /*
     * Load in functions to push to the back of the queue. Wrap the function in another function in order to
     * control the firing and callback functions in the future when the user decides to start executing the
     * functions. We need this wrapping and callback method in order to properly fire the subsquent function
     * once the current function is finished firing.
     * @param {function}
     * @return {void}
     */
    pulse.prototype.push = function push(action){
      // Make sure that the user is passing in a function, if not then do not attempt to add and notify user.
      if(typeof action === 'function'){

        function loader(){

          // We create a loader function that returns another function which contains the callback as well
          // as the user's loaded function.
          return function(callback){
            action();
            callback();
          }
        }

        // Add this wrapping function to the object's array
        this.bag.push(loader);
        return;

      }

      console.error('Error: Only functions can be pushed into queues. \''+action+'\' was ignored.');
      return;
    };

    /*
     * This is where the event is dispatched which signals the Pulse object to begin executing its functions.
     * This function takes two parameters; a function that is to execute once the dispatch has finished, and
     * a boolean value that determines if the order of the bag of functions is to be flipped or not. The function
     * returns true if the function successfully fired every function and false if it was not able to. The functions
     * fire synchronously, waiting for the previous function to complete before moving onto the next, and also waiting
     * the additional time that the object's delay is set at.
     * @param {function, boolean}
     * @return {boolean}
     */
    pulse.prototype.dispatch = function dispatch(_callback, flipOrder){
      // If the _callback parameter is undefined, just set it to null and ignore
      typeof _callback==='undefined'?_callback=null:0;
      
      // If the flipOrder parameter is undefiner, just assume the user does not want the bag order flipped
      // and set it to false
      typeof flipOrder==='undefined'||flipOrder===null?flipOrder=false:0;
      
      // If the flipOrder is set to true, we want to flip the order of the object's bag array
      flipOrder?this.bag.reverse():0;
      
      // If there are no elements in the Pulse object's bag, then notify user and exit the function.
      if(this.bag.length<=0){
        console.warn('Warning: There are no elements in the queue to dispatch.');
        return false;
      }

      var obj = this; // Create a local reference of 'this' object so we have it in scope for other functions

      // This function will act as the parent wrapper function which we will be executing recursively
      // until the entire bag array of functions is executed and emptied.
      var execute = function(){

        // We set a delay for the delay which is set to this particular Pulse object
        setTimeout(function(){

          // Take the first element of the bag array and we are creating the callback function that was declared
          // when we were pushing this wrapper function into the bag. Each element is formatted like such:
          // 
          // function
          //   function(callback)
          //      action()
          //      callback()
          // 
          // As stated above, we are creating the callback that we are going to fire after the action() function
          // has completed firing.
          obj.bag[0]()(function(){

            // This deletes the first element in the bag array
            obj.bag.shift();

            // Check to see if we are finished with all the functions in the bag array, if so then fire the user's
            // callback and/or return true for success
            if(obj.bag.length<=0){
              if(typeof _callback === 'function'){
                _callback();
                return true;
              }
              else{
                return true;
              }
            }else{
              // If we still have elements left in the array bag, let's recursively exectute this execute() function again
              execute();
            }
          });
          
        }, obj.delay);
      }
      // Begin the recursive execute function
      this.bag.length>0?execute():0;
    };

    return pulse;

});