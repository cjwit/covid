import "./d3.min.js";
import { Chart } from "./Chart.js";


export default class DeathsChart extends Chart {
  constructor(title, margin) {
    super(title, margin);
  }

  setRanges() {
    this.x = d3.scale.linear().range([0, this.width]);
    this.y = d3.scale.log().range([this.height, 0]);
    this.color = d3.scale.category10();
  }

  setDomain() {
    // Dynamically scale the range of the data 
    // using Washington (where first cases appear)
    var daysOver10 = this.data.states['Washington'].cases.filter(
      function (n) { return n >= 10; })
      .length
    this.x.domain([0, daysOver10]);
    this.y.domain([10, this.data.maxDeaths]);
  }

  // override to remove average
  async getData() {
    return new Promise((resolve, reject) => {
      d3.json('assets/data.json', function (error, data) {
        delete data.states["US Average"];
        resolve(data);
      });
    })
  }

  filterStates(stateDataObject) {
    // filter cases to show only 100
    stateDataObject.deaths = stateDataObject.deaths
      .filter(function (num) { return num >= 10; });
    return stateDataObject;
  }

  // from script
  buildPath(d, i) {

    // setup variables for anonymous functions
    var x = this.x;
    var y = this.y;

    // linear graph, needs changing for time axis
    var pathFunction = d3.svg.line()
      .x(function (d, i) { return x(i); })
      .y(function (d) { return y(d); });

    this.appendPath(d, pathFunction);
  }

  appendPath(d, pathFunction) {
    var self = this;

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
      .attr('d', pathFunction(d.deaths))
      .on('mouseover', function () { self.highlight(d); })
      .on('mouseout', function () { self.removeHighlight(d); });
  }

  showTooltip(current) {
    this.tooltip.transition()
      .duration(100)
      .style('opacity', .9);

    this.tooltip.html(function () {
      var lastDeath = Number(current.deaths[current.deaths.length - 1]);
      return '<b>' + current.name + '</b> ' + lastDeath.toLocaleString() + ' total deaths';
    })
      .style('left', (d3.event.pageX - 150) + 'px')
      .style('top', (d3.event.pageY - 50) + 'px');
  }
}