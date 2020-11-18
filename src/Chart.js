import "./d3.min.js";

export class Chart {
  constructor(title, margin) {

    // set the dimensions of the chart canvas
    this.width = 800 - margin.left - margin.right;
    this.height = 800 - margin.top - margin.bottom;

    // create svg element    
    this.svg = this.createSVG(margin);
    this.createChartTitle(title)

    // set ranges
    this.setRanges();

    // build tooltips
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    // get data from JSON
    this.addData();

    return this.svg;
  }

  setRanges() {}

  createSVG(margin) {
    return d3.select('#chart')
      .append('svg')
      .attr('width', '100%')
      .attr('viewBox', '0 0 800 800')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');
  }

  createChartTitle(title, lineNumber = 0) {
    this.svg.append('text')
      .attr('x', 10)
      .attr('y', -10 + lineNumber * 20)
      .attr('class', 'title')
      .text(title);
  }

  // specific to the graph... needs changed
  showTooltip(current) {
    this.tooltip.transition()
      .duration(100)
      .style('opacity', .9);

    this.tooltip.html(function () {
      var lastCase = Number(current.cases[current.cases.length - 1]);
      var scaled = Math.round(lastCase * 100000.0 / current.population).toLocaleString();
      return '<b>' + current.name + '</b> ' + lastCase.toLocaleString() + ' total cases</br> ' + scaled + ' per 100,000k';
    })
      .style('left', (d3.event.pageX - 150) + 'px')
      .style('top', (d3.event.pageY - 60) + 'px');
  }

  async getData() {
    return new Promise((resolve, reject) => {
      d3.json('assets/data.json', function (error, data) {
        delete data.states["US Average"];
        resolve(data);
      });
    })
  }

  async addData() {
    this.data = await this.getData();

    // complete setup after data is parsed
    this.setDomain();
    this.addAxes();
    this.addStates();
  }

  setDomain() {}

  // from script
  addAxes() {
    // Define the axis
    var xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .ticks(5);

    var self = this;
    var yAxis = d3.svg.axis()
      .scale(this.y)
      .orient('left')
      .tickSize(-this.width, 0, 0)
      .tickFormat(function (d) { return self.y.tickFormat(5, d3.format(',d'))(d) })
      .ticks(5);

    // Add axis
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(xAxis);

    this.svg.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
  }

  addStates() {
    var stateData = Object.entries(this.data.states).sort(
      function (a, b) { return a[0] > b[0]; }
    );

    for (let i = 0; i < stateData.length; i++) {
      let stateDataObject = stateData[i][1];

      stateDataObject = this.filterStates(stateDataObject);

      this.buildPaths(stateDataObject);
      this.buildLegend(stateDataObject, i);
    }
  }

  filterStates(stateDataObject) {}

  // from script
  buildPaths(d) {

    // setup variables for anonymous functions
    var self = this;
    var x = this.x;
    var y = this.y;

    // linear graph, needs changing for time axis
    var valueLine = d3.svg.line()
      .x(function (d, i) { return x(i); })
      .y(function (d) { return y(d); });

    this.svg.append('path')
      .attr('class', 'line')
      .style('stroke', function () {
        if (d.name != 'US Average') {
          return d.color = self.color(d.name);
        }
        // set US Average in CSS
        return;
      })
      .attr('id', 'line' + d.name.replace(/\s+/g, ''))
      // .attr('d', this.pathDataFunction(dataset))
      .attr('d', valueLine(d.cases))
      .on('mouseover', function () { self.highlight(d); })
      .on('mouseout', function () { self.removeHighlight(d); });
  }

  // from script
  buildLegend(d, i) {
    var legendWidthSpacing = this.width / 4
    var self = this;

    d.active = false
    this.svg.append('text')
      .attr('x', (legendWidthSpacing / 2 + Math.floor(i / 14) * legendWidthSpacing))
      .attr('y', this.height + 40 + (i % 14 * 20))
      .attr('class', 'legend')
      .attr('id', 'label' + d.name.replace(/\s+/g, ''))
      .style('fill', function () { return d.color = self.color(d.name); })
      .text(d.name)
      .on('mouseover', function () {
        if (!d.active) { self.setActive(d.name, true); }
      })
      .on('mouseout', function () {
        if (!d.active) { self.setActive(d.name, false); }
      })
      .on('click', function () {
        if (!d.active) { self.setActive(d.name, true); } else { self.setActive(d.name, false); }
        d.active = !d.active
      });
  }

  // from script
  setActive(name, value) {
    d3.select('#label' + name.replace(/\s+/g, ''))
      .classed('active', value);
    d3.select('#line' + name.replace(/\s+/g, ''))
      .classed('active', value);
  }

  // from script
  highlight(current) {
    this.setActive(current.name, true);
    this.showTooltip(current);
  }

  // from script
  removeHighlight(current) {
    this.tooltip.transition()
      .duration(100)
      .style('opacity', 0);

    if (!current.active) {
      this.setActive(current.name, false);
    }
  }
}