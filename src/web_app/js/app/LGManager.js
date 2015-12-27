/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/EventDispatcher',
    'jac/utils/ObjUtils',
    'jac/logger/Logger',
    'jac/utils/DOMUtils'
],
    function (EventDispatcher, ObjUtils, L, DOMUtils) {
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

                this.window = $window;
                this.doc = $doc;
                this.buttons = [];
                this.gridDivEl = self.doc.getElementById("GridDiv");
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(LGManager, EventDispatcher);

            var p = LGManager.prototype;

            p.initGrid = function(){
                this.buttons = DOMUtils.getChildNodesByClassName(this.gridDivEl, "gridButton");
                L.log('Num Buttons: ' + this.buttons.length);
            };

            //Return constructor
            return LGManager;
        })();
    });
