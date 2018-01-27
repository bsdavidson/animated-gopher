"use strict";
import SVG from "svgjs";
import svgData from "./gopher.svg";

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function Gopher(image) {
  image.style.visibility = "hidden";
  this.drawing = document.createElement("div");
  this.drawing.title = "Go";
  this.drawing.className = "tool";
  this.drawing.style.position = "absolute";
  document.body.appendChild(this.drawing);

  this.drawing.style.left = image.offsetLeft + "px";
  this.drawing.style.top = image.offsetTop + "px";
  window.addEventListener(
    "resize",
    function() {
      this.drawing.style.left = image.offsetLeft + "px";
      this.drawing.style.top = image.offsetTop + "px";
    }.bind(this)
  );

  this.svg = SVG(this.drawing);
  this.svg.svg(svgData);
  this.svg.size(image.width, image.height);

  this.gopher = this.svg.select("#Gopher").get(0);

  this.rightEye = this.svg.select("#rightsocket").get(0);
  this.rightPupil = this.svg.select("#rightpupil").get(0);
  this.leftEye = this.svg.select("#leftsocket").get(0);
  this.leftPupil = this.svg.select("#leftpupil").get(0);
  this.leftReflection = this.svg.select("#leftreflection").get(0);
  this.rightReflection = this.svg.select("#rightreflection").get(0);
  this.rightHand = this.svg.select("#righthand").get(0);
  this.staring = false;

  this.llEyelid = this.leftEye
    .parent()
    .rect(this.leftEye.width(), this.leftEye.height() / 2)
    .attr({fill: "#8CC5E7"})
    .move(this.leftEye.x(), this.leftEye.cy() + 20)
    .maskWith(this.leftEye.clone().attr({fill: "#fff"}));

  this.ulEyelid = this.leftEye
    .parent()
    .rect(this.leftEye.width(), this.leftEye.height() / 2)
    .attr({fill: "#8CC5E7"})
    .move(this.leftEye.x(), this.leftEye.cy() - 70)
    .maskWith(this.leftEye.clone().attr({fill: "#fff"}));

  this.lrEyelid = this.rightEye
    .parent()
    .rect(this.rightEye.width(), this.rightEye.height() / 2)
    .attr({fill: "#8CC5E7"})
    .move(this.rightEye.x(), this.rightEye.cy() + 20)
    .maskWith(this.rightEye.clone().attr({fill: "#fff"}));

  this.urEyelid = this.rightEye
    .parent()
    .rect(this.rightEye.width(), this.rightEye.height() / 2)
    .attr({fill: "#8CC5E7"})
    .move(this.rightEye.x(), this.rightEye.cy() - 70)
    .maskWith(this.rightEye.clone().attr({fill: "#fff"}));

  this.drawing.addEventListener("click", this.stare.bind(this));
  window.addEventListener("mousemove", this.handleMouseMove.bind(this));
  this.startWave();
  this.startTwitch();
  this.startBlink();
}

Gopher.prototype.twitch = function() {
  var x = this.leftEye.x();
  var y = this.leftEye.cy();
  this.llEyelid
    .finish()
    .animate(100)
    .move(x, y)
    .animate(50)
    .move(x, y + 5)
    .animate(50)
    .move(x, y)
    .animate(50)
    .move(x, y + 8)
    .animate(50)
    .move(x, y)
    .animate(100)
    .move(x, y + 20)
    .after(
      function() {
        if (this.staring) {
          this.llEyelid.animate(50).move(x, y + 5);
        }
      }.bind(this)
    );
};

Gopher.prototype.blink = function() {
  var lx = this.leftEye.x();
  var ly = this.leftEye.cy();
  var rx = this.rightEye.x();
  var ry = this.rightEye.cy();
  this.staring = false;

  this.llEyelid
    .finish()
    .animate(100)
    .move(lx, ly)
    .animate(100)
    .move(lx, ly + 40);

  this.ulEyelid
    .finish()
    .animate(100)
    .move(lx, ly - 40)
    .animate(100)
    .move(lx, ly - 80);

  this.lrEyelid
    .finish()
    .animate(100)
    .move(rx, ry)
    .animate(100)
    .move(rx, ry + 40);

  this.urEyelid
    .finish()
    .animate(100)
    .move(rx, ry - 40)
    .animate(100)
    .move(rx, ry - 80);
};

Gopher.prototype.stare = function() {
  this.staring = true;
  this.resetBlinkTimer();
  var lx = this.leftEye.x();
  var ly = this.leftEye.cy();
  var rx = this.rightEye.x();
  var ry = this.rightEye.cy();
  this.moveEyes(this.leftEye.cx(), this.leftEye.cy());
  this.llEyelid.animate(100).move(lx, ly + 5);
  this.ulEyelid.animate(100).move(lx, ly - 50);
  this.lrEyelid.animate(100).move(rx, ry + 5);
  this.urEyelid.animate(100).move(rx, ry - 50);
};

Gopher.prototype.wave = function(hand) {
  var handX = this.rightHand.x();
  var handY = this.rightHand.y();
  this.moveEyes(this.leftEye.cx(), this.leftEye.cy());
  this.rightHand
    .finish()
    .animate(300)
    .rotate(-150, handX, handY)
    .animate(200)
    .rotate(-110, handX, handY)
    .animate(200)
    .rotate(-150, handX, handY)
    .animate(300)
    .rotate(-1, handX, handY);
};

Gopher.prototype.handleMouseMove = function(event) {
  // Calculate the position of the mouse in coordinates local to the SVG,
  // rather than the global page coordinates.
  var scaleX = this.gopher.viewbox().width / this.svg.viewbox().width;
  var scaleY = this.gopher.viewbox().height / this.svg.viewbox().height;
  var localX = (event.pageX - this.drawing.offsetLeft) * scaleX;
  var localY = (event.pageY - this.drawing.offsetTop) * scaleY;

  // Make the eyes look at the cursor if it's close enough.
  if (
    Math.abs(localX - this.leftEye.cx()) < 350 &&
    Math.abs(localY - this.leftEye.cy()) < 350 &&
    !this.staring
  ) {
    this.moveEyes(localX, localY);
  }
};

Gopher.prototype.moveEyes = function(targetX, targetY, dur) {
  if (!dur) {
    dur = 50;
  }

  var lcx = this.leftEye.cx();
  var lcy = this.leftEye.cy();
  var ldx = targetX - lcx;
  var ldy = targetY - lcy;
  var ll = Math.sqrt(ldx * ldx + ldy * ldy);
  var lnx = ldx / ll;
  var lny = ldy / ll;
  if (ll === 0) {
    lnx = 0;
    lny = 0;
  }

  var rcx = this.rightEye.cx();
  var rcy = this.rightEye.cy();
  var rdx = targetX - rcx;
  var rdy = targetY - rcy;
  var rl = Math.sqrt(rdx * rdx + rdy * rdy);
  var rnx = rdx / rl;
  var rny = rdy / rl;
  if (rl === 0) {
    rnx = 0;
    rny = 0;
  }

  this.leftPupil
    .stop()
    .animate(dur, ">")
    .center(lcx + lnx * 12, lcy + lny * 12);
  this.rightPupil
    .stop()
    .animate(dur, ">")
    .center(rcx + rnx * 12, rcy + rny * 12);
  this.leftReflection
    .stop()
    .animate(dur, ">")
    .center(lcx + lnx * 6, lcy + lny * 6);
  this.rightReflection
    .stop()
    .animate(dur, ">")
    .center(rcx + rnx * 6, rcy + rny * 6);

  if (this.moveEyesTimeout) {
    clearTimeout(this.moveEyesTimeout);
  }
  this.moveEyesTimeout = setTimeout(this.moveEyesRandomly.bind(this), 2000);
};

Gopher.prototype.moveEyesRandomly = function() {
  var circleRadius = 400;
  var randomAngle = randomRange(0, 2 * Math.PI);
  var randomRadius = Math.sqrt(Math.random()) * circleRadius;
  var x = Math.cos(randomAngle) * randomRadius;
  var y = Math.sin(randomAngle) * randomRadius;
  var dur = randomRange(5, 600);
  if (!this.staring) {
    this.moveEyes(x, y, dur);
  }
};

Gopher.prototype.startTwitch = function() {
  this.twitch();
  if (this.twitchTimeout) {
    clearTimeout(this.twitchTimeout);
  }
  this.twitchTimeout = setTimeout(
    this.startTwitch.bind(this),
    randomRange(5000, 8000)
  );
};

Gopher.prototype.startBlink = function() {
  this.blink();
  this.resetBlinkTimer();
};

Gopher.prototype.resetBlinkTimer = function() {
  if (this.blinkTimeout) {
    clearTimeout(this.blinkTimeout);
  }
  this.blinkTimeout = setTimeout(
    this.startBlink.bind(this),
    randomRange(5000, 8000)
  );
};

Gopher.prototype.startWave = function() {
  if (!this.staring) {
    this.wave();
  }
  if (this.waveTimeout) {
    clearTimeout(this.waveTimeout);
  }
  var waveDelay = Math.floor(randomRange(3, 21) * 1000);
  this.waveTimeout = setTimeout(this.startWave.bind(this), waveDelay);
};

window.addEventListener("load", function() {
  var image = document.querySelector("img[data-gopher]");
  if (image) {
    new Gopher(image);
  }
});
