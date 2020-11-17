import "./d3.min.js";

export default class Chart {
  constructor(title, margin) {
    console.log("constructor");

    // set the dimensions of the chart canvas
    this.width = 800 - margin.left - margin.right;
    this.height = 800 - margin.top - margin.bottom;

    // create svg element    
    this.svg = this.createSVG(margin);
    this.createChartTitle(title)
    return this.svg;
  }

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

    return;
  }
}