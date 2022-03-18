var createCanvas =function(w,h){
  var c = document.createElement("canvas");
  c.width  = w;
  c.height = h;
  c.ctx    = c.getContext("2d");
 // document.body.appendChild(c);
  return c;
}

// converts pixel data into sub pixel data
var subPixelBitmap = function(imgData){
  var spR,spG,spB; // sub pixels
  var id,id1; // pixel indexes
  var w = imgData.width;
  var h = imgData.height;
  var d = imgData.data;
  var x,y;
  var ww = w*4;
  var ww4 = ww+4;
  for(y = 0; y < h; y+=1){
      for(x = 0; x < w; x+=3){
          var id = y*ww+x*4;
          var id1 = Math.floor(y)*ww+Math.floor(x/3)*4;
          spR = Math.sqrt(d[id + 0] * d[id + 0] * 0.2126 + d[id + 1] * d[id + 1] * 0.7152 + d[id + 2] * d[id + 2] * 0.0722);
          id += 4;
          spG = Math.sqrt(d[id + 0] * d[id + 0] * 0.2126 + d[id + 1] * d[id + 1] * 0.7152 + d[id + 2] * d[id + 2] * 0.0722);
          id += 4;
          spB = Math.sqrt(d[id + 0] * d[id + 0] * 0.2126 + d[id + 1] * d[id + 1] * 0.7152 + d[id + 2] * d[id + 2] * 0.0722);
          
          d[id1++] = spR;
          d[id1++] = spG;
          d[id1++] = spB;
          d[id1++] = 255;  // alpha always 255
      }
  }
  return imgData;
}

// Assume default textBaseline and that text area is contained within the canvas (no bits hanging out)
// Also this will not work is any pixels are at all transparent
var subPixelText = function(ctx,text,x,y,fontHeight){
  var width = ctx.measureText(text).width + 12; // add some extra pixels
  var hOffset = Math.floor(fontHeight *0.7);
  var c = createCanvas(width * 3,fontHeight);
  // c.ctx.font = ctx.font;
  ctx.font = `lighter ${60}px Microsoft YaHei`;
  ctx.globalAlpha = 0.2;
  c.ctx.fillStyle = ctx.fillStyle;
  c.ctx.fontAlign = "left";
  c.ctx.setTransform(3,0,0,1,0,0); // scale by 3
  // turn of smoothing
  c.ctx.imageSmoothingEnabled = false;    
  c.ctx.mozImageSmoothingEnabled = false;    
  // copy existing pixels to new canvas
  c.ctx.drawImage(ctx.canvas,x -2, y - hOffset, width,fontHeight,0,0, width,fontHeight );
  c.ctx.fillText(text,0,hOffset);    // draw thw text 3 time the width
  // convert to sub pixel 
  c.ctx.putImageData(subPixelBitmap(c.ctx.getImageData(0,0,width*3,fontHeight)),0,0);
  ctx.drawImage(c,0,0,width-1,fontHeight,x,y-hOffset,width-1,fontHeight);
  // done
}


var globalTime;
// render loop does the drawing
function update(timer) { // Main update loop
  globalTime = timer;
  ctx.setTransform(1,0,0,1,0,0); // set default
  ctx.globalAlpha= 1;
  ctx.fillStyle = "White";
  ctx.fillRect(0,0,canvas.width,canvas.height)
  ctx.fillStyle = "black";
  ctx.fillText("Canvas text is Oh hum "+ globalTime.toFixed(0),6,20);
  subPixelText(ctx,"Sub pixel text is best "+ globalTime.toFixed(0),6,45,25);
  div.textContent = "DOM is off course perfect "+ globalTime.toFixed(0);
  requestAnimationFrame(update);
}

function start(){
  document.body.appendChild(canvas);
  document.body.appendChild(div);
  ctx.font = "lighter 14px Microsoft YaHei";
  ctx.globalAlpha = 0.2;
  requestAnimationFrame(update);  // start the render
}

var canvas = createCanvas(512,50); // create and add canvas
var ctx = canvas.ctx;  // get a global context
var div = document.createElement("div");
div.style.font = "20px Arial";
div.style.background = "white";
div.style.color = "black";
if(devicePixelRatio !== 1){
 var dir = "in"
 var more = "";
 if(devicePixelRatio > 1){
     dir = "out";
 }
 if(devicePixelRatio === 2){
     div.textContent = "Detected a zoom of 2. You may have a Retina display or zoomed in 200%. Please use the snippet below this one to view this demo correctly as it requiers a precise match between DOM pixel size and display physical pixel size. If you wish to see the demo anyways just click this text. ";
     more = "Use the demo below this one."
 }else{
     div.textContent = "Sorry your browser is zoomed "+dir+".This will not work when DOM pixels and Display physical pixel sizes do not match. If you wish to see the demo anyways just click this text.";
     more = "Sub pixel display does not work.";
 }
  document.body.appendChild(div);
  div.style.cursor = "pointer";
  div.title = "Click to start the demo.";
  div.addEventListener("click",function(){          
      start();
      var divW = document.createElement("div");
      divW.textContent = "Warning pixel sizes do not match. " + more;
      divW.style.color = "red";
      document.body.appendChild(divW);
  });

}else{
  start();
}