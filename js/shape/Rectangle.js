/**
 * Created by ZhangJikai on 2016/12/3.
 */
(function() {
    cce.Rectangle = function(x, y, width, height) {
        cce.DisplayObject.call(this);
        this.x = x || -1;
        this.y = y || -1;
        this.width = width || 0;
        this.height = height || 0;
        this.minX = this.x;
        this.rotate = oldRotate = 0;
        this.originCoord = this.oldOriginCoord = {
            x: this.width / 2 + this.x,
            y: this.height / 2 + this.y
        };
    };

    cce.Rectangle.prototype = Object.create(cce.DisplayObject.prototype);
    cce.Rectangle.prototype.constructor = cce.Rectangle;

    cce.Rectangle.prototype.draw = function() {
        var context = this.context;


        // todo 清除当前图形
        // context.save();
        // context.translate(this.oldOriginCoord.x, this.oldOriginCoord.y);
        // context.rotate(this.oldRotate);
        // context.clearRect(-this.width / 2 - 1, -this.height / 2 -1, this.width + 2, this.height + 2);
        // context.restore();

        // context.translate(-this.translate.x, -this.translate.y);
        // context.beginPath();
        // context.moveTo(0,0);
        // context.lineTo(this.width * 2, 0);
        // context.stroke();
        // context.moveTo(0,0);
        // context.lineTo(0, this.height*2);
        // context.stroke();

        context.save();
        context.shadowColor = 'yellow';
        context.shadowBlur = 3;
        // 用矩形的中心点为原点画图
        context.translate(this.originCoord.x, this.originCoord.y);
        context.rotate(this.rotate);
        context.strokeStyle = 'red';
        context.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        // context.strokeRect(this.x, this.y, this.width, this.height);

        context.restore();
        /* if (this.isRotate) {
             context.strokeStyle = "red";
             context.arc(this.x + this.width / 2, this.y - 10 - 1, 10, 0, Math.PI*2, false);
             context.stroke();
             context.strokeStyle = "black";
         }*/
    };

    /*cce.Rectangle.prototype.rotate = function (angle) {
        console.log(this.x + this.width / 2, this.y + this.height /2);
        if (this.isRotate) {
            var context = this.context;
            var center = {x:this.x + this.width / 2, y:this.y + this.height /2}
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            context.save();
            context.translate(center.x, center.y);
            context.rotate(Math.PI / 180 * angle);
            context.translate(-center.x, -center.y);
            this.draw();
            context.restore();
        }
        
    }*/

    cce.Rectangle.prototype.compareTo = function(target) {
        if (target.minX == null) {
            return null;
        }
        if (this.minX < target.minX) {
            return -1;
        }
        if (this.minX == target.minX) {
            return 0;
        }
        if (this.minX > target.minX) {
            return 1;
        }
        return null;
    };

    cce.DisplayObject.prototype.comparePointX = function(point) {

        var ret = null;
        if (point.x == null || point.y == null) {
            ret = null;
        } else {
            var originCoord = this.originCoord,
                rotate = this.rotate;
            var startPos = this.getPosition();
            var convertCoor = cce.convertCoor;

            var pointInCanvasAxis = convertCoor(point, originCoord, rotate);

            // console.log("==========comparePointX==========");
            // console.log("point", point);
            // console.log(originCoord, rotate);
            // console.log("startPos", startPos);
            // console.log("convertCoor", pointInCanvasAxis);

            if (startPos.x < pointInCanvasAxis.x) {
                ret = -1;
            }
            if (startPos.x == pointInCanvasAxis.x) {
                ret = 0;
            }
            if (startPos.x > pointInCanvasAxis.x) {
                ret = 1;
            }
        }

        // console.log(ret);
        return ret;
    };

    cce.Rectangle.prototype.hasPoint = function(point) {
        // console.log("==========hasPoint==========");
        var ret = false;
        if (point.x == null || point.y == null) {
            ret = false;
        } else {
            var originCoord = this.originCoord,
                rotate = this.rotate;
            var startPos = this.getPosition();
            var convertCoor = cce.convertCoor;

            var pointInCanvasAxis = convertCoor(point, originCoord, rotate);

            if (startPos.x + this.width >= pointInCanvasAxis.x && startPos.y <= pointInCanvasAxis.y && startPos.y + this.height >= pointInCanvasAxis.y) {
                ret = true;
            } else {
                ret = false;
            }
        }
        // console.log(ret);
        return ret;
    };

    cce.Rectangle.prototype.getPosition = function() {
        // console.log("==========getPosition==========");
        // 获取中心点，计算起始位置
        var originCoord = this.originCoord,
            rotate = this.rotate,
            convertCoor = cce.convertCoor;

        var startPos = convertCoor({ x: this.width / 2, y: this.height / 2 }, originCoord, rotate)
            // console.log(startPos);
        return { x: -this.width / 2, y: -this.height / 2 };
    };

    cce.Rectangle.prototype.setOriginCoord = function(coord) {
        this.oldOriginCoord = this.originCoord;
        this.originCoord = coord;
    }

    cce.Rectangle.prototype.setRotate = function(rot) {
        this.oldRotate = this.rotate;
        this.rotate = rot;
    }

}());