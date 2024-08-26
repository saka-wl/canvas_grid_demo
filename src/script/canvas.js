
const imageEl = document.querySelector('#bg-image');
// 方格的画布
const touchCanvasEl = document.querySelector('#touch-canvas');
// 内容显示的画布（蓝色区域）
const contentCanvasEl = document.querySelector('#content-canvas')
const result = document.querySelector('.result');
const WIDTH = 800;
const HEIGHT = 600;
const GRID_COLOR = '#000000';
const GROUP_COLOR = 'rgb(197, 255, 255, 0.4)';
// 方格的边框大小
const GRID_LINE_WIDTH = 0.5;
// 每个方格大小
const GRID_WIDTH = 15;
let isDrawing = false;
// 当前选择的方框位置信息
let curRangle = [];
// canvas内所有方框的位置信息
const accRangle = [];

/**
 * 画方格
 * @param {*} canvasEl 
 * @param {*} gridSize 
 * @returns 
 */
function drawBlockLayer(canvasEl, gridSize) {
    const ctx = canvasEl.getContext('2d');
    if(!ctx) return;
    // 设置透明背景
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    // 设置线条样式
    ctx.strokeStyle = GRID_COLOR; // 线条颜色
    ctx.lineWidth = GRID_LINE_WIDTH; // 线条宽度
    /**
     * 横竖每隔10px画一条线,构成一个网格
     */
    for (let i = 0; i < canvasEl.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasEl.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvasEl.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvasEl.width, i);
        ctx.stroke();
    }
}

// 初始化画布
function initCanvas() {
    touchCanvasEl.height = HEIGHT;
    touchCanvasEl.width = WIDTH;
    contentCanvasEl.height = HEIGHT;
    contentCanvasEl.width = WIDTH;
    drawBlockLayer(touchCanvasEl, GRID_WIDTH);
}

// 获取当前鼠标的相对位置
function getClickPage(e, canvasEl) {
    const { left, top } = canvasEl.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = parseFloat(clientX - left);
    const y = parseFloat(clientY - top);
    return { x, y };
}

// 将区域在画布中画出来
const drawCanvas = (point, canvas, style = GROUP_COLOR) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        return;
    }
    ctx.fillStyle = style;
    ctx.fillRect(point[0][0], point[0][1], point[1][0] - point[0][0], point[1][1] - point[0][1]);
};

// 清空画布
const clearCanvas = (point, canvas) => {
    const ctx = canvas?.getContext('2d');
    if (!ctx) {
        return;
    }
    ctx.clearRect(0, 0, contentCanvasEl.width, contentCanvasEl.height);
    for(let item of accRangle) {
        drawCanvas(item, contentCanvasEl);
    }
}

function bindEvent() {
    touchCanvasEl.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const { x, y } = getClickPage(e, touchCanvasEl);
        curRangle[0] = [x, y];
    })
    touchCanvasEl.addEventListener('mousemove', (e) => {
        if(!isDrawing) return;
        const { x, y } = getClickPage(e, touchCanvasEl);
        if(curRangle[1]) clearCanvas(curRangle, contentCanvasEl);
        curRangle[1] = [x, y];
        drawCanvas(curRangle, contentCanvasEl);
    })
    touchCanvasEl.addEventListener('mouseup', (e) => {
        isDrawing = false;
        const { x, y } = getClickPage(e, touchCanvasEl);
        curRangle[1] = [x, y];
        accRangle.push(curRangle);
        drawCanvas(curRangle, contentCanvasEl);
        curRangle = [];
        result.innerHTML = accRangle;
    })
}

initCanvas();
bindEvent();