/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/EventDispatcher',
    'jac/utils/ObjUtils',
    'jac/logger/Logger',
    'jac/utils/DOMUtils',
    'jac/utils/EventUtils',
    'app/GridButtonEvent',
    'app/GridButton'
],
    function (EventDispatcher, ObjUtils, L, DOMUtils, EventUtils, GridButtonEvent, GridButton) {
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
                this.buttonGrid = [[]];

                this.buttonOnDelegate = EventUtils.bind(self, self.handleButtonOn);
                this.buttonOffDelegate = EventUtils.bind(self, self.handleButtonOff);
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(LGManager, EventDispatcher);

            var p = LGManager.prototype;

            p.initGrid = function($numCols, $numRows){
                var self = this;
                this.buttons = DOMUtils.getChildNodesByClassName(this.gridDivEl, "gridButton");
                L.log('Num Buttons: ' + this.buttons.length);

                for(var c = 0; c < $numCols; c++){
                    this.buttonGrid.push([]);
                    for(var r = 0; r < $numRows; r++){
                        this.buttonGrid[c].push({});
                    }
                }

                for(var i = 0; i < this.buttons.length; i++){
                    var buttonEl = this.buttons[i];
                    var button = new GridButton(buttonEl);
                    this.buttonGrid[button.col][button.row] = button;
                    button.addEventListener(GridButtonEvent.ON, self.buttonOnDelegate);
                    button.addEventListener(GridButtonEvent.OFF, self.buttonOffDelegate);
                }




            };

            p.handleButtonOn = function($e){
                L.log('Caught Button ON: ' + $e.target.col, $e.target.row);
            };

            p.handleButtonOff = function($e){
                L.log('Caught Button OFF: ' + $e.target.col, $e.target.row);
            };

            //Return constructor
            return LGManager;
        })();
    });
