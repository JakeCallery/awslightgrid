/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/JACEvent',
    'jac/utils/ObjUtils'
],
    function (JACEvent, ObjUtils) {
        return (function () {
            /**
             * Creates a ButtonUpdateFromUIEvent object
             * @extends {JACEvent}
             * @constructor
             */
            function ButtonUpdateFromUIEvent($type, $data) {
                //super
                JACEvent.call(this, $type, $data);
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(ButtonUpdateFromUIEvent, JACEvent);

            /** @const */ ButtonUpdateFromUIEvent.UPDATE = 'buttonUpdateFromUIEvent';

            //Return constructor
            return ButtonUpdateFromUIEvent;
        })();
    });
