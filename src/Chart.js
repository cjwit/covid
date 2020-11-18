import "./d3.min.js";

export class Chart {
  constructor(title, margin) {

    // set the dimensions of the chart canvas
    this.width = 800 - margin.left - margin.right;
    this.height = 800 - margin.top - margin.bottom;

    // create svg element    
    this.svg = this.createSVG(margin);

    // create chart title (allow for multiple lines)
    if (typeof title == "object") {
      for (let i = 0; i < title.length; i++) {
        this.createChartTitle(title[i], i);
      }
    } else {
      this.createChartTitle(title)
    }


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

  async addData() {
    this.data = await this.getData();

    // complete setup after data is parsed
    this.setDomain();
    this.addAxes();
    this.addStates();
  }

  setDomain() {}

  async getData() {
    return new Promise((resolve, reject) => {
      d3.json('assets/data.json', function (error, data) {
        resolve(data);
      });
    })
  }

  addAxes() {
    // Define the axes
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

    // append axes
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

      this.buildPath(stateDataObject, i);
      this.buildLegend(stateDataObject, i);
    }
  }

  // adjust filter values
  filterStates(stateDataObject) {}

  // adjust path function
  buildPath(d, i) {}

  // adjust data used to calculate y
  appendPath(d, pathFunction) {}

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

  // adjust tooltip text
  showTooltip(current) {}

  setActive(name, value) {
    d3.select('#label' + name.replace(/\s+/g, ''))
      .classed('active', value);
    d3.select('#line' + name.replace(/\s+/g, ''))
      .classed('active', value);
  }

  highlight(current) {
    this.setActive(current.name, true);
    this.showTooltip(current);
  }

  removeHighlight(current) {
    this.tooltip.transition()
      .duration(100)
      .style('opacity', 0);

    if (!current.active) {
      this.setActive(current.name, false);
    }
  }
}