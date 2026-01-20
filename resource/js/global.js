import { Header } from "./Header.js";
// import { Password } from "./Password.js";
import { TableTextScroll } from "./TableTextScroll.js";
import { SelectEvent } from "./SelectEvent.js";
import { SelectPerson } from "./SelectPerson.js";
import { CountDown } from "./CountDown.js";
import { initCustomChart } from "./initCustomChart.js";
import { initCustomChartNoData } from "./initCustomChart_NoData.js";

Header();
TableTextScroll();
SelectEvent();
SelectPerson();
CountDown();
window.addEventListener("DOMContentLoaded", () => {
  initCustomChart("customLineChart");
  initCustomChartNoData("initCustomChartNoData");
});
