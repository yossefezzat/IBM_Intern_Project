import React from 'react';
import './App.css';
//Libs
import { BrowserRouter as Router, Route } from 'react-router-dom';
//Components
import NavBar from './components/NavBar';
import About from './components/About';
import Charts from './components/Charts';
import Tweets from './components/Tweets';


export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Router>

          <Route path="/about" component={About} />
          <Route path="/" exact={true} component={Charts} />
          <Route path="/tweets" component={Tweets} />

        </Router>

      </div>
    )
  }
}
