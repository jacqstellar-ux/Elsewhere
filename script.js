
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".enter");
  if (!button) return;

  let running = false;
  let styleAdded = false;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;700;900&family=Space+Mono:wght@400;700&display=swap');

    .reality {
      position: fixed;
      inset: 0;
      z-index: 999999;
      overflow: hidden;
      background: #030008;
      color: white;
      opacity: 0;
      visibility: hidden;
      font-family: 'Space Mono', monospace;
      isolation: isolate;
      transition: opacity .8s, visibility .8s;
    }

    .reality.on {
      opacity: 1;
      visibility: visible;
    }

    .reality * { box-sizing: border-box; }

    .r-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
    }

    .r-color {
      position: absolute;
      inset: -40%;
      background:
        radial-gradient(ellipse at 20% 30%, #5b00ff 0%, transparent 35%),
        radial-gradient(ellipse at 80% 60%, #ff005d 0%, transparent 30%),
        radial-gradient(ellipse at 50% 50%, #15002d 0%, transparent 60%);
      filter: blur(35px);
      opacity: .75;
      animation: colorUniverse 7s ease-in-out infinite alternate;
      z-index: -3;
    }

    .r-tunnel {
      position: absolute;
      width: 130vmax;
      height: 130vmax;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      border-radius: 50%;
      background: repeating-radial-gradient(
        circle,
        transparent 0 35px,
        rgba(255,255,255,.14) 36px 38px,
        transparent 39px 70px
      );
      mask-image: radial-gradient(circle, transparent 0%, black 70%);
      animation: tunnelSpin 12s linear infinite;
      opacity: .55;
      z-index: -1;
    }

    .r-lines {
      position: absolute;
      inset: -100%;
      background: repeating-linear-gradient(
        0deg,
        transparent 0 4px,
        rgba(255,255,255,.035) 5px 6px
      );
      animation: linesMove 5s linear infinite;
      pointer-events: none;
    }

    .r-flash {
      position: absolute;
      inset: 0;
      background: white;
      opacity: 0;
      pointer-events: none;
      z-index: 10;
    }

    .reality.blast .r-flash {
      animation: flashBlast 1.2s ease-out;
    }

    .r-top, .r-bottom {
      position: absolute;
      left: 0;
      width: 100%;
      height: 10vh;
      background: #020104;
      z-index: 5;
      transition: transform 1.5s cubic-bezier(.7,0,.2,1);
    }

    .r-top { top: 0; transform: translateY(-100%); }
    .r-bottom { bottom: 0; transform: translateY(100%); }

    .reality.on .r-top,
    .reality.on .r-bottom {
      transform: translateY(0);
    }

    .r-coordinate {
      position: absolute;
      top: 13vh;
      left: 7vw;
      font-size: 9px;
      letter-spacing: 3px;
      color: rgba(255,255,255,.55);
      z-index: 4;
    }

    .r-coordinate.right {
      left: auto;
      right: 7vw;
      text-align: right;
    }

    .r-title-wrap {
      position: absolute;
      width: 100%;
      left: 0;
      top: 50%;
      transform: translateY(-50%) scale(2.5);
      opacity: 0;
      text-align: center;
      z-index: 3;
      transition:
        transform 1.8s cubic-bezier(.16,1,.3,1),
        opacity 1.1s;
    }

    .reality.show-title .r-title-wrap {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }

    .r-pretitle {
      font-family: 'Space Mono', monospace;
      font-size: clamp(8px, 2vw, 11px);
      letter-spacing: .8em;
      color: #e1aaff;
      margin-bottom: 25px;
      animation: textFlicker 2s infinite;
    }

    .r-title {
      position: relative;
      display: inline-block;
      font-family: 'Unbounded', sans-serif;
      font-weight: 900;
      font-size: clamp(38px, 12vw, 145px);
      line-height: .9;
      letter-spacing: -.105em;
      white-space: nowrap;
      color: #fff;
      text-shadow:
        5px 0 #ff005c,
        -5px 0 #5900ff,
        0 0 30px #a000ff,
        0 0 100px #ff005c;
      animation: titleDistort 4s infinite;
    }

    .r-title::before,
    .r-title::after {
      content: "ASHTRËY";
      position: absolute;
      inset: 0;
      overflow: hidden;
      opacity: .65;
      pointer-events: none;
    }

    .r-title::before {
      color: #ff0055;
      transform: translate(-5px, 2px);
      clip-path: inset(15% 0 65% 0);
      animation: glitchOne 2.3s infinite steps(2);
    }

    .r-title::after {
      color: #00eaff;
      transform: translate(5px, -2px);
      clip-path: inset(60% 0 10% 0);
      animation: glitchTwo 1.7s infinite steps(2);
    }

    .r-subtitle {
      margin-top: 32px;
      font-size: 9px;
      letter-spacing: .55em;
      color: rgba(255,255,255,.7);
    }

    .r-word {
      position: absolute;
      font-family: 'Unbounded', sans-serif;
      font-weight: 900;
      font-size: clamp(25px, 7vw, 90px);
      color: rgba(255,255,255,.08);
      white-space: nowrap;
      pointer-events: none;
      z-index: 1;
    }

    .r-word.one {
      top: 20%;
      left: -10%;
      transform: rotate(-12deg);
      animation: wordOne 9s ease-in-out infinite alternate;
    }

    .r-word.two {
      bottom: 17%;
      right: -15%;
      transform: rotate(12deg);
      animation: wordTwo 8s ease-in-out infinite alternate;
    }

    .r-cat {
      position: absolute;
      z-index: 6;
      width: clamp(130px, 28vw, 270px);
      left: -35%;
      top: 65%;
      opacity: 0;
      filter: drop-shadow(0 0 25px #b76cff)
              drop-shadow(0 0 65px #ff006a);
      transform: translateY(-50%) rotate(-12deg) scale(.5);
      pointer-events: none;
    }

    .reality.cat-arrives .r-cat {
      animation: catFlight 4.5s cubic-bezier(.16,.7,.25,1) forwards;
    }

    .r-cat svg {
      display: block;
      width: 100%;
      overflow: visible;
    }

    .r-cat .tail {
      transform-origin: 20px 95px;
      animation: tailMove .7s ease-in-out infinite alternate;
    }

    .r-ring {
      position: absolute;
      width: 30vmin;
      height: 30vmin;
      border: 1px solid rgba(255,255,255,.6);
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%) scale(0);
      box-shadow: 0 0 80px #8b00ff, inset 0 0 80px #ff005d;
      opacity: 0;
      z-index: 2;
    }

    .reality.blast .r-ring {
      animation: ringBlast 3s cubic-bezier(.1,.8,.2,1) forwards;
    }

    .r-message {
      position: absolute;
      bottom: 19%;
      left: 0;
      width: 100%;
      text-align: center;
      font-family: 'Unbounded', sans-serif;
      font-size: clamp(10px, 2vw, 15px);
      letter-spacing: .35em;
      opacity: 0;
      transform: translateY(20px);
      transition: 1s;
      z-index: 8;
    }

    .reality.finished .r-message {
      opacity: 1;
      transform: translateY(0);
    }

    .r-enter {
      position: absolute;
      bottom: 8%;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      padding: 16px 23px;
      border: 1px solid rgba(255,255,255,.55);
      background: rgba(12,0,25,.6);
      backdrop-filter: blur(15px);
      color: white;
      font: inherit;
      font-size: 9px;
      letter-spacing: 3px;
      white-space: nowrap;
      opacity: 0;
      z-index: 12;
      cursor: pointer;
      transition: .8s;
    }

    .reality.finished .r-enter {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .r-enter:active {
      background: #8b00ff;
    }

    .r-counter {
      position: absolute;
      bottom: 13vh;
      left: 7vw;
      color: rgba(255,255,255,.45);
      font-size: 8px;
      letter-spacing: 3px;
    }

    .reality.shake {
      animation: screenShake .45s linear;
    }

    @keyframes colorUniverse {
      0% { transform: rotate(0deg) scale(.8); }
      100% { transform: rotate(25deg) scale(1.4); }
    }

    @keyframes tunnelSpin {
      to { transform: translate(-50%,-50%) rotate(360deg) scale(1.2); }
    }

    @keyframes linesMove {
      to { transform: translateY(40px); }
    }

    @keyframes flashBlast {
      0%,100% { opacity: 0; }
      8% { opacity: .9; }
      18% { opacity: 0; }
      35% { opacity: .4; }
    }

    @keyframes ringBlast {
      0% { opacity: 0; transform: translate(-50%,-50%) scale(0); }
      20% { opacity: 1; }
      100% { opacity: 0; transform: translate(-50%,-50%) scale(12); }
    }

    @keyframes titleDistort {
      0%, 100% { transform: skewX(0) scaleX(1); }
      20% { transform: skewX(-3deg) scaleX(1.04); }
      22% { transform: skewX(4deg) scaleX(.97); }
      24% { transform: skewX(0) scaleX(1); }
      70% { transform: skewX(1deg) scaleX(1.02); }
    }

    @keyframes glitchOne {
      0%, 85%, 100% { transform: translate(-5px,2px); }
      87% { transform: translate(12px,-4px); }
      89% { transform: translate(-10px,3px); }
    }

    @keyframes glitchTwo {
      0%, 75%, 100% { transform: translate(5px,-2px); }
      77% { transform: translate(-12px,5px); }
      79% { transform: translate(10px,-3px); }
    }

    @keyframes textFlicker {
      0%, 90%, 100% { opacity: 1; }
      92% { opacity: .1; }
      94% { opacity: .8; }
    }

    @keyframes wordOne {
      to { transform: translate(25vw,15vh) rotate(8deg); }
    }

    @keyframes wordTwo {
      to { transform: translate(-20vw,-12vh) rotate(-8deg); }
    }

    @keyframes catFlight {
      0% { left: -35%; opacity: 0; transform: translateY(-50%) rotate(-18deg) scale(.5); }
      12% { opacity: 1; }
      40% { transform: translateY(-65%) rotate(8deg) scale(1.15); }
      65% { transform: translateY(-35%) rotate(-7deg) scale(.95); }
      100% { left: 115%; opacity: 1; transform: translateY(-50%) rotate(15deg) scale(1.1); }
    }

    @keyframes tailMove {
      to { transform: rotate(22deg); }
    }

    @keyframes screenShake {
      0%,100% { transform: translate(0); }
      20% { transform: translate(-8px,5px); }
      40% { transform: translate(7px,-5px); }
      60% { transform: translate(-5px,-3px); }
      80% { transform: translate(6px,4px); }
    }

    @media (max-width: 600px) {
      .r-coordinate { top: 12vh; }
      .r-title { letter-spacing: -.09em; }
      .r-subtitle { letter-spacing: .25em; }
      .r-cat { top: 68%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .reality *, .reality {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
      }
    }
  `;

  function addStyle() {
    if (styleAdded) return;
    const tag = document.createElement("style");
    tag.textContent = css;
    document.head.appendChild(tag);
    styleAdded = true;
  }

  function makeStars(canvas) {
    const ctx = canvas.getContext("2d");
    let w, h, stars = [];
    let frame;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: 190 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        speed: Math.random() * 2 + .3,
        size: Math.random() * 1.7 + .3,
        hue: Math.random() > .5 ? 280 : 190
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.y += s.speed;
        s.x += Math.sin(s.y * .004) * .5;

        if (s.y > h) {
          s.y = 0;
          s.x = Math.random() * w;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue},100%,85%,.9)`;
        ctx.fill();
      }

      frame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
    };
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (running) return;
    running = true;

    addStyle();

    const scene = document.createElement("div");
    scene.className = "reality";

    scene.innerHTML = `
      <canvas class="r-canvas"></canvas>
      <div class="r-color"></div>
      <div class="r-tunnel"></div>
      <div class="r-lines"></div>
      <div class="r-flash"></div>
      <div class="r-top"></div>
      <div class="r-bottom"></div>
      <div class="r-ring"></div>

      <div class="r-coordinate">
        EXPERIMENT 001<br>REALITY STATUS: UNSTABLE
      </div>

      <div class="r-coordinate right">
        DIMENSION UNKNOWN<br>DO NOT LOOK BACK
      </div>

      <div class="r-word one">NOTHING IS REAL</div>
      <div class="r-word two">YOU ARE SOMEWHERE</div>

      <div class="r-title-wrap">
        <div class="r-pretitle">A NEW FREQUENCY HAS BEEN DETECTED</div>
        <div class="r-title">ASHTRËY</div>
        <div class="r-subtitle">WELCOME TO THE OTHER SIDE</div>
      </div>

      <div class="r-counter">SIGNAL 001 — TRANSMISSION ACTIVE</div>

      <div class="r-cat">
        <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="catWhite" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="#ffffff"/>
              <stop offset="1" stop-color="#aeb3c2"/>
            </linearGradient>
          </defs>

          <!-- Tail -->
          <path class="tail"
            d="M42 111 C-2 120 10 45 53 60"
            fill="none" stroke="#f4f4f8"
            stroke-width="17" stroke-linecap="round"/>

          <!-- Body -->
          <path d="M42 93
            C49 65 80 59 112 69
            C145 54 181 73 189 102
            C195 127 165 145 117 143
            C76 146 38 129 42 93Z"
            fill="#111119" stroke="#fff" stroke-width="3"/>

          <!-- White chest -->
          <path d="M95 82
            C119 73 143 87 145 116
            C139 141 109 141 91 125
            C81 110 82 92 95 82Z"
            fill="url(#catWhite)"/>

          <!-- Head -->
          <path d="M143 83
            L144 30 L176 51
            C189 46 205 51 216 61
            L235 29 L233 91
            C233 122 212 139 187 136
            C159 134 140 112 143 83Z"
            fill="#111119" stroke="#fff" stroke-width="3"
            stroke-linejoin="round"/>

          <!-- White face -->
          <path d="M187 55
            C205 52 223 66 223 88
            C223 110 207 128 187 124
            C172 119 169 98 176 81Z"
            fill="url(#catWhite)"/>

          <!-- Black patch -->
          <path d="M145 66
            L149 43 L175 58
            C169 74 157 83 145 82Z"
            fill="#050508"/>

          <!-- Eyes -->
          <ellipse cx="173" cy="88" rx="4" ry="6" fill="#b9fffb"/>
          <ellipse cx="208" cy="88" rx="4" ry="6" fill="#b9fffb"/>

          <!-- Nose -->
          <path d="M187 103 L182 108 L192 108Z" fill="#ff6caa"/>

          <!-- Whiskers -->
          <path d="M181 110 L151 105 M181 114 L151 119
                   M193 110 L221 104 M193 114 L222 120"
            stroke="#fff" stroke-width="1.5" fill="none"/>

          <!-- Legs -->
          <path d="M67 126 L64 157 Q70 165 84 157 L87 132
                   M145 133 L146 157 Q158 165 168 156 L165 130"
            fill="#111119" stroke="#fff" stroke-width="3"/>

          <!-- Star mark -->
          <path d="M112 91 L115 100 L124 103 L115 106 L112 115
                   L109 106 L100 103 L109 100Z"
            fill="#fff"/>
        </svg>
      </div>

      <div class="r-message">
        YOU WERE NEVER HERE.
      </div>

      <button class="r-enter">
        ENTER THE ARCHIVE ↗
      </button>
    `;

    document.body.appendChild(scene);
    document.body.style.overflow = "hidden";

    const stopStars = makeStars(scene.querySelector(".r-canvas"));

    requestAnimationFrame(() => scene.classList.add("on"));

    const timers = [];

    function later(fn, delay) {
      timers.push(setTimeout(fn, delay));
    }

    later(() => {
      scene.classList.add("blast", "shake");
    }, 800);

    later(() => {
      scene.classList.remove("shake");
    }, 1300);

    later(() => {
      scene.classList.add("show-title");
    }, 1500);

    later(() => {
      scene.classList.add("cat-arrives");
    }, 2500);

    later(() => {
      scene.classList.add("finished");
    }, 5800);

    scene.querySelector(".r-enter").addEventListener("click", () => {
      timers.forEach(clearTimeout);
      stopStars();

      scene.style.transition = "opacity 1s ease";
      scene.style.opacity = "0";

      setTimeout(() => {
        scene.remove();
        document.body.style.overflow = "";
        running = false;

        document.querySelector("#discover")?.scrollIntoView({
          behavior: "smooth"
        });
      }, 1050);
    });
  });
});
