/*
Required fields and functions of a tool

class Tool {
    String uname; // unique name
    String displayName;

    onmousemove(event);
    onmouseout(event);
    onmouseup(event);
    onmousedown(event);

    // Draw data from its own tool
    // element = data received from a websocket
    drawElement(element);
}
*/

function Drawit() {
    this.tools = new Array();
    this.drawQueue = new Array();
}

Drawit.prototype.setTool = function(toolID) {
    var tool = drawit.tools[toolID];
    canvasmousemove  = function(e) { tool.onmousemove(e);   }
    canvasmouseout   = function(e) { tool.onmouseout(e);    }
    canvasmousedown  = function(e) { tool.onmousedown(e);   }
    canvasmouseup    = function(e) { tool.onmouseup(e);     }
    $("#toolSettings").html(tool.getSettingsMenu());
}

Drawit.prototype.addTool = function (tool) {
    this.tools[tool.displayName] = tool;

    // Add new button to the "toolbar"
    var newbtn = $('<input type="button" value="' + tool.displayName + '">');
    $(newbtn).click(function() {
        // This name must be the same as in the "tools"-map
        drawit.setTool(tool.displayName);
    });
    $('#tools').append(newbtn);
}

Drawit.prototype.addDrawingToQueue = function(drawing) {
    // Add drawing-element to drawing-queue
}

Drawit.prototype.executeDrawingQueue = function() {
    // loop through drawing-queue
}

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------
// SquareTool-klasse
var SquareTool = function() {};
SquareTool.prototype = {
    uname       : "SquareTool",
    displayName : "Square Tool",
    fill        : false,

    onmousedown: function(e) {
        var point = getMousePosition(e);
        this.mousedownx = point.x;
        this.mousedowny = point.y;
    },

    onmouseup: function(e) {
        var point = getMousePosition(e);

        var ctx = document.getElementById('canvas').getContext('2d');
        


        if(this.fill) {
            ctx.fillRect(
                this.mousedownx, 
                this.mousedowny, 
                point.x - this.mousedownx, 
                point.y - this.mousedowny
            );
        }
        else {
            ctx.strokeRect(
                this.mousedownx, 
                this.mousedowny, 
                point.x - this.mousedownx, 
                point.y - this.mousedowny
            );
        }
    },

    onmousemove: function(e) {
        // do nothing :S
        // Kanskje update og vise hvordan det vil se ut?
        // Hard t
    },

    onmouseout: function(e) {
        // Should return drawing-data as json.
    },

    drawElement: function(element) {

    },

    getSettingsMenu: function() {
        console.log(this.menudiv);
        if(this.menudiv == undefined) {
            this.menudiv = document.createElement("div");
            var label = jQuery("<label>").text("Fill");

            // Because when we enter a function, "this" is the function itself...
            var self = this;

            var input = $('<input />', { type: 'checkbox', value: 'Fill' })
            .change(function() {
                self.fill = !self.fill;
            }).appendTo(label);
            $(label).appendTo(this.menudiv);
        }

        return this.menudiv;
    }
};

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------
// Circle-tool
function CircleTool() {
    this.uname = "CircleTool";
    this.fill = false;
    this.displayName = "Circle Tool";
}

CircleTool.prototype.onmousedown = function(e) {
    var point = getMousePosition(e);
    this.mousedownx = point.x;
    this.mousedowny = point.y;
}

CircleTool.prototype.onmouseup = function(e) {
    var ctx = document.getElementById('canvas').getContext('2d');
    
    var point = getMousePosition(e);
    // Giddsje endre på det andre =\
    
    var x = this.mousedownx;
    var y = this.mousedowny;
    var w = point.x - x;
    var h = point.y - y;

    var kappa = .5522848,
        ox = (w / 2) * kappa, // control point offset horizontal
        oy = (h / 2) * kappa, // control point offset vertical
        xe = x + w,           // x-end
        ye = y + h,           // y-end
        xm = x + w / 2,       // x-middle
        ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.stroke();

    if(this.fill) {
        ctx.fill();
    }
}

CircleTool.prototype.drawElement = function(element) {
    // element = JSON-object
    // Execute drawing as 
}

CircleTool.prototype.onmousemove = function(e) {
    // do nothing :S
}

CircleTool.prototype.onmouseout = function(e) {
    // nutn elns.
    // Should return drawing-data as json.
}

CircleTool.prototype.getSettingsMenu = function() {
    if(this.menudiv == undefined) {
        this.menudiv = document.createElement("div");
        var label = jQuery("<label>").text("Fill");

        // Because when we enter a function, "this" is the function itself...
        var self = this;

        var input = $('<input />', { type: 'checkbox', value: 'Fill' })
        .change(function() {
            self.fill = !self.fill;
        }).appendTo(label);
        $(label).appendTo(this.menudiv);
    }

    return this.menudiv;
}

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------

// Selve drawit-objektet.
// Inneholder liste over tools og diverse annet kult
var drawit = new Drawit();

var squareTool = new SquareTool();
var circleTool = new CircleTool();

// Noen placeholders.
// Disse skal overrides av toolsene
// Blir kalt fra canvas-eventsene
var canvasmousemove = function(e) {},
    canvasmouseout = function(e){},
    canvasmouseup = function(e){},
    canvasmousedown = function(e){};

$(function() {
    var canvas = document.getElementById('canvas'),
            context = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
    }
    resizeCanvas();

    canvas.onmousemove = function(e) {
        canvasmousemove(e);
    }

    canvas.onmouseup = function(e) {
        canvasmouseup(e);
    }

    canvas.onmouseout = function(e) {
        canvasmouseout(e);
    }

    canvas.onmousedown = function(e) {
        canvasmousedown(e);
    }


    drawit.addTool(squareTool);
    drawit.addTool(circleTool);
})();

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getMousePosition(e) {
    var x = e.pageX  - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    
    return new Point(x, y);
}