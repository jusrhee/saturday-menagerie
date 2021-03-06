import React from 'react';
import styled from 'styled-components';

import { Driver } from '../taxi-v3/agents';
import env from '../taxi-v3/env';

export default class Main extends React.Component {
  state = {
    environment: env.mTPReset(),
    actionLog: null,
    play: false,
    agent: null,
    interval: null,
    selectedAgentIndex: 0,
  }

  importAll = (r) => {
    return r.keys().map(r);
  }

  componentDidMount() {
    /*
    this.setAgent(data_0, 0);
    */
    var freezer = this.importAll(require.context('./freezer', false, /\.(js)$/));
    console.log('taxi');
    console.log(freezer);
    this.props.openFreezer(freezer);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  // Update by a single step (called by setInterval)
  step = () => {
    var { agent } = this.state;
    var feedback = agent.act(this.state.environment, env);
    var done = feedback.done;
    this.setState({
      environment: feedback.observation,
      actionLog: feedback.info.actionLog,
    });

    if (done) {
      this.togglePlay(false);
    }
  }

  // Returns 0 (or 1 if full) if cab is at the given coordinate for rendering
  cabHere = (j, i) => {
    var { taxiRow, taxiColumn, passenger } = this.state.environment;
    if (i === taxiColumn && j === taxiRow) {
      if (passenger === 4) {
        return 1;
      }
      return 0;
    }
    return -1;
  }

  isPickup = (loc) => {
    var { passenger } = this.state.environment;
    if (loc === passenger) {
      return true;
    }
    return false;
  }

  isDest = (loc) => {
    var { destination } = this.state.environment;
    if (loc === destination) {
      return true;
    }
    return false;
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

  handleReset = () => {
    this.setState({ environment: env.mTPReset(), actionLog: null });
  }

  setAgent = (params, i) => {
    var agent = new Driver(params);
    this.setState({ agent, selectedAgentIndex: i });
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
      <div>
        <div>+---------+</div>
        <div>|
          <X
            cab={this.cabHere(0, 0)}
            pickup={this.isPickup(0)}
            dest={this.isDest(0)}
          >
            R
          </X>:
          <X cab={this.cabHere(0, 1)}> </X>|
          <X cab={this.cabHere(0, 2)}> </X>:
          <X cab={this.cabHere(0, 3)}> </X>:
          <X
            cab={this.cabHere(0, 4)}
            pickup={this.isPickup(1)}
            dest={this.isDest(1)}
          >
            G
          </X>|
        </div>
        <div>|
          <X cab={this.cabHere(1, 0)}> </X>:
          <X cab={this.cabHere(1, 1)}> </X>|
          <X cab={this.cabHere(1, 2)}> </X>:
          <X cab={this.cabHere(1, 3)}> </X>:
          <X cab={this.cabHere(1, 4)}> </X>|
        </div>
        <div>|
          <X cab={this.cabHere(2, 0)}> </X>:
          <X cab={this.cabHere(2, 1)}> </X>:
          <X cab={this.cabHere(2, 2)}> </X>:
          <X cab={this.cabHere(2, 3)}> </X>:
          <X cab={this.cabHere(2, 4)}> </X>|
        </div>
        <div>|
          <X cab={this.cabHere(3, 0)}> </X>|
          <X cab={this.cabHere(3, 1)}> </X>:
          <X cab={this.cabHere(3, 2)}> </X>|
          <X cab={this.cabHere(3, 3)}> </X>:
          <X cab={this.cabHere(3, 4)}> </X>|
        </div>
        <div>|
          <X
            cab={this.cabHere(4, 0)}
            pickup={this.isPickup(2)}
            dest={this.isDest(2)}
          >
            Y
          </X>|
          <X cab={this.cabHere(4, 1)}> </X>:
          <X cab={this.cabHere(4, 2)}> </X>|
          <X
            cab={this.cabHere(4, 3)}
            pickup={this.isPickup(3)}
            dest={this.isDest(3)}
          >
            B
          </X>:
          <X cab={this.cabHere(4, 4)}> </X>|
        </div>
        <div>+---------+</div>
      </div>
    );
  }

  renderActionLog = () => {
    var output;
    switch (this.state.actionLog) {
      case 0:
        output = '(South)';
        break;
      case 1:
        output = '(North)';
        break;
      case 2:
        output = '(East)';
        break;
      case 3:
        output = '(West)';
        break;
      case 4:
        output = '(Pickup)';
        break;
      case 5:
        output = '(Dropoff)';
        break;
      default:
          output = '(Start)';
    }
    return <ActionLog>{output}</ActionLog>;
  }

  render() {
    return (
      <StyledMain>
        <DisplayWrapper>
          <Ascii>
            {this.renderAscii()}
            {this.renderActionLog()}
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

const ActionLog = styled.div`
  margin-top: 20px;
`;

const X = styled.span`
  color: ${props => props.pickup ? '#FF99E9' : props.dest ? '#5EB9ED' : ''};
  background: ${props => props.cab === 0 ? '#fcdf03dd' : props.cab === 1 ? '#86f0c4dd' : ''};
`;

const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Ascii = styled.div`
  width: 300px;
  height: 300px;
  letter-spacing: 2px;
  text-align: center;
  padding-top: 50px;
  font-weight: 300;
  color: #ffffff55;
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
  background: #313E6B;
`;
