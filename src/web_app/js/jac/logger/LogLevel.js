/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([],
function(){
    return (function(){
        var LogLevel = {
        };

	    /** @const */ LogLevel.INFO = 2;
		/** @const */ LogLevel.DEBUG = 4;
	    /** @const */ LogLevel.WARNING = 8;
	    /** @const */ LogLevel.ERROR = 16;
	    /** @const */ LogLevel.TRACKING = 32;
		/** @const */ LogLevel.ALL = (LogLevel.INFO | LogLevel.DEBUG | LogLevel.WARNING | LogLevel.ERROR | LogLevel.TRACKING);

	    LogLevel.getName = function($filter){
			var result = '';

		    if($filter & LogLevel.INFO){
			    if(result != ''){result += ',';}
			    result += 'INFO';
		    }

			if($filter & LogLevel.DEBUG){
				if(result != ''){result += ',';}
				result += 'DEBUG';
			}

		    if($filter & LogLevel.WARNING){
			    if(result != ''){result += ',';}
			    result += 'WARNING';
		    }

		    if($filter & LogLevel.ERROR){
			    if(result != ''){result += ',';}
			    result += 'ERROR';
		    }

		    if($filter & LogLevel.TRACKING){
			    if(result != ''){result += ',';}
			    result += 'TRACKING';
		    }

		    return result;

	    };

        //Return constructor
        return LogLevel;
    })();
});
