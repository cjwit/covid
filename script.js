import CasesChart from "./src/CasesChart.js";
import DeathsChart from "./src/DeathsChart.js";

window.CasesChart = CasesChart;
window.DeathsChart = DeathsChart;

/**
 * 
 *    svg = buildChart({ top: 30, right: 50, bottom: 320, left: 60 });
      chartTitle('Total cases as a percentage of state population');
      chartTitle('US average shown as a dotted black line', 1);

      // Set the ranges
      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);

      // build tooltips
      var tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      var showTooltip = function (current) {
        tooltip.transition()
          .duration(100)
          .style('opacity', .9);

        tooltip.html(function () {
          var lastScaled = Number(current.scaledCases[current.scaledCases.length - 1]);
          var roundedLastScaled = Math.round(lastScaled * 100) / 100;
          var totalCases = current.cases[current.cases.length - 1].toLocaleString();
          return '<b>' + current.name + '</b> ' + roundedLastScaled.toLocaleString() + '% of population</br> ' + totalCases + ' total cases';
        })
          .style('left', (d3.event.pageX - 150) + 'px')
          .style('top', (d3.event.pageY - 60) + 'px');
      }

      // Get the data
      d3.json('data.json', function (error, data) {

        // Dynamically scale the range of the data
        var dayOne = new Date(2020, 0, 21);
        var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        x.domain([dayOne, yesterday]);
        y.domain([0, data.maxScaledCases]);

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
            pairs.push({ "date": currentDay, "y": d.scaledCases[day] });
          };

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