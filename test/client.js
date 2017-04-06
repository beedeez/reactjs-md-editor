
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Example from './views/example';

class App extends Component {
  render() {
    return (<Example />);
  }
}
ReactDOM.render(<App/>, document.getElementById('app'));
