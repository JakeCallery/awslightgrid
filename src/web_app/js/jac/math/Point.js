/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        /**
         * Creates a Point object
         * @param {Number} [$x=0]
         * @param {Number} [$y=0]
         * @constructor
         */
        function Point($x,$y){
	        if($x === undefined){$x = 0;}
	        if($y === undefined){$y = 0;}
	        this.x = $x;
	        this.y = $y;
        }
        
        
        //Return constructor
        return Point;
    })();
});
