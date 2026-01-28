// 환자테이터 자세히 보기 - 차트 그래프

import "https://cdn.jsdelivr.net/npm/chart.js";

export const initCustomChart = (canvasId) => {
  const canvas = document.getElementById("customLineChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const SIDE_PADDING = 1.2;
  const rawData = [48, 18, 24.5, 35];
  const labels = ["6 Mar", "7 Jun", "6 Sep", "11 Nov"];
  let activeIndex = 0;
  let isClickUpdate = true;

  const createGradient = (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return null;
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, "rgba(0, 106, 254, 0.2)");
    gradient.addColorStop(0.9, "rgba(0, 106, 254, 0.01)");
    return gradient;
  };

  // [수정] 배경 수평선 플러그인: 0 라인만 실선으로 그리기
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
          ctx.setLineDash([5, 5]); // 나머지 점선
        }

        ctx.moveTo(chartArea.left, yPos);
        ctx.lineTo(chartArea.right, yPos);
        ctx.stroke();
      });
      ctx.restore();
    },
  };

  // 파란색 수직 점선 플러그인
  const activeLinePlugin = {
    id: "activeLine",
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const meta = chart.getDatasetMeta(0);
      const activeElement = meta.data[activeIndex];
      if (!activeElement) return;

      const xPos = activeElement.x;
      const yPos = activeElement.y;

      ctx.save();
      const vGradient = ctx.createLinearGradient(0, yPos, 0, chartArea.bottom);
      vGradient.addColorStop(0, "rgba(0, 106, 254, 0.8)");
      vGradient.addColorStop(1, "rgba(0, 106, 254, 0)");

      ctx.beginPath();
      ctx.setLineDash([8, 8]);
      ctx.lineWidth = 4;
      ctx.strokeStyle = vGradient;
      ctx.moveTo(xPos, yPos + 8);
      ctx.lineTo(xPos, chartArea.bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Main Data",
        data: rawData,
        borderColor: "#006afe",
        borderWidth: 6,
        fill: true,
        backgroundColor: (context) => createGradient(context.chart),
        tension: 0,
        pointRadius: 0,
        order: 10,
      },
      {
        label: "Active Marker",
        data: rawData.map((val, i) => (i === activeIndex ? val : null)),
        pointRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#006afe",
        pointBorderWidth: 6,
        showLine: false,
        clip: false,
        order: 0,
        animations: {
          x: { duration: 0 },
          y: { duration: 0 },
          radius: {
            duration: (ctx) => (isClickUpdate ? 400 : 0),
            from: (ctx) => (isClickUpdate ? 0 : undefined),
            easing: "easeOutBack",
          },
        },
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    plugins: [backgroundFixPlugin, activeLinePlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: 2,
      events: ["click", "touchstart"],
      layout: { padding: { top: 50 } },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#001848",
          bodyFont: { size: 24, weight: "700", lineHeight: 1.5 },
          padding: { top: 2, bottom: 2, left: 16, right: 16 },
          displayColors: false,
          yAlign: "bottom",
          caretPadding: 20,
          filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
          callbacks: {
            title: () => "",
            label: (context) => `${context.formattedValue}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50,
          border: { display: false },
          grid: { display: false },
          ticks: {
            stepSize: 10,
            padding: 24,
            color: "#4B4B4B",
            font: { size: 18 },
          },
        },
        x: {
          min: -SIDE_PADDING,
          max: labels.length - 1 + SIDE_PADDING,
          grid: { display: false },
          border: { display: false },
          ticks: {
            padding: 16,
            color: (ctx) => (ctx.index === activeIndex ? "#006afe" : "#4B4B4B"),
            font: (ctx) => ({
              size: 18,
              weight: ctx.index === activeIndex ? "600" : "400",
            }),
          },
        },
      },
      onClick: (event, elements, chart) => {
        const activeElements = chart.getElementsAtEventForMode(event, "index", { intersect: false }, true);
        if (activeElements.length > 0) {
          const newIndex = activeElements[0].index;
          activeIndex = newIndex;
          chart.data.datasets[1].data = rawData.map((val, i) => (i === newIndex ? val : null));
          chart.tooltip.setActiveElements([{ datasetIndex: 1, index: newIndex }]);
          isClickUpdate = true;
          chart.update();
          setTimeout(() => {
            isClickUpdate = false;
          }, 450);
        }
      },
    },
  };

  const chart = new Chart(ctx, config);

  // 초기 상태 로드 (300ms 후)
  setTimeout(() => {
    const initialIndex = 0;
    activeIndex = initialIndex;
    chart.data.datasets[1].data = rawData.map((val, i) => (i === initialIndex ? val : null));
    chart.tooltip.setActiveElements([{ datasetIndex: 0, index: initialIndex }]);
    isClickUpdate = false;
    chart.update();
  }, 300);
};
