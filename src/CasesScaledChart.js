import "./d3.min.js";
import { Chart } from "./Chart.js";

export default class CasesScaledChart extends Chart {
  constructor(id, title, margin) {
    super(id, title, margin);
  }

  setRanges() {
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);
    this.color = d3.scale.category10();
  }

  setDomain() {
    // Dynamically scale the range of the data 
    this.dayOne = new Date(2020, 0, 21);
    var yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.x.domain([this.dayOne, yesterday]);
    this.y.domain([0, this.data.maxScaledCases]);
  }

  filterStates(stateDataObject) {
    // filter cases to show only 100
    stateDataObject.cases = stateDataObject.cases
      .filter(function (num) { return num >= 100; });
    return stateDataObject;
  }

  // from script
  buildPath(d, i) {

    // setup variables for anonymous functions
    var x = this.x;
    var y = this.y;

    // linear graph, needs changing for time axis
    var pathFunction = d3.svg.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return d.y > 0 ? y(d.y) : y(0) }); // fixing negative cases in Massachusets

    var pairs = this.createDatePairs(d);
    this.appendPath(d, pairs, pathFunction);
  }

  createDatePairs(d) {
    var pairs = [];
    for (var day = 0; day < this.data.totalDays; day++) {
      let currentDay = new Date(this.dayOne.valueOf() + day * 24 * 60 * 60 * 1000);
      pairs.push({ "date": currentDay, "y": d.scaledCases[day] });
    };
    return pairs;
  }

  appendPath(d, pairs, pathFunction) {
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
      .attr('id', 'line-' + this.id + "-" + d.name.replace(/\s+/g, ''))
      // .attr('d', this.pathDataFunction(dataset))
      .attr('d', pathFunction(pairs))
      .on('mouseover', function () { self.highlight(d); })
      .on('mouseout', function () { self.removeHighlight(d); });
  }

  showTooltip(current) {
    this.tooltip.transition()
      .duration(100)
      .style('opacity', .9);

    this.tooltip.html(function () {
      var lastScaled = Number(current.scaledCases[current.scaledCases.length - 1]);
      var roundedLastScaled = Math.round(lastScaled * 100) / 100;
      var totalCases = current.cases[current.cases.length - 1].toLocaleString();
      return '<b>' + current.name + '</b> ' + roundedLastScaled.toLocaleString() + '% of population</br> ' + totalCases + ' total cases';
    })
      .style('left', (d3.event.pageX - 150) + 'px')
      .style('top', (d3.event.pageY - 60) + 'px');
  }
}