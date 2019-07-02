/**
 * Created by ZhangJikai on 2016/12/5.
 */
(function () {
    cce.Circle = function (x, y, radius) {
        cce.DisplayObject.call(this);
        this.x = x || -1;
        this.y = y || -1;
        this.radius = radius || 0;
        this.minX = this.x - this.radius;
        this.rotate = oldRotate = 0;
        this.originCoord = this.oldOriginCoord = {
            x: this.x,
            y: this.y
        };
    };

    cce.Circle.prototype = Object.create(cce.DisplayObject.prototype);
    cce.Circle.prototype.constructor = cce.Circle;

    cce.Circle.prototype.draw = function () {
        var context = this.context,
            originCoord = this.originCoord;

        // todo 清除当前图形
        // context.save();
        // context.translate(this.oldOriginCoord.x, this.oldOriginCoord.y);
        // context.rotate(this.oldRotate);
        // context.clearRect(this.x - this.radius - 5, this.y - this.radius -5, this.radius * 2 + 6, this.radius * 2 + 6);
        // // context.arc(, this.y, this.radius, 0, Math.PI * 2, false);
        // context.restore();

        context.save();

        context.translate(originCoord.x, originCoord.y);
        context.rotate(this.rotate);

        context.beginPath();
        context.strokeStyle = "blue";
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();

        // 绘制箭头, 逆时针45度
        var inflectionX = Math.cos(-45 * Math.PI / 180) * this.radius,
            inflectionY = Math.sin(-45 * Math.PI / 180) * this.radius;
        inflectionX += this.x;
        inflectionY += this.y;

        var arrow1 = {
            x: Math.cos(-125 * Math.PI / 180) * 10 + inflectionX,
            y: Math.sin(-125 * Math.PI / 180) * 10 + inflectionY
        };

        var arrow2 = {
            x: Math.cos(-175 * Math.PI / 180) * 10 + inflectionX,
            y: Math.sin(-175 * Math.PI / 180) * 10 + inflectionY
        }

        context.beginPath();
        context.moveTo(inflectionX, inflectionY);
        context.lineTo(arrow1.x, arrow1.y);
        context.moveTo(inflectionX, inflectionY);
        context.lineTo(arrow2.x, arrow2.y);

        context.strokeStyle = "blue";
        context.stroke();
        context.closePath();

        context.restore();
    };

    cce.Circle.prototype.compareTo = function (target) {
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

    cce.Circle.prototype.comparePointX = function (point) {
        var ret = null;

        if (point.x == null) {
            ret = null;
        }

        var convertCoor = cce.convertCoor;
        
        var pointInCanvasAxis = convertCoor(point, this.originCoord, this.rotate);

        if (this.minX < pointInCanvasAxis.x) {
            ret = -1;
        }
        if (this.minX == pointInCanvasAxis.x) {
            ret = 0;
        }
        if (this.minX > pointInCanvasAxis.x) {
            ret = 1;
        }
        return ret;
    };

    cce.Circle.prototype.hasPoint = function (point) {

        if (point.x == null || point.y == null) {
            return false;
        }

        var convertCoor = cce.convertCoor;
        var pointInCanvasAxis = convertCoor(point, this.originCoord, this.rotate);
        
        var distance = Math.pow(pointInCanvasAxis.x - this.x, 2) + Math.pow(pointInCanvasAxis.y - this.y, 2) - Math.pow(this.radius, 2);
        if (distance < 0) {
            return true;
        } else {
            return false;
        }
    };

    cce.Circle.prototype.setOriginCoord = function(coord) {
        this.oldOriginCoord = this.originCoord;
        this.originCoord = coord;
    }

    cce.Circle.prototype.setRotate = function(rot) {
        this.oldRotate = this.rotate;
        this.rotate = rot;
    }

}());