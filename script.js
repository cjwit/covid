import Chart from "./src/Chart.js";

var chart = new Chart({ top: 30, right: 50, bottom: 320, left: 60 });

// /*
//  *
//  * from index
//  * 
//  */

// chartTitle('Cases, from 100th reported');


// // Set the ranges
// var x = d3.scale.linear().range([0, width]);
// var y = d3.scale.log().range([height, 0]);

// // build tooltips
// var tooltip = d3.select('body')
//   .append('div')
//   .attr('class', 'tooltip')
//   .style('opacity', 0);

// var showTooltip = function (current) {
//   tooltip.transition()
//     .duration(100)
//     .style('opacity', .9);

//   tooltip.html(function () {
//     var lastCase = Number(current.cases[current.cases.length - 1]);
//     var scaled = Math.round(lastCase * 100000.0 / current.population).toLocaleString();
//     return '<b>' + current.name + '</b> ' + lastCase.toLocaleString() + ' total cases</br> ' + scaled + ' per 100,000k';
//   })
//     .style('left', (d3.event.pageX - 150) + 'px')
//     .style('top', (d3.event.pageY - 60) + 'px');
// }

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


// // Define the line (linear)
// var pathFunctionLinear = d3.svg.line()
//     .x(function(d, i) { return x(i); })
//     .y(function(d) { return y(d); });

// // Define the line (time)
// var pathFunctionTime = d3.svg.line()
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return d.y > 0 ? y(d.y) : y(0) }); // fixing negative cases in Massachusets

// // set the color scale
// var color = d3.scale.category10();

// // handle mouseover and click events
// var setActive = function(name, value) {
//     d3.select('#label' + name.replace(/\s+/g, ''))
//         .classed('active', value);
//     d3.select('#line' + name.replace(/\s+/g, ''))
//         .classed('active', value);
// }

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

// // build graph elements
// var addAxes = function(x, y) {

//     // Define the axis
//     var xAxis = d3.svg.axis()
//         .scale(x)
//         .orient('bottom')
//         .ticks(5);

//     var yAxis = d3.svg.axis()
//         .scale(y)
//         .orient('left')
//         .tickSize(-width, 0, 0)
//         .tickFormat(function(d) { return y.tickFormat(5, d3.format(',d'))(d) })
//         .ticks(5);

//     // Add axis
//     svg.append('g')
//         .attr('class', 'x axis')
//         .attr('transform', 'translate(0,' + height + ')')
//         .call(xAxis);

//     svg.append('g')
//         .attr('class', 'y axis')
//         .call(yAxis)
// }

// // Create chart title, accept 0 based line number
// var chartTitle = function(title, lineNumber = 0) {
//     svg.append('text')
//         .attr('x', 10)
//         .attr('y', -10 + lineNumber * 20)
//         .attr('class', 'title')
//         .text(title)
// }

// // build graph data lines
// var buildPaths = function(d, dataset, dataFunction) {
//     svg.append('path')
//         .attr('class', 'line')
//         .style('stroke', function() {
//             if (d.name != 'US Average') {
//                 return d.color = color(d.name);
//             }
//             // set US Average in CSS
//             return;
//         })
//         .attr('id', 'line' + d.name.replace(/\s+/g, ''))
//         .attr('d', dataFunction(dataset))
//         .on('mouseover', function() { highlight(d); })
//         .on('mouseout', function() { removeHighlight(d); });
// }

// // build legend and set event handlers
// var buildLegend = function(d, i) {
//     legendWidthSpacing = width / 4
//     d.active = false
//     svg.append('text')
//         .attr('x', (legendWidthSpacing / 2 + Math.floor(i / 14) * legendWidthSpacing))
//         .attr('y', height + 40 + (i % 14 * 20))
//         .attr('class', 'legend')
//         .attr('id', 'label' + d.name.replace(/\s+/g, ''))
//         .style('fill', function() { return d.color = color(d.name); })
//         .text(d.name)
//         .on('mouseover', function() {
//             if (!d.active) { setActive(d.name, true); }
//         })
//         .on('mouseout', function() {
//             if (!d.active) { setActive(d.name, false); }
//         })
//         .on('click', function() {
//             if (!d.active) { setActive(d.name, true); } else { setActive(d.name, false); }
//             d.active = !d.active
//         });
// }
