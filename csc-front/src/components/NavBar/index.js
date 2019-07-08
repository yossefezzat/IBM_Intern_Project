import React from 'react';
import './style.css';
import logo from "./assets/logo.png";
import{NavLink} from 'react-router-dom';
export default class NavBar extends React.Component {

    render(){
        return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a class="navbar-brand ml-5" href="index.html"> <img src={logo} width="100" height="50" /> </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto px-3">
            <li class="nav-item">
              <NavLink to="/about" activeClassName="active" class="badge badge-pill badge-primary">About</NavLink>
            </li>
            <li class="nav-item">
            <NavLink to="/charts" activeClassName="active" class="badge badge-pill badge-primary">Charts</NavLink>
            </li>
             <li class="nav-item">
             <NavLink href="/tweets" activeClassName="active" class="badge badge-pill badge-primary">Tweets</NavLink>
            </li>
          </ul>
          
        </div>
      </nav>  )  
      
    }
}