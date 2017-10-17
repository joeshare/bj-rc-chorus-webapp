/**
 * 获取指定点的夹角弧度
 * @param originalX  原点x
 * @param originalY 原点y
 * @param pointX 某点x
 * @param pointY 某点y
 * @returns {number} 弧度
 */
exports.angle=(originalX, originalY, pointX, pointY)=>{
    var diff_x = pointX - originalX,
        diff_y = pointY - originalY,
    //返回角度,不是弧度 （Math.atan(diff_y/diff_x) 获取的是弧度）
        rad=Math.atan(diff_y/diff_x);
    return rad;
}
/**
 *
 * 根据原点坐标及弧度 获取新坐标点
 * @param orPos 原点坐标 {x,y}
 * @param rad 弧度 当rad 是0 时，新坐标点在原点右边水平位置 ，当rad 是PI/2时新坐标点在原点下方垂直位置 （是逆时针旋转）
 * @param radius 半径
 * @returns {{}}
 */
exports.getPosByRad=(orPos, rad, radius)=> {
    var x = radius * Math.cos(rad) + orPos.x,
        y = radius * Math.sin(rad) + orPos.y;
    return {
        x: x,
        y: y
    };
}
/**
 * 获取两点距离
 * @param bx
 * @param by
 * @param ex
 * @param ey
 * @returns {number}
 */
exports.distance=(bx, by, ex, ey)=> {
    var _x = Math.abs(bx - ex);
    var _y = Math.abs(by - ey);
    var sum = Math.pow(_x, 2) + Math.pow(_y, 2);
    return Math.sqrt(sum);
}
/**
 * 取整 （四舍五入）
 * @param num
 * @returns {*}
 */
exports.getInt=(num)=>{
    return (num+0.5)<<0;
}