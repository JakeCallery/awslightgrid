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
             * Creates a ButtonUpdateFromSocketEvent object
             * @extends {JACEvent}
             * @constructor
             */
            function ButtonUpdateFromSocketEvent($type, $data) {
                //super
                JACEvent.call(this, $type, $data);
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(ButtonUpdateFromSocketEvent, JACEvent);

            /** @const */ ButtonUpdateFromSocketEvent.UPDATE = 'buttonUpdateFromSocketUpdateEvent';

            //Return constructor
            return ButtonUpdateFromSocketEvent;
        })();
    });
