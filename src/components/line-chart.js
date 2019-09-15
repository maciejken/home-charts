import React, { Component } from 'react';
import * as d3 from 'd3';
import './line-chart.css';

function getDomain(data) {
  return [Math.min(...data), Math.max(...data)];
}

class LineChart extends Component {

  getChartOptions() {
    var chart = {};
    chart.margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 50
    };
    chart.width = window.innerWidth - chart.margin.left - chart.margin.right - 30;
    chart.height = window.innerHeight - chart.margin.top - chart.margin.bottom - 40;
    chart.data = this.props.data;
    chart.xData = chart.data.map(d => d.x);
    chart.xDomain = getDomain(chart.xData);
    chart.xScale = d3.scaleTime()
      .domain(chart.xDomain)
      .range([0, chart.width]);
    chart.xAxis = d3.axisBottom(chart.xScale).tickFormat(d3.timeFormat('%d.%m'));
    chart.series = this.props.series;
    chart.yData = chart.data.map(d => d[chart.series]);
    chart.yDomain = getDomain(chart.yData);
    chart.yScale = d3.scaleLinear()
      .domain(chart.yDomain)
      .range([chart.height, 0]);
    chart.yAxis = d3.axisLeft(chart.yScale);
    chart.line = d3.line()
      .x(d => chart.xScale(d.x))
      .y(d => chart.yScale(d[chart.series]))
      .curve(d3.curveMonotoneX);
    
    return chart;
  }

  drawChart(chart) {
    d3.select(".chart").selectAll("svg").remove();
    var svg = d3.select(".chart").append("svg")
      .attr("width", chart.width + chart.margin.left + chart.margin.right)
      .attr("height", chart.height + chart.margin.top + chart.margin.bottom)
      .append("g")
      .attr("transform", `translate(${chart.margin.left}, ${chart.margin.top})`);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${chart.height})`)
      .call(chart.xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(chart.yAxis);

    svg.append("path")
      .datum(chart.data)
      .attr("class", "line")
      .attr("d", chart.line);

    svg.selectAll(".dot")
      .data(chart.data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("cx", d => chart.xScale(new Date(d.x)))
      .attr("cy", d => chart.yScale(d[chart.series]))
      .attr("r", 4)
      .on("mouseover", function(a, b, c) {
        console.log(a)
        d3.select(this).attr('class', 'focus');
    }).on("mouseout", function(a, b, c) {
        console.log(a)
        d3.select(this).attr('class', 'dot');
    });
  }

  componentDidMount() {
    this.drawChart(this.getChartOptions());
  }

  componentDidUpdate() {
    this.drawChart(this.getChartOptions());
  }

  render() {
    return <div className="chart"></div>;  
  }

}

export { LineChart };
