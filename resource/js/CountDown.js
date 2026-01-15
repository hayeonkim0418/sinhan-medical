export const CountDown = () => {
  let count = 60;
  const CountDownNum = document.querySelector(".countdown__num");

  if (!CountDownNum) return;

  const timer = setInterval(() => {
    count--;
    CountDownNum.textContent = count;

    if (count <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};
