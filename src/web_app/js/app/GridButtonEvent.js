/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define(['jac/events/JacEvent', 'jac/utils/ObjUtils'],
    function (JacEvent, ObjUtils) {
        return (function () {
            /**
             * Creates a GridButtonEvent object
             * @extends {JacEvent}
             * @constructor
             */
            function GridButtonEvent($type) {
                //super
                JacEvent.call(this, $type);
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(GridButtonEvent, JacEvent);

            /** @const */ GridButtonEvent.ON = 'gridButtonOn';
            /** @const */ GridButtonEvent.OFF = 'gridButtonOff';

            //Return constructor
            return GridButtonEvent;
        })();
    });
