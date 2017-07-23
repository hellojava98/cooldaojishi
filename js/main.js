/**
 * Created by Administrator on 2017/7/9.
 */

var WINDOW_WIDTN = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
//彩色小球
var balls = [];
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"]

/*
 1、const声明一个只读的常量。一旦声明，常量的值就不能改变。
 2、const声明的变量不得改变值，这意味着，const一旦声明变量，就必须立即初始化，不能留到以后赋值。
 3、const的作用域与let命令相同：只在声明所在的块级作用域内有效。
 */
//const endTime = new Date(2017, 6, 14, 16, 20, 10);
var endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000)

window.onload = function () {
    //屏幕自适应
    WINDOW_WIDTN= document.documentElement.clientWidth || document.body.clientWidth;
    WINDOW_HEIGHT=document.documentElement.clientHeight || document.body.clientHeight;
    MARGIN_LEFT=Math.round(WINDOW_WIDTN/10);
    RADIUS=Math.round(WINDOW_WIDTN*4/5/108)-1;
    MARGIN_TOP=Math.floor(WINDOW_HEIGHT/5);

    var canvas = document.getElementById('canvas');
    canvas.width = WINDOW_WIDTN;
    canvas.height = WINDOW_HEIGHT;

    var context = canvas.getContext('2d');
    //使用context绘制

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    //实现动画的基础函数
    setInterval(function () {
        render(context);
        update();
    }, 50);
};

//获取距离设定时间endTime的秒数
function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);

    return ret >= 0 ? ret : 0;
}

//时间的变化
function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    //下一次显示时间时、分、秒
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    //当前显示时间时、分、秒
    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;

    if (nextSeconds != curSeconds) {
        //彩色小球
        if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
            addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10))
        }
        if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
            addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10))
        }
        if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
            addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
        }
        if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
            addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
        }
        if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
            addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
        }
        if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
            addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();      //对已存在小球更新
    console.log(balls.length)
}

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.75;
        }
    }
    //清除滚出画布小球
    var cnt = 0
    for (var i = 0; i < balls.length; i++)
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTN)
            balls[cnt++] = balls[i]
    while (balls.length > Math.min(300,cnt)) {             //min(x,y) 返回 x 和 y 中的最低值。
        balls.pop();
    }
}
function addBalls(x, y, num) {

    for (var i = 0; i < digit[num].length; i++)
        for (var j = 0; j < digit[num][i].length; j++)
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -5,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }

                balls.push(aBall)
            }
}

function render(ctx) {
    ctx.clearRect(0, 0, WINDOW_WIDTN, WINDOW_HEIGHT);       //clearRect() 方法清空给定矩形内的指定像素。

    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60)
    var seconds = curShowTimeSeconds % 60

    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), ctx);                          //hours的十位数
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), ctx);      //hours的个位数
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, ctx);                        //冒号
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), ctx);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), ctx);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, ctx);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), ctx);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), ctx);

    //彩色小球绘制
    for (var i = 0; i < balls.length; i++) {
        ctx.fillStyle = balls[i].color

        ctx.beginPath()
        ctx.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI)
        ctx.closePath()

        ctx.fill();
    }
}

function renderDigit(x, y, num, ctx) {
    ctx.fillStyle = 'rgb(0,102,153)';
    for (i = 0; i < digit[num].length; i++)
        for (j = 0; j < digit[num][i].length; j++)
            if (digit[num][i][j] == 1) {
                ctx.beginPath();
                ctx.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                ctx.closePath();
                ctx.fill()
            }

}