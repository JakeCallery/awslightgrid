/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/EventDispatcher',
    'jac/utils/ObjUtils',
    'jac/logger/Logger'
],
    function (EventDispatcher, ObjUtils, L) {
        return (function () {
            /**
             * Creates a LGManager object
             * @extends {EventDispatcher}
             * @constructor
             */
            function LGManager($window, $doc) {
                //super
                EventDispatcher.call(this);

                var self = this;

                //Public
                this.window = $window;
                this.doc = $doc;


            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(LGManager, EventDispatcher);

            var p = LGManager.prototype;

            p.createGrid = function(numCols, numRows){

            };

            //Return constructor
            return LGManager;
        })();
    });
