import React from 'react';
import './ClockFace.css';

export default class ClockFace extends React.Component {
    render(){
        // this.props.color can be white or black
        // this.props.seconds_remaining is int
        // this.props.active is bool



        // Calculate time to display given the total seconds
        let running_time = this.props.seconds_remaining;

        let hours = Math.floor(running_time / 3600);
        running_time -= hours * 3600;
        let minutes = Math.floor(running_time / 60);
        let seconds = running_time - minutes * 60;
        
        // Hide hours from display if the hours count is 0
        if(hours > 0){
            hours += ':'
        }else{
            hours = '';
        }

        // Pad single-digit minutes and seconds with a leading 0
        if (minutes < 10 ){
            minutes = "0" + minutes;
        }
        if (seconds < 10 ){
            seconds = "0" + seconds;
        }

        // Set background color based on chess piece color
        let backgroundColor = this.props.color == 'white' ? '#EFD4CE' : '#22333B';

        // render
        return(
            <div className={"clockFace" + (this.props.active ? ' active' : '')} style={{backgroundColor:backgroundColor}}>
                <p className="clockFaceText">{hours}{minutes}:{seconds}</p>
            </div>
        )
    }
}