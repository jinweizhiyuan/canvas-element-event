/**
 * Created by ZhangJikai on 2016/12/5.
 */

(function() {
    cce.Polygon = function(points) {
        cce.DisplayObject.call(this);
        this.points = points || null;
        this.minX = 0;
        if (points != null) {
            this.minX = points[0].x;
            for (var i = 0; i < points.length; i++) {
                if (this.minX > points[i].x) {
                    this.minX = points[i].x;
                }
            }
        }
    };

    cce.Polygon.prototype = Object.create(cce.DisplayObject.prototype);
    cce.Polygon.prototype.constructor = cce.Polygon;

    cce.Polygon.prototype.addPoint = function(point) {
        if (!this.points) {
            this.points = [];
        }
        var firstPoints = this.points[0];
        if (this.points.length > 2 && Math.abs(point.x - firstPoints.x) <= 10 && Math.abs(point.y - firstPoints.y) <= 10) {
            this.points.push({ x: firstPoints.x, y: firstPoints.y });
            return false;
        } else {
            this.points.push(point);
            return true;
        }
    }

    cce.Polygon.prototype.removePoint = function(point) {
        if (this.points && this.points.length) {
            this.points.splice(this.points.length - 1, 1);
        }
    }

    cce.Polygon.prototype.getPoints = function() {
        if (this.points && this.points.length) {
            return this.points.slice(0, -1);
        } else {
            return null;
        }
    }

    cce.Polygon.prototype.isClosePath = function() {
        if (this.points && this.points.length) {
            var len = this.points.length,
                lastPoint = this.points[len - 1],
                firstPoint = this.points[0];
            if (len > 2 && lastPoint.x == firstPoint.x && lastPoint.y == firstPoint.y) {
                return true;
            }
        }
        return false;
    }

    cce.Polygon.prototype.move = function(dx, dy) {
        var points = this.points;
        if (points && points.length) {
            for (var i = 0, len = points.length; i < len; i++) {
                var point = points[i];
                point.x += dx, point.y += dy;
            }
        }
    }

    cce.Polygon.prototype.draw = function() {
        if (this.points == null || !this.points.length) {
            return;
        }

        var i = 0;
        this.context.save();
        this.context.strokeStyle = "red";
        this.context.shadowColor = 'yellow';
        this.context.shadowBlur = 3;
        this.context.beginPath();

        this.context.moveTo(this.points[0].x, this.points[0].y);
        for (i = 0; i < this.points.length; i++) {

            this.context.lineTo(this.points[i].x, this.points[i].y);
            this.context.fillRect(this.points[i].x - 2, this.points[i].y - 2, 4, 4);
        }

        if (this.isClosePath()) {
            this.context.closePath();
        }
        this.context.stroke();
        this.context.restore();
    };

    cce.Polygon.prototype.compareTo = function(target) {

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

    cce.Polygon.prototype.comparePointX = function(point) {

        if (point.x == null) {
            return null;
        }
        if (this.minX < point.x) {
            return -1;
        }
        if (this.minX == point.x) {
            return 0;
        }
        if (this.minX > point.x) {
            return 1;
        }
    }


    cce.Polygon.prototype.hasPoint = function(target) {
        if (target.x == null || target.y == null) {
            return false;
        }
        var isIn = false;

        this.context.save();
        this.context.beginPath();

        this.context.moveTo(this.points[0].x, this.points[0].y);

        for (var i = 1; i < this.points.length; i++) {
            this.context.lineTo(this.points[i].x, this.points[i].y);
        }

        if (this.context.isPointInPath(target.x, target.y)) {
            isIn = true;
        }
        this.context.closePath();
        this.context.restore();
        return isIn;

    };


}());