/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var LoopStyle = {};

	    LoopStyle.LOOP = 0;
	    LoopStyle.BOUNCE = 1;
	    LoopStyle.STOP = 2;
	    LoopStyle.RESET = 3;
	    LoopStyle.ONCE = 4;

        
        //Return constructor
        return LoopStyle;
    })();
});
