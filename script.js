import CasesChart from "./src/CasesChart.js";
import CasesScaledChart from "./src/CasesScaledChart.js";
import DeathsChart from "./src/DeathsChart.js";
import DailyChart from "./src/DailyChart.js";

window.CasesChart = CasesChart;
window.CasesScaledChart = CasesScaledChart;
window.DeathsChart = DeathsChart;
window.DailyChart = DailyChart;

/**
 * 

      // Get the data
      d3.json("data.json", function (error, data) {
        delete data.states["US Average"];
        
        // Dynamically scale the range of the data
        var dayOne = new Date(2020, 0, 21);
        var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        x.domain([dayOne, yesterday]);
        y.domain([100, data.maxAverages]);

        addAxes(x, y);

        // sort data and loop through each state
        var stateData = Object.entries(data.states).sort(
          function (a, b) { return a[0] > b[0]; }
        );

        stateData.forEach(function (d, i) {
          // get object from iterator array
          d = d[1];

          // add dates for x values
          var pairs = [];
          for (var day = 0; day < data.totalDays; day++) {
            let currentDay = new Date(dayOne.valueOf() + day * 24 * 60 * 60 * 1000);
            pairs.push({ "date": currentDay, "y": d.averages[day] });
          };

          buildPaths(d, pairs, pathFunctionTime);
          buildLegend(d, i);
        });
      });



 */