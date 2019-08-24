import React, { Component } from 'react';
import axios from 'axios';
import { LineChart } from './components';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      yName: 'y1'
    };
    this.handleClick = this.handleClick.bind(this);
  }
  async componentDidMount() {
    var response = await axios.get('/sensors/dht22/hourly');
    this.setState({ data: response.data });
  }

  handleClick(e) {
    this.setState({ yName: e.target.value });
  }

  render() {
    return (
      <div className="App">
        <div className="select-data">
          <div>
            <input onClick={this.handleClick} type="radio" id="temperature" name="data" value="y1" />
            <label for="temperature">Temperature</label>
          </div>
          <div>
            <input onClick={this.handleClick} type="radio" id="humidity" name="data" value="y2" />
            <label for="humidity">Humidity</label>
          </div>
        </div>
        <LineChart data={this.state.data} yName={this.state.yName} />
      </div>
    );    
  }

}

export default App;
