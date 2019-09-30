import React, { Component } from 'react';
import axios from 'axios';
import { LineChart } from './components';
import { RadioGroup } from './components';
import './reset.css';
import './App.css';

class App extends Component {
  measurements = [
    { id: "measurement-temperature", label: "Temperature C", value: "temperature" },
    { id: "measurement-humidity", label: "Humidity %", value: "humidity" }
  ];
  periods = [
    { id: "period-1d", label: "1 day", value: "1d" },
    { id: "period-7d", label: "1 week", value: "7d" },
    { id: "period-30d", label: "1 month", value: "30d" },
    { id: "period-365d", label: "1 year", value: "365d" }
  ];
  durations = [
    { id: "duration-10m", label: "10 min", value: "10m" },
    { id: "duration-1h", label: "1 hour", value: "1h" },
    { id: "duration-1d", label: "1 day", value: "1d" }
  ];
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      measurement: "temperature",
      period: "7d",
      duration: "1h"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    await this.updateState({...this.state});
  }

  async handleChange(e) {
    var { name, value } = e.target;
    var update = {};
    update[name] = value;
    await this.updateState(update);
  }

  async updateState(update) {
    try {
      update.data = await this.getData(update);
      this.setState({...update});
    } catch (err) {
      console.error(new Error(`Unable to update app state: ${err}`));
    }
  }

  async getData(params) {
    const { measurement, period, duration } = {...this.state, ...params};
    const uri = `/api/${measurement}?period=${period}&duration=${duration}`;
    var response = await axios.get(uri);
    return response.data;
  }

  render() {
    var { data, duration, measurement, period } = this.state;

    return (
      <div className="App">
        <div className="chart-controls">
          <RadioGroup
            name="measurement"
            value={measurement}
            onChange={this.handleChange}
            buttons={this.measurements}
          />
          <RadioGroup
            name="period"
            value={period}
            onChange={this.handleChange}
            buttons={this.periods}
          />
          <RadioGroup
            name="duration"
            value={duration}
            onChange={this.handleChange}
            buttons={this.durations}
          />
        </div>
        <LineChart data={data} series={measurement} />
      </div>
    );    
  }

}

export default App;
