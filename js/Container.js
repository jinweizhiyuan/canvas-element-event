/**
 * Created by ZhangJikai on 2016/12/3.
 */
(function () {
    cce.Container = function (canvas, center) {
        if (canvas == null) {
            throw Error("canvas can't be null");
        }
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");

        this._childs = [];

        /*if (center) {
            this.center = {x:this.canvas.width / 2, y:this.canvas.height /2 };
            this.context.translate(this.center.x, this.center.y);
        }*/

    };


    cce.Container.prototype = {
        constructor: cce.Container,

        addChild: function (displayObject) {
            displayObject.canvas = this.canvas;
            displayObject.context = this.context;
            this._childs.push(displayObject);
        },

        draw: function () {
            var canvas = this.canvas;
            //先清除画布
            this.context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
            this._childs.forEach(function (child) {
                child.draw();
            })
        },

        enableMouse: function () {
            var self = this;

            ["mouseover", "mousemove", "mousedown", "mouseup"].forEach(function(evtStr){
                self.canvas.addEventListener(evtStr, function (event) {
                    self._handleMouseMove(event, self);
                }, false);
            });
        },

        enableClick: function () {
            var self = this;
            this.canvas.addEventListener("click", function (event) {
                self._handleClick(event, self);
            }, false);
        },

        enableDrag: function() {
            var self = this;
            // ["dargstart", "darging", "dragend"]
            ["mousedown", "mousemove", "mouseup"].forEach(function(eventStr) {
                self.canvas.addEventListener(eventStr, function(event) {
                    self._handleDrag(event, self);
                }, false);
            })
        },

        _handleDrag: function(event, container) {
            var eventMap = {mousedown:"dragstart", mousemove:"draging", mouseup:"dragend"};
            var evtType = event.type,
                dragEvtType = eventMap[evtType];
            // 这里传入container 主要是为了使用 _windowToCanvas函数
            var point = container._windowToCanvas(event.clientX, event.clientY);

            var array, selectedElements = [];

            var enableDrag = this.enableDrag;

            if (evtType == 'mousedown') {
                enableDrag.mousedown = true;
                array = cce.EventManager.getTargets(dragEvtType);
                if (array != null) {
                    array.search(point);
                    // 鼠标所在的元素
                    selectedElements = array.selectedElements;
                }
                setTimeout(function() {
                    if (enableDrag.mousedown) {
                        enableDrag.draging = true;
                        selectedElements.forEach(function (ele) {
                            if (ele.hasListener(dragEvtType)) {
                                var event = new cce.Event(point.x, point.y, dragEvtType, ele);
                                ele.fire(dragEvtType, event);
                            }
                        });
                        enableDrag.target = selectedElements;
                    }
                }, 100)
            } else if (evtType == 'mousemove') {
                if (enableDrag.draging) {
                    enableDrag.target.forEach(function (ele) {
                        if (ele.hasListener(dragEvtType)) {
                            var event = new cce.Event(point.x, point.y, dragEvtType, ele);
                            ele.fire(dragEvtType, event);
                        }
                    });
                }
            } else if (evtType == 'mouseup') {
                if (enableDrag.draging) {
                    enableDrag.target.forEach(function (ele) {
                        if (ele.hasListener(dragEvtType)) {
                            var event = new cce.Event(point.x, point.y, dragEvtType, ele);
                            ele.fire(dragEvtType, event);
                        }
                    });
                }
                enableDrag.mousedown = enableDrag.draging = false;
            }
        },

        _handleMouseMove: function (event, container) {
            var evtType = event.type;
            // 这里传入container 主要是为了使用 _windowToCanvas函数
            var point = container._windowToCanvas(event.clientX, event.clientY);

            var array = cce.EventManager.getTargets("mouse");

            if (array != null) {
                array.search(point);
                // 鼠标所在的元素
                var selectedElements = array.selectedElements;
                // 鼠标不在的元素
                var unSelectedElements = array.unSelectedElements;
                selectedElements.forEach(function (ele) {
                    //修改上部分的内容
                   
                    if (ele.hasListener(evtType)) {
                        var event = new cce.Event(point.x, point.y, evtType, ele);
                        ele.fire(evtType, event);
                    }

                    if (!ele.inBounds) {
                        ele.inBounds = true;
                        if (ele.hasListener("mouseover")) {
                            var event = new cce.Event(point.x, point.y, "mouseover", ele);
                            ele.fire("mouseover", event);
                        }
                    }
                });

                unSelectedElements.forEach(function (ele) {
                    if (ele.inBounds) {
                        ele.inBounds = false;
                        if (ele.hasListener("mouseout")) {
                            var event = new cce.Event(point.x, point.y, "mouseout", ele);
                            ele.fire("mouseout", event);
                        }
                    }
                });
            }
        },


        _handleClick: function (event, target) {
            var point = target._windowToCanvas(event.clientX, event.clientY);

            var array = cce.EventManager.getTargets("click");
            if (array != null) {
                array.search(point);
                var selectedElements = array.selectedElements;
                selectedElements.forEach(function (ele) {
                    if (ele.hasListener("click")) {
                        var event = new cce.Event(point.x, point.y, "click", ele);
                        ele.fire("click", event);
                    }
                });

            }
        },

        _windowToCanvas: function (x, y) {
            var bbox = this.canvas.getBoundingClientRect();
            var pos = {
                x: x - bbox.left,
                y: y - bbox.top
            };

            /*if (this.center) {
                pos = {
                    x: pos.x - this.center.x,
                    y: pos.y - this.center.y
                };
            }*/

            return pos;
        }
    }
}());