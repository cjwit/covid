import CasesChart from "./src/CasesChart.js";
import CasesScaledChart from "./src/CasesScaledChart.js";
import DeathsChart from "./src/DeathsChart.js";
import DailyChart from "./src/DailyChart.js";
import DailyScaledChart from "./src/DailyScaledChart.js";

window.CasesChart = CasesChart;
window.CasesScaledChart = CasesScaledChart;
window.DeathsChart = DeathsChart;
window.DailyChart = DailyChart;
window.DailyScaledChart = DailyScaledChart;

var buttons = document.getElementsByClassName("btn");
var charts = document.getElementsByClassName("chart");

var buttonListener = function() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("btn-default");
    buttons[i].classList.add("btn-primary");
    this.classList.remove('btn-primary');
    this.classList.add('btn-default');

    if (charts[i].id + "Button" == this.id) {
      charts[i].style.display = "block";
    } else {
      charts[i].style.display = "none";
    }

  }
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", buttonListener);
}
