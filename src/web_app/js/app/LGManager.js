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
    'app/events/GridButtonEvent',
    'app/GridButton',
    'jac/events/GlobalEventBus',
    'app/events/ButtonUpdateFromUIEvent',
    'app/events/ButtonUpdateFromSocketEvent',
    'jac/utils/StringUtils'

],
    function (EventDispatcher,ObjUtils,L,DOMUtils,
              EventUtils,GridButtonEvent,GridButton,GEB,
              ButtonUpdateFromUIEvent, ButtonUpdateFromSocketEvent,
              StringUtils) {
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

                this.geb = new GEB();
                this.window = $window;
                this.doc = $doc;
                this.buttons = [];
                this.gridDivEl = self.doc.getElementById("GridDiv");
                this.buttonGrid = [[]];

                this.buttonOnDelegate = EventUtils.bind(self, self.handleButtonOn);
                this.buttonOffDelegate = EventUtils.bind(self, self.handleButtonOff);
                this.updateFromSocketDelegate = EventUtils.bind(self, self.handleUpdateFromSocket);
                this.geb.addEventListener(ButtonUpdateFromSocketEvent.UPDATE, this.updateFromSocketDelegate);
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
                L.log('Caught Button ON: ' + $e.target.col, $e.target.row, $e.target.state);
                this.geb.dispatchEvent(
                    new ButtonUpdateFromUIEvent(
                        ButtonUpdateFromUIEvent.UPDATE,
                        {
                            col:$e.target.col,
                            row:$e.target.row,
                            state:$e.target.state
                        }
                    )
                );
            };

            p.handleButtonOff = function($e){
                L.log('Caught Button OFF: ' + $e.target.col, $e.target.row, $e.target.state);
                this.geb.dispatchEvent(
                    new ButtonUpdateFromUIEvent(
                        ButtonUpdateFromUIEvent.UPDATE,
                        {
                            col:$e.target.col,
                            row:$e.target.row,
                            state:$e.target.state
                        }
                    )
                );
            };

            p.setButtonState = function($col, $row, $state){
                L.log('Setting Button State: ' + $state);
                this.buttonGrid[$col][$row].setState($state)
            };

            p.handleUpdateFromSocket = function($e){
                L.log('Caught Update From Socket: ');
                L.log($e.data);

                this.buttonGrid[$e.data.col][$e.data.row].setState(StringUtils.toBoolean($e.data.state), false);

            };
            //Return constructor
            return LGManager;
        })();
    });
