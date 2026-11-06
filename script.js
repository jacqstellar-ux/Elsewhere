document.addEventListener("DOMContentLoaded", () => {
  console.log("ELSEWHERE initialized.");

  document.body.addEventListener("click", () => {
    document.body.classList.toggle("discovered");
  });
});
