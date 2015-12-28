/**
 * Created with IntelliJ IDEA.
 * User: Jake
 */

define([
    'jac/events/EventDispatcher',
    'jac/utils/ObjUtils',
    'jac/utils/EventUtils',
    'jac/logger/Logger',
    'app/events/GridButtonEvent',
    'jac/utils/DOMUtils'
],
    function (EventDispatcher, ObjUtils, EventUtils, L, GridButtonEvent, DOMUtils) {
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
                DOMUtils.addClass(this.buttonEl, 'gridButtonDisplay');
                DOMUtils.addClass(this.buttonEl, 'deSelected');
                self.handleClickDelegate = EventUtils.bind(self, self.handleButtonClick);
                EventUtils.addDomListener(this.buttonEl, 'click', self.handleClickDelegate);
            }

            //Inherit / Extend
            ObjUtils.inheritPrototype(GridButton, EventDispatcher);

            var p = GridButton.prototype;

            p.handleButtonClick = function($e){
                var self = this;
                L.log('Button Clicked: ' + this.col + ',' + this.row);
                self.toggleState();
            };

            p.setState = function($state, $doNotify){
                var self = this;
                $doNotify = typeof $doNotify !== 'undefined' ? $doNotify : true;

                if($state != this.state){
                    this.state = $state;
                    L.log('' + this.state + ' / ' + this.col, this.row);
                    if(this.state == GridButton.ON_STATE){
                        DOMUtils.addClass(self.buttonEl, 'selected');
                        DOMUtils.removeClass(self.buttonEl, 'deSelected');
                        if($doNotify){
                            self.dispatchEvent(new GridButtonEvent(GridButtonEvent.ON));
                        }
                    } else {
                        DOMUtils.addClass(self.buttonEl, 'deSelected');
                        DOMUtils.removeClass(self.buttonEl, 'selected');
                        if($doNotify){
                            self.dispatchEvent(new GridButtonEvent(GridButtonEvent.OFF));
                        }
                    }
                }
            };

            p.toggleState = function(){
                this.setState(!this.state);
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
