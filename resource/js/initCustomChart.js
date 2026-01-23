// chartModule.js

// 1. Chart.js 로드 (브라우저 환경에서 UMD 방식 사용 시 전역 Chart 객체 참조)
// 만약 npm 환경이라면: import Chart from 'chart.js/auto';
import "https://cdn.jsdelivr.net/npm/chart.js";

export const initCustomChart = (canvasId) => {
  const canvas = document.getElementById("customLineChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // =============================================================
  // [설정] 좌우 여백 (1.2칸)
  // =============================================================
  const SIDE_PADDING = 1.2;
  // =============================================================

  const rawData = [48, 18, 24.5, 35];
  const labels = ["6 Mar", "7 Jun", "6 Sep", "11 Nov"];
  let activeIndex = 0;

  // [핵심] 클릭 이벤트인지 확인하는 상태 변수
  let isClickUpdate = true;

  const createGradient = (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return null;
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    // background 변경
    gradient.addColorStop(0, "rgba(0, 106, 254, 0.2)");
    gradient.addColorStop(0.9, "rgba(0, 106, 254, 0.01)");
    return gradient;
  };

  const activeLinePlugin = {
    id: "activeLine",
    beforeDatasetDraw: (chart, args) => {
      if (args.index !== 1) return;

      const { ctx, chartArea } = chart;
      const meta = args.meta;
      const activeElement = meta.data[activeIndex];

      if (!activeElement || activeElement.x === undefined || activeElement.y === undefined) return;

      const currentRadius = activeElement.options.radius;
      // 애니메이션 자연스럽게 보이도록 최소값 조건 완화
      if (currentRadius < 0.1) return;

      let alpha = currentRadius / 8; // 반지름이 8이므로 0~1 사이 값으로 정규화
      if (alpha > 1) alpha = 1;

      const xPos = activeElement.x;
      const yPos = activeElement.y;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.globalAlpha = alpha;

      const gradient = ctx.createLinearGradient(0, yPos, 0, chartArea.bottom);
      gradient.addColorStop(0, "#006afe");
      gradient.addColorStop(1, "rgba(0, 106, 254, 0)");

      ctx.strokeStyle = gradient;
      ctx.setLineDash([6, 6]);

      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, chartArea.bottom);
      ctx.stroke();
      ctx.restore();
    },
  };

  const backgroundFixPlugin = {
    id: "backgroundFix",
    beforeDraw: (chart) => {
      const {
        ctx,
        chartArea,
        scales: { y, x },
      } = chart;
      const xStart = x.getPixelForValue(0);
      const meta = chart.getDatasetMeta(0);
      const firstPoint = meta.data[0];

      if (firstPoint) {
        ctx.save();
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, "#006afe");
        gradient.addColorStop(0.8, "rgba(0, 106, 254, 0.0)");
        ctx.fillStyle = gradient;

        if (xStart > chartArea.left) {
          ctx.fillRect(chartArea.left, firstPoint.y, xStart - chartArea.left + 1, chartArea.bottom - firstPoint.y);
        }
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#e2e8f0";
      ctx.setLineDash([6, 6]);

      y.ticks.forEach((tick, index) => {
        if (index === 0) return;
        const yPos = y.getPixelForTick(index);
        ctx.moveTo(chartArea.left, yPos);
        ctx.lineTo(xStart, yPos);
      });
      ctx.stroke();
      ctx.restore();
    },
  };

  const data = {
    labels: labels,
    datasets: [
      {
        type: "line", // Chart 형태
        label: "Main Data",
        data: rawData,
        borderColor: "#006afe",
        borderWidth: 6,
        fill: true,
        backgroundColor: (context) => createGradient(context.chart),
        tension: 0, // chart line 0일경우 직선 숫자 올라질수록 부드럽게 연결됨
        pointRadius: 0,
        pointHoverRadius: 0,
        order: 10,
        clip: false,
      },
      {
        type: "line",
        label: "Active Marker",
        data: rawData.map((val, i) => (i === activeIndex ? val : null)),

        pointRadius: 8,
        pointBackgroundColor: "#ffffff",
        pointBorderColor: "#006afe",
        pointBorderWidth: 6,

        // [Hover 스타일 고정]
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#ffffff",
        pointHoverBorderColor: "#006afe",
        pointHoverBorderWidth: 6,

        showLine: false,
        order: 0,
        clip: false,

        // [핵심 수정] 애니메이션 설정 (radius 속성만 조건부 제어)
        animations: {
          x: { duration: 0 },
          y: { duration: 0 },
          radius: {
            // 클릭 상태(isClickUpdate)일 때만 시간 부여 (아니면 0)
            duration: (ctx) => (isClickUpdate ? 400 : 0),
            // 클릭 상태일 때만 0부터 시작 (아니면 현재 크기 유지)
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
    plugins: [activeLinePlugin, backgroundFixPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // [수정] 전역 애니메이션은 기본값 사용 (데이터셋 별 설정이 우선됨)
      animation: {
        easing: "easeOutQuart",
      },
      hover: { mode: null },
      layout: {
        padding: { top: 40, right: 20, left: 10, bottom: 10 },
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "#001848",
          padding: {
            top: 2,
            right: 16,
            bottom: 2,
            left: 16,
          },
          // titleFont: { size: 13 },
          bodyFont: { size: 24, weight: "700", lineHeight: 1.5 },
          displayColors: false,
          yAlign: "bottom",
          caretPadding: 20,
          callbacks: {
            title: () => "",
            label: (context) => `${context.formattedValue}`,
          },
          filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 50, // Y축 최댓값
          border: { display: false },
          grid: {
            color: "#DDD",
            borderDash: [6, 6],
            drawBorder: false,
          },
          ticks: {
            stepSize: 10,
            // padding: {
            //   right: 10,
            // },
            padding: 10,
            color: "#4B4B4B",
            font: { size: 18 },
          },
        },
        x: {
          min: -SIDE_PADDING,
          max: labels.length - 1 + SIDE_PADDING,
          grid: { display: false, drawBorder: false },
          border: { display: false },
          ticks: {
            padding: 16,
            // padding: {
            //   top: 16,
            // },
            color: (context) => (context.index === activeIndex ? "#006afe" : "#4B4B4B"),
            font: (context) => ({
              size: 18,
              weight: context.index === activeIndex ? "600" : "400",
            }),
          },
        },
      },
      onClick: (event, elements, chart) => {
        const activeElements = chart.getElementsAtEventForMode(event, "index", { intersect: false }, true);
        if (activeElements.length > 0) {
          const newIndex = activeElements[0].index;
          if (activeIndex !== newIndex) {
            activeIndex = newIndex;
            chart.data.datasets[1].data = rawData.map((val, i) => (i === newIndex ? val : null));

            // 1. 클릭 업데이트임을 표시
            isClickUpdate = true;
            chart.update();

            // 2. 애니메이션이 끝날 즈음(400ms 후)에 플래그 해제
            // (clearTimeout은 생략했습니다. 빠른 연속 클릭 시에도 마지막 클릭 기준 400ms 뒤에 꺼지면 되므로)
            setTimeout(() => {
              isClickUpdate = false;
            }, 450);
          }
        }
      },
    },
  };

  const chart = new Chart(ctx, config);

  // 초기 로딩 후 플래그 끄기
  setTimeout(() => {
    isClickUpdate = false;
  }, 500);
};
