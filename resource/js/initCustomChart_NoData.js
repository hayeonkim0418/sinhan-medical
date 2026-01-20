// chartModule.js

// 1. Chart.js 로드 (브라우저 환경에서 UMD 방식 사용 시 전역 Chart 객체 참조)
// 만약 npm 환경이라면: import Chart from 'chart.js/auto';

export const initCustomChartNoData = (canvasId) => {
  let myChart = null;

  // 원본 데이터
  const rawData = [48, 18, 25, 35];
  const labels = ["6 Mar", "7 Jun", "6 Sep", "11 Nov"];

  // [상태 설정] 현재 데이터 상태 (false로 설정하여 데이터 없음 화면을 바로 확인)
  // 실제 사용 시에는 데이터 유무에 따라 true/false가 결정되게 하세요.
  let hasDataState = false;

  // =============================================================
  // [설정] 커스텀 아이콘 이미지 설정
  // 이곳에 디자이너가 준 아이콘 이미지 경로를 입력하세요.
  // =============================================================
  const EMPTY_ICON_SRC = "../../resource/images/icon/ic-data-edit.svg";
  const emptyImage = new Image();
  emptyImage.src = EMPTY_ICON_SRC;
  // =============================================================

  const SIDE_PADDING = 1.2;
  let activeIndex = 0;
  let isClickUpdate = true;

  // =============================================================
  // [플러그인] 데이터 없음 (Empty State) 표시 플러그인 (이미지 버전)
  // =============================================================
  const emptyDataPlugin = {
    id: "emptyData",
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      const dataset = chart.data.datasets[0];

      // 데이터 확인 로직
      const hasData =
        dataset.data.length > 0 && dataset.data.some((v) => v !== null);

      if (!hasData) {
        ctx.save();

        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;

        // 1. 이미지 그리기
        const imgSize = 48; // 아이콘 크기 (조절 가능)

        // 이미지가 로드된 상태라면 그리기
        if (emptyImage.complete) {
          // 이미지를 중앙 정렬하기 위해 x, y 좌표에서 크기의 절반만큼 뺍니다.
          // y - 30은 텍스트와의 간격을 위해 조금 위로 올린 값입니다.
          ctx.drawImage(
            emptyImage,
            x - imgSize / 2,
            y - imgSize / 2 - 20,
            imgSize,
            imgSize,
          );
        } else {
          // 이미지가 아직 로드되지 않았다면 로드 후 차트를 다시 그림
          emptyImage.onload = () => chart.draw();
        }

        // 2. 텍스트 그리기
        ctx.font =
          "1.125rem Pretendard, Poppins, Noto Sans KR, sans-serif, Nanum Gothic, 돋움, dotum, 굴림, gulim, Helvetica, AppleGothic";
        ctx.fillStyle = "#B8B8B8"; // 텍스트 색상
        ctx.textAlign = "center";
        // 이미지 아래쪽에 텍스트 배치
        ctx.fillText("조회된 데이터가 없습니다.", x, y + 35);

        ctx.restore();
      }
    },
  };

  const createGradient = (chart) => {
    const { ctx, chartArea } = chart;
    if (!chartArea) return null;
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, "rgba(0, 106, 254, 0.4)");
    gradient.addColorStop(0.8, "rgba(0, 106, 254, 0.0)");
    return gradient;
  };

  const activeLinePlugin = {
    id: "activeLine",
    beforeDatasetDraw: (chart, args) => {
      if (args.index !== 1) return;

      const mainDataset = chart.data.datasets[0];
      if (!mainDataset.data.length || mainDataset.data.every((v) => v === null))
        return;

      const { ctx, chartArea } = chart;
      const meta = args.meta;
      const activeElement = meta.data[activeIndex];

      if (
        !activeElement ||
        activeElement.x === undefined ||
        activeElement.y === undefined
      )
        return;

      const currentRadius = activeElement.options.radius;
      if (currentRadius < 0.1) return;

      let alpha = currentRadius / 8;
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
      const hasData =
        chart.data.datasets[0].data.length > 0 &&
        chart.data.datasets[0].data[0] !== null;

      if (hasData && firstPoint && firstPoint.y) {
        ctx.save();
        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom,
        );
        gradient.addColorStop(0, "rgba(0, 106, 254, 0.4)");
        gradient.addColorStop(0.8, "rgba(0, 106, 254, 0.0)");
        ctx.fillStyle = gradient;

        if (xStart > chartArea.left) {
          ctx.fillRect(
            chartArea.left,
            firstPoint.y,
            xStart - chartArea.left + 1,
            chartArea.bottom - firstPoint.y,
          );
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
        const endX = !hasData || isNaN(xStart) ? x.getPixelForValue(0) : xStart;
        ctx.lineTo(endX, yPos);
      });
      ctx.stroke();
      ctx.restore();
    },
  };

  function initChart() {
    const canvas = document.getElementById("customLineChartNoData");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const currentData = hasDataState ? rawData : [];
    const currentActiveData = hasDataState
      ? currentData.map((val, i) => (i === activeIndex ? val : null))
      : [];

    const data = {
      labels: labels,
      datasets: [
        {
          type: "line",
          label: "Main Data",
          data: currentData,
          borderColor: "#006afe",
          borderWidth: 4,
          fill: true,
          backgroundColor: (context) => createGradient(context.chart),
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 0,
          order: 10,
          clip: false,
        },
        {
          type: "line",
          label: "Active Marker",
          data: currentActiveData,
          pointRadius: 8,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#006afe",
          pointBorderWidth: 4,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#006afe",
          pointHoverBorderWidth: 4,
          showLine: false,
          order: 0,
          clip: false,
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
      plugins: [activeLinePlugin, backgroundFixPlugin, emptyDataPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
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
            enabled: hasDataState,
            backgroundColor: "rgba(30, 41, 59, 0.9)",
            padding: 12,
            cornerRadius: 8,
            titleFont: { size: 13 },
            bodyFont: { size: 14, weight: "bold" },
            displayColors: false,
            yAlign: "bottom",
            caretPadding: 20,
            callbacks: {
              title: () => "",
              label: (context) => `${context.formattedValue} 건`,
            },
            filter: (tooltipItem) => tooltipItem.datasetIndex === 0,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            border: { display: false },
            grid: {
              color: "#e2e8f0",
              borderDash: [6, 6],
              drawBorder: false,
            },
            ticks: {
              stepSize: 10,
              padding: 10,
              color: "#64748b",
              font: { size: 12 },
            },
          },
          x: {
            min: -SIDE_PADDING,
            max: labels.length - 1 + SIDE_PADDING,
            grid: { display: false, drawBorder: false },
            border: { display: false },
            ticks: {
              padding: 10,
              color: (context) =>
                context.index === activeIndex && hasDataState
                  ? "#006afe"
                  : "#94a3b8",
              font: (context) => ({
                size: 14,
                weight:
                  context.index === activeIndex && hasDataState
                    ? "bold"
                    : "normal",
              }),
            },
          },
        },
        onClick: (event, elements, chart) => {
          if (!hasDataState) return;

          const activeElements = chart.getElementsAtEventForMode(
            event,
            "index",
            { intersect: false },
            true,
          );
          if (activeElements.length > 0) {
            const newIndex = activeElements[0].index;
            if (activeIndex !== newIndex) {
              activeIndex = newIndex;
              chart.data.datasets[1].data = rawData.map((val, i) =>
                i === newIndex ? val : null,
              );

              isClickUpdate = true;
              chart.update();

              setTimeout(() => {
                isClickUpdate = false;
              }, 450);
            }
          }
        },
      },
    };

    if (myChart) {
      myChart.destroy();
    }
    myChart = new Chart(ctx, config);

    setTimeout(() => {
      isClickUpdate = false;
    }, 500);
  }

  initChart();
};
