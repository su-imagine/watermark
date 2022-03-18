    class WaterMark {
      angle = -20;
      text = "";
      defaultWrapperStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        "background-color": "transparent",
        // width: "100%",
        // height: "100%",
        "background-repeat": "repeat",
        "pointer-events": "none",
        overflow: "hidden"
      }
      constructor (text) {
        this.text = text;
      }

      getTextWrapperWidth(ca) {
        const ctx = ca.getContext("2d");
        ctx.font = "lighter 14px Microsoft YaHei";
        const width = ctx.measureText(this.text).width;
        this.textWidth = width * 2;
      }

      createWaterMark () {
        const canvas = document.createElement("canvas");
        canvas.width = 180 *3;
        canvas.height = 100 * 3;
        canvas.style.transform = "scale(0.333333333333333333)";
        const ctx = canvas.getContext("2d");

        ctx.fillStyle ="#c2c2c2";
        ctx.globalAlpha = 0.4;
        ctx.font = "lighter 14px Microsoft YaHei";
        ctx.rotate(Math.PI/180*this.angle);
        ctx.fillText(this.text,0,100);
        return canvas.toDataURL();
      }

      fill (el) {
        // const {width:wrapWidth,height:wrapHeight} = el.getBoundingClientRect();
        const wrapWidth = 3840;
        const wrapHeight = 2160
        console.log(wrapWidth);
        console.log(wrapHeight);
        const canvas = document.createElement("canvas");
        this.getTextWrapperWidth(canvas);
        const { textWidth } = this;
        
        const ctx = canvas.getContext("2d");
        // const radio = Math.ceil(window.devicePixelRatio);
        const radio = 3;
        console.log(ctx.auto);
        let r1 = 10;
        let r2 = 1
        const oldw = canvas.width;
        const oldh = canvas.height;
        console.log(oldw);
        console.log(oldh);
        canvas.width = wrapWidth * radio;
        canvas.height = wrapHeight * radio;
        canvas.style.width = wrapWidth + 'px';
        canvas.style.height = wrapHeight + 'px';
        const rowSum = Math.ceil(wrapWidth/textWidth);
        const colSum = Math.ceil(wrapHeight/textWidth);
        console.log(canvas.width)
        console.log(canvas.height)
        console.log(canvas.style.width)
        console.log(canvas.style.height)
        for(let i=0;i<rowSum;i++) {
          for(let j=0;j<colSum;j++) {
            if((i%2 === 0 && j%2 === 0) || (i%2 === 1 && j%2 === 1)) {
              ctx.save();
              ctx.translate(i*textWidth*radio, j*textWidth*radio);
              ctx.rotate(this.angle*Math.PI/180);
              ctx.scale(radio, radio);
              ctx.fillStyle ="#000";
              ctx.globalAlpha = 0.2;
              ctx.font = `lighter ${Math.ceil(14)}px Microsoft YaHei`;
              ctx.fillText(this.text,textWidth,20);
              ctx.restore();
            }
          }
        }

        // const canvasBg = canvas.toDataURL('image/png', 1);
        let wrapper = document.querySelector("#krame-watermark");
        if(!wrapper) {
          wrapper = document.createElement("div");
          wrapper.setAttribute("id", "krame-watermark");
          this.cssHelper(wrapper,this.defaultWrapperStyle);
        }
        // wrapper.style.backgroundImage = `url(${canvasBg})`;
        // el.insertBefore(wrapper, el.firstChild)
        // this.cssHelper(canvas,this.defaultWrapperStyle);
        const oldCanvas = wrapper.querySelector("canvas");
        if(oldCanvas) {
          wrapper.replaceChild(canvas, oldCanvas)
        }else{
          wrapper.appendChild(canvas)
        }
        el.appendChild(wrapper);
      }

      clear() {
        const wrapper = document.getElementById("krame-watermark");
        if (wrapper !== null && wrapper.parentElement !== null) {
          wrapper.parentElement.removeChild(wrapper);
        }
      }
      
      cssHelper (el, protoType) {
        for(const key in protoType) {
          el.style[key] = protoType[key];
        }
      }

      createHiDPICanvas(w, h, ratio) {
        const PIXEL_RATIO = (function () {
          const c = document.createElement("canvas"),
            ctx = c.getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx["webkitBackingStorePixelRatio"] ||
              ctx["mozBackingStorePixelRatio"] ||
              ctx["msBackingStorePixelRatio"] ||
              ctx["oBackingStorePixelRatio"] ||
              ctx["backingStorePixelRatio"] || 1;

          return dpr / bsr;
        })();

        if (!ratio) {
          ratio = PIXEL_RATIO;
        }
        const can = document.createElement("canvas");
        can.width = w * ratio;
        can.height = h * ratio;
        can.style.width = w + "px";
        can.style.height = h + "px";
        can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
        return can;
      }
    }