import React, { Component } from 'react';
import axios from 'axios';
import { LineChart } from './components';
import { RadioGroup } from './components';
import './App.css';

class App extends Component {
  datatypes = [
    { id: "direct-measurement", label: "Direct measurement" },
    { id: "hourly-average", label: "Hourly average" },
    { id: "daily-average", label: "Daily average" }
  ];
  timeframes = [
    { id: "hourly", label: "Last hour" },
    { id: "daily", label: "Last day" },
    { id: "weekly", label: "Last week" },
    { id: "monthly", label: "Last month" },
    { id: "yearly", label: "Last year" }
  ];
  datasets = [
    { id: "temperature", label: "Temperature C" },
    { id: "humidity", label: "Humidity %" }
  ];
  constructor(props) {
    super(props);
    const datatype = "hourly-average";
    const allowedTimeframes = this.getAllowedTimeframes(datatype);
    this.state = {
      data: [],
      datatype,
      timeframe: "weekly",
      allowedTimeframes,
      dataset: "temperature"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    var { datatype, timeframe } = this.state;
    var data = await this.getData(datatype, timeframe);
    this.updateState({ data });
  }

  async handleChange(e) {
    var { id, name } = e.target;
    var update = {};
    update[name] = id;
    await this.updateState(update);
  }

  getAllowedTimeframes(datatype) {
    var allowedIds = getAllowedTimeframeIds(datatype);
    return this.timeframes.filter(timeframe => allowedIds.includes(timeframe.id));
  }

  async updateState(update) {
    var { datatype } = this.state;
    if (update.datatype) {
      update.allowedTimeframes = this.getAllowedTimeframes(update.datatype);
      update.timeframe = update.allowedTimeframes[0].id;
      update.data = await this.getData(update.datatype, update.timeframe);
    } else if (update.timeframe) {
      update.data = await this.getData(datatype, update.timeframe);
    }
    this.setState({...update});
  }

  async getData(datatype, timeframe) {
    var response = await axios.get(`/sensors/dht22/${datatype}s/${timeframe}`);
    return response.data;
  }

  render() {
    var {
      allowedTimeframes,
      data,
      dataset,
      datatype,
      timeframe
    } = this.state;

    return (
      <div className="App">
        <div className="chart-controls">
          <RadioGroup
            name="datatype"
            value={datatype}
            onChange={this.handleChange}
            buttons={this.datatypes}
          />
          <RadioGroup
            name="timeframe"
            value={timeframe}
            onChange={this.handleChange}
            buttons={allowedTimeframes}
          />
          <RadioGroup
            name="dataset"
            defaultValue={dataset}
            onChange={this.handleChange}
            buttons={this.datasets}
          />
        </div>
        <LineChart data={data} series={dataset} />
      </div>
    );    
  }

}

function getAllowedTimeframeIds(datatype) {
  switch (datatype) {
    case "direct-measurement":
      return ["hourly", "daily"];
    case "hourly-average":
      return ["daily", "weekly"];
    case "daily-average":
      return ["weekly", "monthly", "yearly"];
    default:
      throw new Error(`Unsupported data type: ${datatype}`);
  }
}

export default App;
