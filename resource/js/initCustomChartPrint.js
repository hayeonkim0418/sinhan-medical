// 리포트 - 인쇄화면 차트 그래프

import "https://cdn.jsdelivr.net/npm/chart.js";

export const initCustomChartPrint = (canvasId) => {
  const canvas = document.querySelector(".fenoChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // 배경 수평선 플러그인: 0 라인만 실선으로 그리기
  const backgroundFixPlugin = {
    id: "backgroundFix",
    beforeDraw: (chart) => {
      const {
        ctx,
        chartArea,
        scales: { y },
      } = chart;
      ctx.save();

      y.ticks.forEach((tick, index) => {
        const yPos = y.getPixelForTick(index);
        ctx.beginPath();

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#ddd";

        if (tick.value === 0) {
          ctx.setLineDash([]); // 0 라인 실선
        } else {
          ctx.setLineDash([3, 3]); // 나머지 점선
        }

        ctx.moveTo(chartArea.left, yPos);
        ctx.lineTo(chartArea.right, yPos);
        ctx.stroke();
      });
      ctx.restore();
    },
  };

  const data = {
    labels: ["6 Mar", "7 Jun", "6 Sep", "11 Nov"],
    datasets: [
      {
        label: "FeNO Average Trend",
        data: [46, 16, 24, 16],
        borderColor: "#007bff",
        backgroundColor: "#fff",
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#007bff",
        pointBorderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 4,
        tension: 0,
        fill: false,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    plugins: [backgroundFixPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 1,
      layout: {
        padding: { top: 0 },
      },
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 50,
          ticks: {
            stepSize: 10,
            padding: 12,
            color: "#4B4B4B",
            font: { size: 10 },
          },
          grid: { display: false },
          border: { display: false },
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
  };

  new Chart(ctx, config);
};
