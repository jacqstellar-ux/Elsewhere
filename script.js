document.addEventListener("DOMContentLoaded", () => {
  const enterButton = document.querySelector(".enter");

  if (!enterButton) return;

  enterButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (document.querySelector(".breach")) return;

    const breach = document.createElement("div");
    breach.className = "breach";

    breach.innerHTML = `
      <div class="breach-noise"></div>
      <div class="breach-ring"></div>
      <div class="breach-flash"></div>

      <div class="breach-intro">
        <div class="breach-small">IDENTITY DETECTED</div>
        <div class="breach-name">ASHTRËY</div>
        <div class="breach-sub">WELCOME BEYOND REALITY</div>
      </div>

      <div class="breach-message">
        YOU WERE NEVER HERE.
      </div>

      <button class="breach-exit">RETURN TO ELSEWHERE ↗</button>
    `;

    document.body.appendChild(breach);
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      breach.classList.add("active");
    });

    setTimeout(() => {
      breach.classList.add("revealed");
    }, 1700);

    setTimeout(() => {
      breach.classList.add("complete");
    }, 3200);

    breach.querySelector(".breach-exit").addEventListener("click", () => {
      breach.classList.remove("active", "revealed", "complete");

      setTimeout(() => {
        breach.remove();
        document.body.style.overflow = "";
      }, 1100);
    });
  });
});
