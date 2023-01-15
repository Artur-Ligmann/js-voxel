
var canvas = document.getElementById('myCanvas');
canvas.width = 400;
canvas.height = 300;
var lut = calculateLut(canvas.width, canvas.height);
var shift = 0;
var txt;
var txtWidth = 256;
var txtHeight = 256;

var ctx = canvas.getContext('2d');
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
var data = imageData.data;

// Generate the texture
var textureCanvas = document.createElement('canvas');
textureCanvas.width = txtWidth;
textureCanvas.height = txtHeight;
var textureCtx = textureCanvas.getContext('2d');

var textureData = textureCtx.createImageData(txtWidth, txtHeight);
var textureDataArray = textureData.data;

for (var i = 0; i < textureDataArray.length; i += 4) {
  textureDataArray[i] = Math.floor(Math.random() * 256);
  textureDataArray[i + 1] = Math.floor(Math.random() * 256);
  textureDataArray[i + 2] = Math.floor(Math.random() * 256);
  textureDataArray[i + 3] = 255;
}

textureCtx.putImageData(textureData, 0, 0);

txt = textureDataArray;

setInterval(draw, 10);

function createArray(width, height) {
    var iMax = width;
    var jMax = height;
    var f = new Array();

    for (i = 0; i < iMax; i++) {
        f[i] = new Array();
        for (j = 0; j < jMax; j++) {
            f[i][j] = null;
        }
    }
    return f;
}

function calculateLut(width, height)
{
    var result = createArray(width,height);

    var centerdX = width/2;
    var centeredY = height/2;

    for (var y = -centeredY; y < centeredY; y++) {
        for (var x = -centerdX; x < centerdX; x++) {
            var distance = Math.sqrt(x * x + y * y);
            var angle = Math.atan2(x,y)/ Math.PI;
            var sX = x + centerdX;
            var sY = y + centeredY;
            result[sX][sY] = {distance: distance, angle:angle};
        }
    }
    return result;
}


function draw() {

    var i = 0;

    var centerX = canvasWidth/2;
    var centerY = canvasHeight/2;
    var maximumDistance = Math.sqrt(centerX*centerX + centerX*centerY);
    for (var y = -centerY; y < centerY; y++) {
        for (var x = -centerX; x < centerX; x++) {
        var sX = x + centerX;
        var sY = y + centerY;
        var lutEntry = lut[sX][sY];
        var angle = lutEntry.angle;
        var distance = lutEntry.distance;
        var v = Math.floor( 64.0 * txtHeight / distance + shift) % (txtHeight-1);
        var u = Math.floor((angle + 1.0) * (txtWidth / 2) + shift) % txtWidth;

        var scan = (v * txtWidth + u) * 4;
        var normalizedDistance = distance / maximumDistance;

        data[i++] = txt[scan] * normalizedDistance;
        data[i++] = txt[scan + 1] * normalizedDistance;
        data[i++] = txt[scan + 2] * normalizedDistance;
        data[i++] = 255;
    }
}
ctx.putImageData(imageData, 0,0);
shift+=0.5;
}
