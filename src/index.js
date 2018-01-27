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
  window.addEventListener("resize", () => {
    this.drawing.style.left = image.offsetLeft + "px";
    this.drawing.style.top = image.offsetTop + "px";
  });

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
  window.addEventListener("mousemove", () => {
    this.handleMouseMove();
  });
  this.startWave();
  this.startTwitch();
  this.startBlink();
}

Gopher.prototype.twitch = function() {
  const x = this.leftEye.x();
  const y = this.leftEye.cy();
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
    .after(() => {
      if (this.staring) {
        this.llEyelid.animate(50).move(x, y + 5);
      }
    });
};

Gopher.prototype.blink = function() {
  const lx = this.leftEye.x();
  const ly = this.leftEye.cy();
  const rx = this.rightEye.x();
  const ry = this.rightEye.cy();
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
  const lx = this.leftEye.x();
  const ly = this.leftEye.cy();
  const rx = this.rightEye.x();
  const ry = this.rightEye.cy();
  this.moveEyes(this.leftEye.cx(), this.leftEye.cy());
  this.llEyelid.animate(100).move(lx, ly + 5);
  this.ulEyelid.animate(100).move(lx, ly - 50);
  this.lrEyelid.animate(100).move(rx, ry + 5);
  this.urEyelid.animate(100).move(rx, ry - 50);
};

Gopher.prototype.wave = function(hand) {
  const handX = this.rightHand.x();
  const handY = this.rightHand.y();
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
  const scaleX = this.gopher.viewbox().width / this.svg.viewbox().width;
  const scaleY = this.gopher.viewbox().height / this.svg.viewbox().height;
  const localX = (event.pageX - this.drawing.offsetLeft) * scaleX;
  const localY = (event.pageY - this.drawing.offsetTop) * scaleY;

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

  const lcx = this.leftEye.cx();
  const lcy = this.leftEye.cy();
  const ldx = targetX - lcx;
  const ldy = targetY - lcy;
  const ll = Math.sqrt(ldx * ldx + ldy * ldy);
  const lnx = ll === 0 ? 0 : ldx / ll;
  const lny = ll === 0 ? 0 : ldy / ll;
  const rcx = this.rightEye.cx();
  const rcy = this.rightEye.cy();
  const rdx = targetX - rcx;
  const rdy = targetY - rcy;
  const rl = Math.sqrt(rdx * rdx + rdy * rdy);
  const rnx = rl === 0 ? 0 : rdx / rl;
  const rny = rl === 0 ? 0 : rdy / rl;

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
  const circleRadius = 400;
  const randomAngle = randomRange(0, 2 * Math.PI);
  const randomRadius = Math.sqrt(Math.random()) * circleRadius;
  const x = Math.cos(randomAngle) * randomRadius;
  const y = Math.sin(randomAngle) * randomRadius;
  const dur = randomRange(5, 600);
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
  const waveDelay = Math.floor(randomRange(3, 21) * 1000);
  this.waveTimeout = setTimeout(this.startWave.bind(this), waveDelay);
};

window.addEventListener("load", () => {
  const image = document.querySelector("img[data-gopher]");
  if (image) {
    new Gopher(image);
  }
});
