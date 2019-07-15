import React from 'react';
import { NavLink } from 'react-router-dom';
import './style.css';
import Tweets from '../Tweets';


export default class Charts extends React.Component {

    render() {
        return (
            <div className="tweetsContainer">
               <Tweets isSlider={true} />
            </div>
        )
    }
}