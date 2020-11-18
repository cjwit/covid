import CasesChart from "./src/CasesChart.js";0
import CasesScaledChart from "./src/CasesScaledChart.js";
import DeathsChart from "./src/DeathsChart.js";

window.CasesChart = CasesChart;
window.CasesScaledChart = CasesScaledChart;
window.DeathsChart = DeathsChart;

/**
 * 
      var showTooltip = function (current) {


      // Get the data
      d3.json('data.json', function (error, data) {



          // build the graph line and legend
          buildPaths(d, pairs, pathFunctionTime);

          // adjust i for buildLegend after US Average
          if (d.name < 'US Average') {
            buildLegend(d, i);
          }
          else if (d.name > 'US Average') {
            buildLegend(d, i - 1);
          }
        });
      });


 */