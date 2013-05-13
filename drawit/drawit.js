/*


Tool template


var ToolName = function() {}

ToolName.prototype = {

    uname : "ToolName",
    displayName : "Tool Name",
    icon: "IconURL",

    onmousedown : function(e) {},
    onmouseup : function(e) {},
    drawElement : function(element) { },
    onmousemove : function(e) {},
    onmouseout : function(e) {},
    getSettingsMenu : function() {}

};

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
    var newbtn = $('<input type="button" title="' + tool.displayName + '">');
    $(newbtn).click(function() {
        // This name must be the same as in the "tools"-map
        drawit.setTool(tool.displayName);

        $(".tool_button").each(function() {
            $(this).css('border', 'none');
        });

        $(this).css('border', 'solid 1px gray');
    }).addClass('tool_button')
    .css('background-image', "url(" + tool.icon + ")");

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
    icon        : "images/icons/square.png",

    onmousedown: function(e) {
        var point = getMousePosition(e);
        this.mousedownx = point.x;
        this.mousedowny = point.y;
    },
    onmouseup: function(e) {
        var point = getMousePosition(e);
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
    },
    onmouseout: function(e) {
        // Should return drawing-data as json.
    },
    drawElement: function(element) {

    },
    getSettingsMenu: function() {
        var menudiv = document.createElement("div");
        var label = jQuery("<label>").text("Fill");

        // Because when we enter a function, "this" is the function itself...
        var self = this;
        var input = $('<input />', 
        { 
            type: 'checkbox', 
            checked: self.fill,
            change: function() {
                self.fill = !self.fill;
            }
        }).appendTo(label);
        $(label).appendTo(menudiv);

        return menudiv;
    }
};

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------
// Circle-tool
var CircleTool = function() {}
CircleTool.prototype = {
    uname : "CircleTool",
    fill    : false,
    fillbg  : false,
    displayName : "Circle Tool",
    icon        : "images/icons/circle.png",

    onmousedown : function(e) {
        var point = getMousePosition(e);
        this.mousedownx = point.x;
        this.mousedowny = point.y;
    },
    onmouseup : function(e) {
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
            if(this.fillbg) {
                setFillColor(backgroundColor);
            }
            else {
                setFillColor(foregroundColor);
            }
            ctx.fill();
        }
    },
    drawElement : function(element) {
        // element = JSON-object
        // Execute drawing as 
    },
    onmousemove : function(e) {
        // do nothing :S
    },
    onmouseout : function(e) {
        // nutn elns.
        // Should return drawing-data as json.
    },
    getSettingsMenu : function() {
        var menudiv = document.createElement("div");
        var lblFillShape        = jQuery("<label>").text("Fill");
        var lblFillBackground   = jQuery("<label>").text("Fill bkg");

        // Because when we enter a function, "this" is the function itself...
        var self = this;

        var checkboxFillShape = $('<input />', 
        { 
            type: 'checkbox',
            checked: this.fill,
            change: function() {
                console.log("change fill");
                self.fill = !self.fill;
                if(self.fill) {
                    $(lblFillBackground).show();
                }
                else {
                    $(lblFillBackground).hide();
                }
            }
        }).appendTo(lblFillShape);
        
        var cbFillBackground = $('<input />', {
            type: 'checkbox',
            checked: this.fillbg,
            change: function() {
                console.log("change fillbg");
                self.fillbg = !self.fillbg;
            }
        }).appendTo(lblFillBackground);

        $(lblFillShape).appendTo(menudiv);
        $(lblFillBackground).appendTo(menudiv);
        
        if(!this.fill) {
            $(lblFillBackground).hide();
        }
        return menudiv;
    }
};

function setFillColor(color) {
    ctx.fillStyle = "#" + color;
}

function setStrokeColor(color) {
    ctx.strokeStyle = "#" + color;
}

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------
//Pencil
var PencilTool = function() {}

PencilTool.prototype = {

    uname : "PencilTool",
    displayName : "Pencil Tool",
    icon: "images/icons/pencil.png",

    onmousedown : function(e) {},
    onmouseup : function(e) {},
    drawElement : function(element) { },
    onmousemove : function(e) {},
    onmouseout : function(e) {},
    getSettingsMenu : function() {}
    
};

//---------------------------------------------------------
//---------------------------------------------------------
//---------------------------------------------------------
// Selve drawit-objektet.
// Inneholder liste over tools og diverse annet kult
var drawit = new Drawit();

var squareTool = new SquareTool();
var circleTool = new CircleTool();
var pencilTool = new PencilTool();
// Noen placeholders.
// Disse skal overrides av toolsene
// Blir kalt fra canvas-eventsene
var canvasmousemove = function(e) {},
    canvasmouseout = function(e){},
    canvasmouseup = function(e){},
    canvasmousedown = function(e){};

var canvas;
var ctx;

var foregroundColor;
var backgroundColor;

$(function() {
    canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    // window.addEventListener('resize', resizeCanvas, false);

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
    drawit.addTool(pencilTool);
    $("#colorSwapper").click(function() {
        var temp = foregroundColor;
        foregroundColor = backgroundColor;
        backgroundColor = temp;

        $("#foregroundColor").val(foregroundColor);
        $("#foregroundColor").css('background-color', foregroundColor);
        $("#backgroundColor").val(backgroundColor);
        $("#backgroundColor").css('background-color', backgroundColor);

        setFillColor(backgroundColor);
        setStrokeColor(foregroundColor);
    });

    $("#foregroundColor").change(function() {
        foregroundColor = this.value;
        setStrokeColor(foregroundColor);
    });

    $("#backgroundColor").change(function() {
        backgroundColor = this.value;
        setFillColor(backgroundColor);
    });

    backgroundColor = $("#backgroundColor").val();
    foregroundColor = $("#foregroundColor").val();

    $( "#draggable" ).draggable({ handle: "p" });

    $("#toolMenuWrapperMinimizeButton").click(function() {
        $("#toolMenuWrapper").toggle('fast');
    });

    $("#toolMenuHeader").mousedown(function(e) {
        this.point = getMousePosition(e);
    });

    $("#toolMenuHeader").mouseup(function(e) {
        var p = getMousePosition(e);

        if(this.point.x == p.x && this.point.y == p.y) {
            $("#toolMenuWrapper").toggle('fast');
        }
    });
})();

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getMousePosition(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    
    return new Point(x, y);
}