
//============ CLASS POINT ================

function Point(x, y, isReal, name) {
    this.x = x;
    this.y = y;
    this.isReal = isReal;
    this.color = "#000";
    this.name = (name == null) ? '': name;
}

Point.prototype.setColor = function(color) {
    this.color = color;
};

//======== END OF CLASS POINT =============

//=========== CLASS LINE ==============

function Line(pointA, pointB, arrowHead, isReal) {
    this.pointA = pointA;
    this.pointB = pointB;
    this.x1 = pointA.x;
    this.y1 = pointA.y;
    this.x2 = pointB.x;
    this.y2 = pointB.y;
    this.color = "#000";
    this.isReal = isReal;
    this.arrowHead = arrowHead;
}

Line.prototype.setColor = function(color) {
    this.color = color;
};

Line.prototype.length = function() {
    var result = Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2);
    result = Math.sqrt(result);

    return result;
};

//=========== END OF CLASS LINE ==============

// =========== CLASS GRID ====================
function Grid(canvasObject, convert) {
    this.canvas = canvasObject;
    this.ctx = this.canvas.getContext("2d");
    this.convert = convert;
    this.init();
}

Grid.prototype.init = function() {
    this.x0 = this.canvas.height / 2;
    this.y0 = this.canvas.width / 2;
    this.ctx.font = "13px Georgia";
    this.drawGrid();
    this.drawXY();
};

// realX = (value * convert) + x0
Grid.prototype.convertX = function(value) { 
    value *= this.convert;
    
    return (this.x0 + value);
};

// realY = (value * convert) 
Grid.prototype.convertY = function(value) {
    value *= this.convert;
    
    return (this.y0 - value);
};

// x = (realX - x0) / convert
Grid.prototype.reconvertX = function(value) {
    value -= this.x0;
    return (-1) * (value / this.convert);
};

Grid.prototype.reconvertY = function(value) {
    value -= this.y0;
    return (-1) * (value / this.convert);
};

Grid.prototype.getCoordinateText = function(x, y) {
    return "(" + x + ", " + y + ")";
};

Grid.prototype.getCoordinateTextFromReal = function(realX, realY) {
    xNew = this.convertX(x);
    yNew = this.convertY(y);
    return this.getCoordinateText(xNew, yNew);
};

Grid.prototype.drawPoint = function(point) {
    if (point.isReal === true) {
        this.drawPointReal(point.x, point.y, point.color);
    } else {
        this.drawPoint2(point.x, point.y, point.color, point.name);
    }
};

Grid.prototype.drawPoint2 = function(x, y, color, name) {
    xNew = this.convertX(x);
    yNew = this.convertY(y);

    text = name+this.getCoordinateText(x, y);
    
    this.drawPointReal(xNew, yNew, color, text);
};

Grid.prototype.drawPointReal = function(realX, realY, color, text) {
    
    this.drawTextReal(text, realX, realY);
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(realX, realY, 2, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
    // this.ctx.fillRect(realX - 2, realY - 2, 4, 4); //draw point
};

Grid.prototype.drawText = function(text, point) {
    if (point.isReal === true) {
        this.drawTextReal(text, point.x, point.y);
    } else {
        this.drawText2(text, point.x, point.y);
    }
};

Grid.prototype.drawText2 = function(text, x, y) {
    xNew = this.convertX(x);
    yNew = this.convertY(y);
    this.drawTextReal(text, xNew, yNew);
};

Grid.prototype.drawTextReal = function(text, realX, realY) {
    this.ctx.fillText(text, realX + 1, realY - 1); // draw text
};

Grid.prototype.drawLine = function(line) {
    if (line.isReal === true) {
        this.drawLineReal(line.pointA.x, line.pointA.y, line.pointB.x, line.pointB.y, line.color, line.arrowHead);
    } else {
        this.drawLine2(line.pointA, line.pointB, line.color, line.arrowHead);
    }
};

Grid.prototype.drawLine2 = function(pointA, pointB, color, arrowHead) {
    this.drawLine3(pointA.x, pointA.y, pointB.x, pointB.y, color, arrowHead);
};

Grid.prototype.drawLine3 = function(x1, y1, x2, y2, color, arrowHead) {

    x1 = this.convertX(x1);
    y1 = this.convertY(y1);
    x2 = this.convertX(x2);
    y2 = this.convertY(y2);

    this.drawLineReal(x1, y1, x2, y2, color, arrowHead);
};

Grid.prototype.drawLineReal = function(realX1, realY1, realX2, realY2, color, arrowHead) {
    this.ctx.strokeStyle = color;
//    this.drawPointReal(realX1, realY1, "#000");
//    this.drawPointReal(realX2, realY2, "#000");

//    gambar garis
    this.ctx.beginPath();
    this.ctx.moveTo(realX1, realY1);
    this.ctx.lineTo(realX2, realY2);
    this.ctx.stroke();

    if (arrowHead === true) {
// this block of code is a credit to http://stackoverflow.com/questions/16025326/html-5-canvas-complete-arrowhead
        var endRadians = Math.atan((realY2 - realY1) / (realX2 - realX1));
        endRadians += ((realX2 > realX1) ? 90 : -90) * Math.PI / 180;
        this.drawArrowHead(realX2, realY2, endRadians);
// end of credit       
    }
};

// this block of code is a credit to http://stackoverflow.com/questions/16025326/html-5-canvas-complete-arrowhead
Grid.prototype.drawArrowHead = function(x, y, radians) {

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(x, y);
    this.ctx.rotate(radians);
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(5, 20);
    this.ctx.lineTo(-5, 20);
    this.ctx.closePath();
    this.ctx.restore();
    this.ctx.fill();
};
// end of credit

Grid.prototype.drawXY = function() {
    var pointA = new Point(0, this.canvas.height / 2, true);
    var pointB = new Point(this.canvas.width, this.canvas.height / 2, true);
    var lineX = new Line(pointA, pointB, false, true);
//    var lineX = new Line(0, this.canvas.height/2, this.canvas.width, this.canvas.height/2, this.ctx);
    lineX.setColor("#000");
    this.drawLine(lineX);
    this.drawLine(lineX);

    pointA = new Point(this.canvas.width / 2, 0, true);
    pointB = new Point(this.canvas.width / 2, this.canvas.height, true);
    var lineY = new Line(pointA, pointB, false, true);
//    var lineX = new Line(0, this.canvas.height/2, this.canvas.width, this.canvas.height/2, this.ctx);
    lineY.setColor("#000");
    this.drawLine(lineY);
    this.drawLine(lineY);

};

Grid.prototype.drawGrid = function() {
    var nilai = (this.canvas.width / this.convert) / 2;

    for (var i = 0; i <= this.canvas.width; i++) {
        if (i % this.convert === 0) {
            var lineX = new Line(new Point(i, 0), new Point(i, this.canvas.height), false, true);
            lineX.setColor("#AAA");
            this.drawLine(lineX);
            this.drawTextReal((-1) * nilai, i + 2, this.canvas.width / 2 - 3);

            var lineY = new Line(new Point(0, i), new Point(this.canvas.width, i), false, true);
            lineY.setColor("#AAA");
            this.drawLine(lineY);
            this.drawTextReal(nilai--, this.canvas.height / 2 + 3, i - 3);
        }
    }
};

Grid.prototype.lineAddition = function(line) {
    this.lineAddition2(line.pointA, line.pointB);
};

Grid.prototype.lineAddition2 = function(pointA, pointB) {
    this.lineAddition3(pointA.x, pointA.y, pointB.x, pointB.y);
};

//addition. membuat koordinat baru sebagai hasil jumlah 2 koordinat
Grid.prototype.lineAddition3 = function(x1, y1, x2, y2) {
    var ax = parseFloat(x2)+parseFloat(x1);
    var ay = parseFloat(y2)+parseFloat(y1);
    var p = new Point(ax, ay, false, "C");
    this.drawPoint(p);
    this.drawLine3(x1, y1, p.x, p.y, "red");
    this.drawLine3(x2, y2, p.x, p.y, "red");
};

Grid.prototype.lineSubstraction = function(line) {
    this.lineSubstraction2(line.pointA, line.pointB);
};

Grid.prototype.lineSubstraction2 = function(pointA, pointB) {
    this.lineSubstraction3(pointA.x, pointA.y, pointB.x, pointB.y);
};

//subtraction. membuat koordinat baru sebagai hasil kurang 2 koordinat
Grid.prototype.lineSubstraction3 = function(x1, y1, x2, y2) {
    var sx = parseFloat(x2)-parseFloat(x1);
    var sy = parseFloat(y2)-parseFloat(y1);
    var p = new Point(sx, sy, false, "D");
    this.drawPoint(p);
    this.drawLine3(x1, y1, p.x, p.y, "red");
    this.drawLine3(x2, y2, p.x, p.y, "red");
};

Grid.prototype.vectorAddition = function(lineA, lineB) {
    // body...
};

Grid.prototype.reflectionXAxis = function(line) {
    this.reflectionY(line, 0);
};

Grid.prototype.reflectionYAxis = function(line) {
    this.reflectionX(line, 0);
};

Grid.prototype.reflectionCenter = function(line) {
    this.reflectionXY(line, 0, 0);
};

//refleksi terhadap garis sejajar sumbu Y. mencari X baru
Grid.prototype.reflectionX = function(line, n) {
    var x1 = 2*n-parseFloat(line.x1);
    var x2 = 2*n-parseFloat(line.x2);
    var p1 = new Point(x1, line.pointA.y, false, "A'");
    var p2 = new Point(x2, line.pointB.y, false, "B'");
    this.drawPoint(p1);
    this.drawPoint(p2);
    this.drawLine2(p1, p2, "blue", false);
};

//refleksi terhadap garis sejajar sumbu X. mencari Y baru
Grid.prototype.reflectionY = function(line, n) {
    var y1 = 2*n-parseFloat(line.y1);
    var y2 = 2*n-parseFloat(line.y2);
    var p1 = new Point(line.pointA.x, y1, false, "A'");
    var p2 = new Point(line.pointB.x, y2, false, "B'");
    this.drawPoint(p1);
    this.drawPoint(p2);
    this.drawLine2(p1, p2, "blue", false);
};

//refleksi terhadap titik. mencari X dan Y baru
Grid.prototype.reflectionXY = function(line, x, y) {
    var x1 = 2*x-parseFloat(line.x1);
    var y1 = 2*y-parseFloat(line.y1);
    var x2 = 2*x-parseFloat(line.x2);
    var y2 = 2*y-parseFloat(line.y2);
    var p1 = new Point(x1, y1, false, "A'");
    var p2 = new Point(x2, y2, false, "B'");
    this.drawPoint(p1);
    this.drawPoint(p2);
    this.drawLine2(p1, p2, "blue", false);
};

Grid.prototype.clear = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.init();
};

// ============= END OF GRID CLASS ===============

window.onload = init;

var grid;
var convert = 25;
var p1, p2, line;
//var arr = new Array();

function init() {
    var canvas = get("myCanvas");
    grid = new Grid(canvas, convert);
    
    //listener untuk menambah titik A
    var bt1 = get('buttonTitik1');
    bt1.onclick = function() {
        var inputX = get('inputX1');
        var inputY = get('inputY1');
        
        var p = new Point(inputX.value, inputY.value, false, "A");
        grid.drawPoint(p);
        p1 = p;
        //arr.push(p);
    };
    
    //litener untuk menambah titik B
    var bt2 = get('buttonTitik2');
    bt2.onclick = function() {
        var inputX = get('inputX2');
        var inputY = get('inputY2');
        
        var p = new Point(inputX.value, inputY.value, false, "B");
        grid.drawPoint(p);
        p2 = p;
        //arr.push(p);
    };
    
    //listener untuk menambah garis
    var b1 = get('buttonGaris');
    b1.onclick = function() {
        if( p1!==null && p2!==null ) {
            line = new Line(p1, p2, false, false);
            grid.drawLine(line);
            var label = get('lblPanjang');
            label.innerHTML = "Panjang garis : "+line.length();
        }
    };
    
    //listener untuk addition p2+p1
    var b2 = get('buttonAddition');
    b2.onclick = function() {
        if( line!==null ) {
            grid.lineAddition(line);
        }
    };
    
    //listener untuk subtraction p2-p1
    var b3 = get('buttonSubtraction');
    b3.onclick = function() {
        if( line!==null ) {
            grid.lineSubstraction(line);
        }
    };
    
    //listener untuk refleksi garis terhadap sumbu X
    var brXA = get('buttonRefXAxis');
    brXA.onclick = function() {
        if( line!==null ) {
            grid.reflectionXAxis(line);
        }
    };
    
    //listener untuk refleksi garis terhadap sumbu Y
    var brYA = get('buttonRefYAxis');
    brYA.onclick = function() {
        if( line!==null ) {
            grid.reflectionYAxis(line);
        }
    };
    
    //listener untuk refleksi terhadap titik pusat
    var brC = get('buttonRefCenter');
    brC.onclick = function() {
        if( line!==null ) {
            grid.reflectionCenter(line);
        }
    };
    
    //listener untuk refleksi terhadap garis sejajar sumbu Y
    var brX = get('buttonRefX');
    brX.onclick = function() {
        if( line!==null ) {
            grid.reflectionX( line, get('inputRefX').value );
        }
    };
    
    //listener untuk refleksi terhadap garis sejajar sumbu X
    var brY = get('buttonRefY');
    brY.onclick = function() {
        if( line!==null ) {
            grid.reflectionY( line, get('inputRefY').value );
        }
    };
    
    //listener untuk refleksi terhadap titik
    var brXY = get('buttonRefXY');
    brXY.onclick = function() {
        if( line!==null ) {
            grid.reflectionXY( line, get('inputRefXY1').value, get('inputRefXY2').value );
//            grid.reflectionXY( line, -1, -1 );
        }
    };

    //listener untuk reset
    var br = get('reset');
    br.onclick = function() {
        p1 = null;
        p2 = null;
        line = null;
        grid.clear();
		//get('inputX2').value = "";
var inputgrup = document.getElementById('input-group');
var input = inputgrup.getElementsByTagName( 'input' );
//alert(input.length);
for ( var z = 0; z < input.length; z++ ) { 
        input[z].value = ""; 
    }

        // canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        // grid = new Grid(canvas, convert);
    };
}

function get(id) {
    return document.getElementById(id);
}
