import "./d3.min.js";

export default class Chart {
  constructor(margin) {
    console.log("constructor");

    // set the dimensions of the chart canvas
    this.width = 800 - margin.left - margin.right;
    this.height = 800 - margin.top - margin.bottom;

    // create svg element
    var svg = d3.select('#container')
      .append('svg')
      .attr('width', '100%')
      .attr('viewBox', '0 0 800 800')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')');
    
    return svg;
  }
}