/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/EventDispatcher',
    'jac/utils/ObjUtils',
    'jac/utils/EventUtils',
    'jac/logger/Logger',
    'app/GridButtonEvent'
],
    function (EventDispatcher, ObjUtils, EventUtils, L, GridButtonEvent) {
        return (function () {
            /**
             * Creates a GridButton object
             * @extends {EventDispatcher}
             * @constructor
             */
            function GridButton($buttonEl) {
                //super
                EventDispatcher.call(this);

                var self = this;
                this.state = GridButton.OFF_STATE;
                this.buttonEl = $buttonEl;
                this.arrayLoc = this.getButtonArrayLoc(this.buttonEl);
                this.col = this.arrayLoc.col;
                this.row = this.arrayLoc.row;

                this.handleClickDelegate = EventUtils.bind(self, self.handleButtonClick);
                EventUtils.addDomListener(this.buttonEl, 'click', this.handleClickDelegate);
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(GridButton, EventDispatcher);

            var p = GridButton.prototype;

            p.handleButtonClick = function($e){
                L.log('Button Clicked: ' + this.col + ',' + this.row);
                this.state = !this.state;
                if(this.state == GridButton.ON_STATE){
                    this.dispatchEvent(new GridButtonEvent(GridButtonEvent.ON));
                } else {
                    this.dispatchEvent(new GridButtonEvent(GridButtonEvent.OFF));
                }

            };


            p.getButtonArrayLoc = function($buttonEl){
                var bCol = parseInt($buttonEl.id.split('_')[0]);
                var bRow = parseInt($buttonEl.id.split('_')[1]);
                return {col:bCol, row:bRow};
            };

            /** @const */ GridButton.ON_STATE = true;
            /** @const */ GridButton.OFF_STATE = false;

            //Return constructor
            return GridButton;
        })();
    });
