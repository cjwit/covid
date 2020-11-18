import "./d3.min.js";
import { Chart } from "./Chart.js";


export default class LogLinearChart extends Chart {
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
    var daysOver100 = this.data.states['Washington'].cases.filter(
      function (n) { return n >= 100; })
      .length
    this.x.domain([0, daysOver100]);
    this.y.domain([100, this.data.maxCases]);
  }

  filterStates(stateDataObject) {
    // filter cases to show only 100
    stateDataObject.cases = stateDataObject.cases
      .filter(function (num) { return num >= 100; });
    return stateDataObject;
  }

}