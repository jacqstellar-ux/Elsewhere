
document.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.querySelector(".enter");

  if (!enterButton) return;

  // Prevent accidental double activation
  let isActive = false;

  // Create the visual engine
  const style = document.createElement("style");

  style.textContent = `
    .breach {
      position: fixed;
      inset: 0;
      z-index: 99999;
      overflow: hidden;
      background: #020104;
      color: #fff;
      opacity: 0;
      visibility: hidden;
      transform: scale(1.08);
      transition:
        opacity 1s ease,
        transform 1.8s cubic-bezier(.16,1,.3,1),
        visibility 1s;
      font-family: 'DM Mono', monospace;
    }

    .breach.active {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
    }

    .breach canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: .85;
    }

    .breach-vignette {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at center, transparent 5%, #020104 85%),
        linear-gradient(transparent, rgba(30,0,45,.3));
      pointer-events: none;
    }

    .breach-grid {
      position: absolute;
      inset: -50%;
      opacity: .16;
      background-image:
        linear-gradient(rgba(190,120,255,.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(190,120,255,.15) 1px, transparent 1px);
      background-size: 65px 65px;
      transform: perspective(500px) rotateX(65deg);
      animation: breachGrid 12s linear infinite;
    }

    .breach-portal {
      position: absolute;
      width: min(90vw, 650px);
      aspect-ratio: 1;
      left: 50%;
      top: 50%;
      border-radius: 50%;
      border: 1px solid rgba(190,120,255,.35);
      transform: translate(-50%,-50%) scale(.1);
      box-shadow:
        0 0 35px rgba(150,50,255,.3),
        inset 0 0 45px rgba(150,50,255,.2);
      opacity: 0;
    }

    .breach.active .breach-portal {
      animation: portalOpen 4s cubic-bezier(.16,1,.3,1) forwards;
    }

    .breach-portal::before,
    .breach-portal::after {
      content: "";
      position: absolute;
      inset: 9%;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,.22);
      box-shadow: 0 0 35px rgba(180,70,255,.35);
    }

    .breach-portal::after {
      inset: 20%;
      border-color: rgba(255,0,110,.4);
      animation: portalSpin 8s linear infinite;
    }

    .breach-flash {
      position: absolute;
      inset: 0;
      background: white;
      opacity: 0;
      pointer-events: none;
    }

    .breach.active .breach-flash {
      animation: breachFlash 1.4s ease 1.2s;
    }

    .breach-intro {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 100%;
      padding: 20px;
      text-align: center;
      transform: translate(-50%,-50%) scale(.7);
      opacity: 0;
      transition: 1.4s cubic-bezier(.16,1,.3,1);
    }

    .breach.revealed .breach-intro {
      opacity: 1;
      transform: translate(-50%,-50%) scale(1);
    }

    .breach-small {
      font-size: 10px;
      letter-spacing: 7px;
      color: #b58aff;
      margin-bottom: 25px;
    }

    .breach-name {
      font-family: 'Manrope', sans-serif;
      font-weight: 800;
      font-size: clamp(48px, 12vw, 130px);
      letter-spacing: -.09em;
      line-height: .9;
      text-shadow:
        4px 0 #ff0055,
        -4px 0 #6500ff,
        0 0 55px rgba(170,70,255,.8);
      animation: nameGlitch 3s infinite;
    }

    .breach-sub {
      margin-top: 28px;
      font-size: 9px;
      letter-spacing: 5px;
      color: #aaa;
    }

    .breach-message {
      position: absolute;
      left: 50%;
      bottom: 17%;
      transform: translateX(-50%);
      width: 100%;
      text-align: center;
      font-size: 10px;
      letter-spacing: 5px;
      color: #aaa;
      opacity: 0;
      transition: 1s;
    }

    .breach.complete .breach-message {
      opacity: 1;
    }

    .breach-exit {
      position: absolute;
      left: 50%;
      bottom: 8%;
      transform: translateX(-50%) translateY(15px);
      padding: 15px 22px;
      border: 1px solid rgba(190,120,255,.5);
      background: rgba(20,5,35,.5);
      color: white;
      font: inherit;
      font-size: 9px;
      letter-spacing: 3px;
      white-space: nowrap;
      opacity: 0;
      cursor: pointer;
      transition: .7s;
    }

    .breach.complete .breach-exit {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .breach-exit:active {
      background: #8b35ff;
    }

    .breach-coordinate {
      position: absolute;
      top: 30px;
      left: 25px;
      color: #777;
      font-size: 9px;
      letter-spacing: 2px;
    }

    .breach-index {
      position: absolute;
      top: 30px;
      right: 25px;
      color: #777;
      font-size: 9px;
      letter-spacing: 2px;
    }

    @keyframes breachGrid {
      from { transform: perspective(500px) rotateX(65deg) translateY(0); }
      to { transform: perspective(500px) rotateX(65deg) translateY(65px); }
    }

    @keyframes portalOpen {
      0% { opacity: 0; transform: translate(-50%,-50%) scale(.1) rotate(0); }
      40% { opacity: 1; }
      100% { opacity: .8; transform: translate(-50%,-50%) scale(1.4) rotate(180deg); }
    }

    @keyframes portalSpin {
      to { transform: rotate(360deg) scale(1.12); }
    }

    @keyframes breachFlash {
      0%,100% { opacity: 0; }
      15% { opacity: .8; }
      30% { opacity: 0; }
      42% { opacity: .25; }
    }

    @keyframes nameGlitch {
      0%, 90%, 100% { transform: translate(0); }
      92% { transform: translate(-4px, 2px); }
      94% { transform: translate(4px, -2px); }
      96% { transform: translate(-2px, 0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .breach, .breach * {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important;
      }
    }
  `;

  document.head.appendChild(style);

  enterButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (isActive) return;
    isActive = true;

    const breach = document.createElement("div");
    breach.className = "breach";

    breach.innerHTML = `
      <canvas class="breach-stars"></canvas>
      <div class="breach-grid"></div>
      <div class="breach-portal"></div>
      <div class="breach-vignette"></div>
      <div class="breach-flash"></div>

      <div class="breach-coordinate">
        LOCATION: UNKNOWN
      </div>

      <div class="breach-index">
        ELSEWHERE / 001
      </div>

      <div class="breach-intro">
        <div class="breach-small">
          IDENTITY DETECTED — SUBJECT 001
        </div>

        <div class="breach-name">
          ASHTRËY
        </div>

        <div class="breach-sub">
          YOU HAVE CROSSED THE BOUNDARY
        </div>
      </div>

      <div class="breach-message">
        YOU WERE NEVER HERE.
      </div>

      <button class="breach-exit">
        ENTER THE ARCHIVE ↗
      </button>
    `;

    document.body.appendChild(breach);
    document.body.style.overflow = "hidden";

    // Starfield animation
    const canvas = breach.querySelector(".breach-stars");
    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let stars = [];
    let animationId;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: 150 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + .3,
        size: Math.random() * 1.5 + .3
      }));
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.y += star.z * 1.2;
        star.x += Math.sin(star.y * .003) * .3;

        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(220,195,255,.8)";
        ctx.fill();
      }

      animationId = requestAnimationFrame(drawStars);
    }

    resizeCanvas();
    drawStars();

    window.addEventListener("resize", resizeCanvas);

    requestAnimationFrame(() => {
      breach.classList.add("active");
    });

    const revealTimer = setTimeout(() => {
      breach.classList.add("revealed");
    }, 1400);

    const completeTimer = setTimeout(() => {
      breach.classList.add("complete");
    }, 3200);

    breach.querySelector(".breach-exit").addEventListener("click", () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);

      breach.classList.remove("active", "revealed", "complete");

      setTimeout(() => {
        breach.remove();
        document.body.style.overflow = "";
        isActive = false;

        document.querySelector("#discover")?.scrollIntoView({
          behavior: "smooth"
        });
      }, 1000);
    });
  });
});
