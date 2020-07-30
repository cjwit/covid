var buildChart = function (margin) {
  // Set the dimensions of the canvas / graph
  width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  // Adds the svg canvas
  return svg = d3.select('#container')
    .append('svg')
    .attr('width', '100%')
    .attr('viewBox', '0 0 800 800')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');
}

// Define the line (linear)
var pathFunctionLinear = d3.svg.line()
  .x(function (d, i) { return x(i); })
  .y(function (d) { return y(d); });

// Define the line (time)
var pathFunctionTime = d3.svg.line()
  .x(function (d) { return x(d.date); })
  .y(function (d) { return y(d.y); });

// set the color scale
var color = d3.scale.category10();

// handle mouseover and click events
var setActive = function (name, value) {
  d3.select('#label' + name.replace(/\s+/g, ''))
    .classed('active', value);
  d3.select('#line' + name.replace(/\s+/g, ''))
    .classed('active', value);
}

var highlight = function (current) {
  setActive(current.name, true);
  showTooltip(current);
};

var removeHighlight = function (current) {
  tooltip.transition()
    .duration(100)
    .style('opacity', 0);

  if (!current.active) {
    setActive(current.name, false);
  }
}

// build graph elements
var addAxes = function (x, y) {

  // Define the axis
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(5);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(-width, 0, 0)
    .tickFormat(function (d) { return y.tickFormat(5, d3.format(',d'))(d) })
    .ticks(5);

  // Add axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
}

// Create chart title, accept 0 based line number
var chartTitle = function (title, lineNumber = 0) {
  svg.append('text')
    .attr('x', 10)
    .attr('y', -10 + lineNumber * 20)
    .attr('class', 'title')
    .text(title)
}

// build graph data lines
var buildPaths = function (d, dataset, dataFunction) {
  svg.append('path')
    .attr('class', 'line')
    .style('stroke', function () { 
      if (d.name != 'US Average') {
        return d.color = color(d.name); 
      }
      // set US Average in CSS
      return;
    })
    .attr('id', 'line' + d.name.replace(/\s+/g, ''))
    .attr('d', dataFunction(dataset))
    .on('mouseover', function () { highlight(d); })
    .on('mouseout', function () { removeHighlight(d); });
}

// build legend and set event handlers
var buildLegend = function (d, i) {
  legendWidthSpacing = width / 4
  d.active = false
  svg.append('text')
    .attr('x', (legendWidthSpacing / 2 + Math.floor(i / 14) * legendWidthSpacing))
    .attr('y', height + 40 + (i % 14 * 20))
    .attr('class', 'legend')
    .attr('id', 'label' + d.name.replace(/\s+/g, ''))
    .style('fill', function () { return d.color = color(d.name); })
    .text(d.name)
    .on('mouseover', function () {
      if (!d.active) { setActive(d.name, true); }
    })
    .on('mouseout', function () {
      if (!d.active) { setActive(d.name, false); }
    })
    .on('click', function () {
      if (!d.active) { setActive(d.name, true); }
      else { setActive(d.name, false); }
      d.active = !d.active
    });
}