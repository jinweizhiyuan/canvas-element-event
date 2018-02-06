/**
 * Created by ZhangJikai on 2016/12/3.
 */
/** Canvas Element Event*/
var cce = cce || {
	convertCoor : function (P, center, rotate) {
        var x = P.x - center.x,
            y = P.y - center.y;

        if (rotate != 0) {
            var len = Math.sqrt(x * x + y * y);
            var oldR = Math.atan2(y, x); //屏幕坐标系中 PO与P点连线 与屏幕坐标系X轴的夹角弧度           
            var newR = oldR - rotate; //canvas坐标系中PO与P点连线 与canvas坐标系x轴的夹角弧度
            x = len * Math.cos(newR);
            y = len * Math.sin(newR);
        }
        return { x: x, y: y };
    }
};

