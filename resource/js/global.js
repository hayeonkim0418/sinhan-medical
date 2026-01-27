import { Header } from "./Header.js";
import { Password } from "./Password.js";
import { ProgressBar } from "./ProgressBar.js";
import { TableTextScroll } from "./TableTextScroll.js";
import { SelectEvent } from "./SelectEvent.js";
import { SelectPerson } from "./SelectPerson.js";
import { CountDown } from "./CountDown.js";
import { initCustomChart } from "./initCustomChart.js";
import { initCustomChartPrint } from "./initCustomChartPrint.js";
import { Gsap } from "./Gsap.js";

window.addEventListener("DOMContentLoaded", () => {
  Header();
  ProgressBar();
  TableTextScroll();
  SelectEvent();
  SelectPerson();
  CountDown();
  Password();
  initCustomChart("customLineChart");
  initCustomChartPrint("customLineChartPrint");
  Gsap();
});
