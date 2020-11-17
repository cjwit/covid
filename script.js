import Chart from "./src/Chart.js";

window.Chart = Chart;

// /*
//  *
//  * from index
//  * 
//  */




// // Get the data
// d3.json('data.json', function (error, data) {
//   delete data.states["US Average"];

//   // Dynamically scale the range of the data using Washington (where first cases appear)
//   var daysOver100 = data.states['Washington'].cases.filter(
//     function (n) { return n >= 100; })
//     .length
//   x.domain([0, daysOver100]);
//   y.domain([100, data.maxCases]);

//   addAxes(x, y);

//   // sort data and loop through each state
//   var stateData = Object.entries(data.states).sort(
//     function (a, b) { return a[0] > b[0]; }
//   );

//   stateData.forEach(function (d, i) {
//     // get object from iterator array
//     d = d[1];

//     // filter cases to show only 100+
//     d.cases = d.cases.filter(function (num) { return num >= 100; });

//     // build the graph line and legend
//     buildPaths(d, d.cases, pathFunctionLinear);
//     buildLegend(d, i);
//   });
// });



// /*
//  * from script.js
//  */

// // Define the line (time)
// var pathFunctionTime = d3.svg.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return d.y > 0 ? y(d.y) : y(0) }); // fixing negative cases in Massachusets

// // set the color scale
// var color = d3.scale.category10();


// var highlight = function(current) {
//     setActive(current.name, true);
//     showTooltip(current);
// };

// var removeHighlight = function(current) {
//     tooltip.transition()
//         .duration(100)
//         .style('opacity', 0);

//     if (!current.active) {
//         setActive(current.name, false);
//     }
// }
