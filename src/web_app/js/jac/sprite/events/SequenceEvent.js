/**
 * Created with JetBrains PhpStorm.
 * User: Jake
 */

define([
'jac/events/JacEvent',
'jac/utils/ObjUtils'],
function(JacEvent,ObjUtils){
    return (function(){

	    SequenceEvent.LOOP_COMPLETE = 'SequenceEvent.LOOP_COMPLETE';
	    SequenceEvent.STOPPED = 'SequenceEvent.STOPPED';
	    SequenceEvent.COMPLETE = 'SequenceEvent.COMPLETE';


	    /**
         * Creates a SequenceEvent object
         * @extends {JacEvent}
         * @constructor
         */
        function SequenceEvent($type,$data){
            //super
            JacEvent.call(this,$type,$data);
        }
        
        //Inherit / Extend
        ObjUtils.inheritPrototype(SequenceEvent,JacEvent);
        
        //Return constructor
        return SequenceEvent;
    })();
});
