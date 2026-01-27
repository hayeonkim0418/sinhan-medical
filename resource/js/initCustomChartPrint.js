import "https://cdn.jsdelivr.net/npm/chart.js";

export const initCustomChartPrint = (canvasId) => {
  const canvas = document.getElementById("fenoChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const data = {
    labels: ["6 Mar", "7 Jun", "6 Sep", "11 Nov"],
    datasets: [
      {
        label: "FeNO Average Trend",
        data: [46, 16, 24, 16], // 이미지의 대략적인 수치
        borderColor: "#007bff", // 밝은 파란색
        backgroundColor: "#fff",
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#007bff",
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 4,
        tension: 0, // 직선으로 연결
        fill: false,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      responsive: true,
      layout: {
        padding: { top: 0 },
      },
      plugins: {
        legend: { display: false }, // 범례 숨김
        // title: {
        //   display: true,
        //   text: "FeNO Average Trend",
        //   font: { size: 22, weight: "bold" },
        //   color: "#000",
        //   padding: { bottom: 30 },
        // },
      },
      scales: {
        y: {
          min: 0,
          max: 50,
          ticks: {
            stepSize: 10,
            padding: 12,
            color: "#4B4B4B",
            font: { size: 10 },
          },
          border: { display: false },
          grid: {
            display: true,
            color: "#ddd",
            lineWidth: 1,
            drawTicks: false,
            tickBorderDash: [5, 5],
            borderDash: [5, 5], // 점선 스타일
            // drawBorder: false,
          },
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            padding: 8,
            font: { size: 10 },
          },
        },
      },
    },
    // 인쇄를 위한 플러그인 (배경색 유지)
    plugins: [
      {
        id: "custom_canvas_background_color",
        beforeDraw: (chart) => {
          const { ctx, width, height } = chart;
          ctx.save();
          ctx.globalCompositeOperation = "destination-over"; // 그리드 뒤로 배경을 보냄
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        },
      },
    ],
  };

  new Chart(ctx, config);
};
