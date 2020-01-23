import React from 'react';
import styled from 'styled-components';
import createPlotlyComponent from 'react-plotly.js/factory';

import { data as ES } from '../rastrigin/freezer/ES.js'
import { data as GA } from '../rastrigin/freezer/GA.js'
import { data as CMA } from '../rastrigin/freezer/CMA.js'

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default class Rastrigin extends React.Component {
  state = {
    source: ES,
    selectedIndex: 0,
    play: false,
    z: null,
    x: null,
    y: null,
    currentPop: null,
    currentGen: -1,
    shapes: null,
  }

  setAgent = (source, i) => {
    this.setState({ source, selectedIndex: i, currentPop: source[0] });
  }

  // Update by a single step (called by setInterval)
  step = () => {
    var i = this.state.currentGen;
    if (i < this.state.source.length - 1) {
      this.setState({ currentGen: i + 1, currentPop: this.state.source[i + 1] });
    } else {
      this.togglePlay(false);
    }
  }

  handleReset = () => {
    this.setState({ currentPop: this.state.source[0], currentGen: 0 });
    this.togglePlay(false);
  }

  togglePlay = (play) => {
    this.setState({ play });
    if (play) {
      var interval = setInterval(this.step, 100);
      this.setState({ interval });
    } else {
      clearInterval(this.state.interval);
    }
  }

  componentDidMount() {
    const size = 100
    this.x = new Array(size)
    this.y = new Array(size)
    this.z = new Array(size);

    for(let i = 0; i < size; i++) {
    	this.x[i] = (-50 + i) / 10;
      this.y[i] = (-50 + i) / 10;
      	this.z[i] = new Array(size);
    }

    for(let i=0; i < size; i++) {
      	for(let j=0; j < size; j++) {
          let x = this.x[i];
          let y = this.y[j];
        	this.z[i][j] = 20 + Math.pow(x, 2) - 10 * Math.cos(2 * Math.PI * x) + Math.pow(y, 2) - 10 * Math.cos(2 * Math.PI * y);
        }
    }
    this.setState({ z: this.z, x: this.x, y: this.y });
    this.step();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentGen !== this.state.currentGen) {
      var shapes = [];
      for (var i=0; i < this.state.source[0].length; i++) {
        shapes.push(
        {
          type: 'circle',
          xref: 'x',
          yref: 'y',
          x0: this.state.currentPop[i][0][0],
          y0: this.state.currentPop[i][1][0],
          x1: this.state.currentPop[i][0][0] + 0.1,
          y1: this.state.currentPop[i][1][0] + 0.1,
          fillcolor: '#edeb64',
          line: {
              width: 0
          }
        }
        )
      }
      this.setState({ shapes })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  renderPlaybackButton = () => {
    if (!this.state.play) {
      return (
        <Button onClick={() => this.togglePlay(true)}>
          <i className="material-icons">play_arrow</i>
          <Label>Play</Label>
        </Button>
      );
    }
    return (
      <Button onClick={() => this.togglePlay(false)}>
        <i className="material-icons">pause</i>
        <Label>Pause</Label>
      </Button>
    );
  }

  renderAscii = () => {
    return (
      <Plot
              data={[
                {
                  z: this.state.z,
                  x: this.state.x,
                  y: this.state.y,
                  type: 'contour',
                  colorscale: [
    ['0', '#ffffff'],
    ['0.25', '#ffffff77'],
    ['0.5', '#ffffff44'],
    ['0.75', '#ffffff33'],
    ['1.0', '#ffffff22']
                  ],
                  contours: {
                    coloring: 'lines',
                  },
                  colorbar: {
                    outlinecolor: '#ffffff33',
                    tickfont: {
                      color: '#ffffff55',
                    },
                  }
                },
              ]}
              layout={{
                shapes: this.state.shapes,
                xaxis: {range: [-5.12, 5.12], zeroline: false, color: '#ffffff55', gridcolor: '#ffffff55' },
                yaxis: {range: [-5.12, 5.12], zeroline: false, color: '#ffffff55', gridcolor: '#ffffff55' },
                width: 515,
                height: 440,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                margin: {
                  l: 30,
                  t: 10,
                  b: 30,
                }
              }}
              config={{ displayModeBar: false }}
            />
    );
  }

  render() {
    return (
      <StyledMain>
        <DisplayWrapper>
          <Ascii>
            {this.renderAscii()}
          </Ascii>
        </DisplayWrapper>
        <NavBar>
          {this.renderPlaybackButton()}
          <Button onClick={this.handleReset}>
            <i className="material-icons">restore</i>
            <Label>Reset</Label>
          </Button>
        </NavBar>
      </StyledMain>
    );
  }
}

const Label = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400&display=swap');
  color: white;
  font-family: 'Open Sans', sans-serif;
  font-size: 10px;
  margin-top: -3px;
`;

const Button = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px;
  user-select: none;
  text-align: center;
  margin: 10px;
  margin-top: 15px;
  :hover {
    background: #ffffff22;
  }
  > i {
    color: #ffffffdd;
    font-size: 25px;
  }
`;

const NavBar = styled.div`
  position: fixed;
  width: 150px;
  height: 60px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background: #ffffff22;
  bottom: 0;
  left: calc(50vw - 75px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  opacity: 0;
  animation: float-nav 1s 1s;
  animation-fill-mode: forwards;
  @keyframes float-nav {
    from { bottom: -70px; opacity: 0; }
    to   { bottom: 0px; opacity: 1; }
  }
`;

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Ascii = styled.div`
  letter-spacing: 2px;
  text-align: center;
  padding-top: 40px;
  font-weight: 300;
  color: #ffffff99;
  user-select: none;
`;

const StyledMain = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Roboto+Mono:300,400&display=swap');
  font-family: 'Roboto Mono', monospace;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #41a671;
`;
