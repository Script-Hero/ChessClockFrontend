import './App.css';
import React from 'react';

import { io } from "socket.io-client";

import ClockFace from './ClockFace.js';
import {ReactComponent as ResetIcon} from './reset.svg';

export default class App extends React.Component {

  

  constructor(props){
    super(props);
    this.startTime = 45 // CONFIG the starting seconds on every clock
    this.state = {
      clock1Active :false,
      clock2Active:false,
      clock3Active:false,
      clock4Active:false,
      clock1Seconds:this.startTime,
      clock2Seconds:this.startTime, 
      clock3Seconds:this.startTime,
      clock4Seconds:this.startTime
    }

    this.receiveData = this.receiveData.bind(this);
    this.countDown = this.countDown.bind(this);
    this.reset = this.reset.bind(this);

    this.timer = setInterval(this.countDown, 1000); // Start update loop that counts down active clocks every second
  }


  // Resets clock to default state
  reset(){
    this.setState({
      clock1Active :false,
      clock2Active:false,
      clock3Active:false,
      clock4Active:false,
      clock1Seconds:this.startTime,
      clock2Seconds:this.startTime, 
      clock3Seconds:this.startTime,
      clock4Seconds:this.startTime
    });
    clearInterval(this.timer);
    this.timer = setInterval(this.countDown, 1000);
  }


  // Sets active clock states from websocket input from backend Express server
  receiveData(data){
    this.setState({
      clock1Active: data[0] == 1,
      clock2Active: data[1] == 1,
      clock3Active: data[2] == 1,
      clock4Active: data[3] == 1,
    })
  }

  // Decrement active clocks by 1
  countDown(data){
    let clock1Seconds = this.state.clock1Seconds;
    let clock2Seconds = this.state.clock2Seconds;
    let clock3Seconds = this.state.clock3Seconds;
    let clock4Seconds = this.state.clock4Seconds;

    if(this.state.clock1Active){
      clock1Seconds -=1;
    }
    if(this.state.clock2Active){
      clock2Seconds -=1;
    }

    if(this.state.clock3Active){
     clock3Seconds -=1;
    }

    if(this.state.clock4Active){
      clock4Seconds -=1;
    }


    // Stops clocks from counting when anyone loses on time
    if(clock1Seconds == 0 || clock2Seconds == 0 || clock3Seconds == 0 || clock4Seconds == 0){
      clearInterval(this.timer);
    }


    this.setState({
      clock1Seconds, clock2Seconds, clock3Seconds, clock4Seconds
    })

  }

  // Connect to backend websockets server to receive Arduino serialport data
  componentDidMount() {
    this.socket = io('localhost:4000', {
      transports: ['websocket']
    });

    this.socket.on('data', async function(data){
      this.receiveData(data)
    }.bind(this));
  }
  



  render(){
    return(
      <div id='body'>

        <div id='reset-button' onClick={this.reset}>
          <ResetIcon id='reset-icon'/>
        </div>

        <div id="clock-zone">
          <div className="clock-row" id="row-1">
            <ClockFace color={'white'} seconds_remaining={this.state.clock1Seconds} active={this.state.clock1Active} />
            <ClockFace color={'black'} seconds_remaining={this.state.clock2Seconds}  active={this.state.clock2Active}/>
          </div>

          <div className="clock-row" id="row-2">
            <ClockFace color={'black'} seconds_remaining={this.state.clock3Seconds} active={this.state.clock3Active}/>
            <ClockFace color={'white'} seconds_remaining={this.state.clock4Seconds} active={this.state.clock4Active}/>
          </div>
        </div>
      </div>
    )
  }
}