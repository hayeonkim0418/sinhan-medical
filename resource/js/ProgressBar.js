// 측정 화면 오른쪽 상단 잔여시간 타이머

export const ProgressBar = () => {
  const totalTime = 10; // 설정할 총 시간 (초)
  let timeLeft = totalTime;

  const secondsElement = document.querySelector(".seconds");
  const progressCircle = document.querySelector(".timer-progress");
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // 원의 둘레: 약 282.7

  if (!secondsElement || !progressCircle) return;

  // 초기화
  progressCircle.style.strokeDasharray = circumference;

  function updateTimer() {
    // 숫자 업데이트
    secondsElement.innerText = timeLeft;

    // 프로그레스 바 업데이트
    const offset = circumference - (timeLeft / totalTime) * circumference;
    progressCircle.style.strokeDashoffset = offset;

    if (timeLeft > 0) {
      timeLeft--;
    } else {
      clearInterval(timerInterval);
      // alert("시간이 종료되었습니다!");
    }
  }

  // 1초마다 실행
  updateTimer(); // 즉시 한 번 실행
  const timerInterval = setInterval(updateTimer, 1000);
};
