import React from 'react';
import styled from 'styled-components';

import env from '../chicken-little/env';

export default class ChickenLittle extends React.Component {
  state = {
    environment: env.reset(),
    play: false,
    agent: null,
    interval: null,
    selectedAgentIndex: 0,
    showSidebar: false,
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  // Update by a single step (called by setInterval)
  step = () => {
    var { agent } = this.state;
    var feedback = agent.act(this.state.environment, env);
    var done = feedback.done;
    this.setState({ environment: feedback.observation });

    if (done) {
      this.togglePlay(false);
    }
  }

  // Returns 0 (or 1 if full) if block is at the given coordinate for rendering
  blockHere = (j, i) => {
    var { aX, aY, bX, bY, cX, cY, agentX } = this.state.environment;
    if (i === agentX && j === 1) {
      return '｡';
    } else if (i === agentX && j === 0) {
      return 'Д';
    } else if (i === aX && j === aY) {
      return 'ბ';
    } else if (i === bX && j === bY) {
      return 'ბ';
    } else if (i === cX && j === cY) {
      return 'ბ';
    }
    return ' ';
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
    this.setState({ environment: env.mTPReset() });
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
          <X>{this.blockHere(6, 0)}</X>:
          <X>{this.blockHere(6, 1)}</X>:
          <X>{this.blockHere(6, 2)}</X>:
          <X>{this.blockHere(6, 3)}</X>:
          <X>{this.blockHere(6, 4)}</X>|
        </div>
        <div>|
          <X>{this.blockHere(5, 0)}</X>:
          <X>{this.blockHere(5, 1)}</X>:
          <X>{this.blockHere(5, 2)}</X>:
          <X>{this.blockHere(5, 3)}</X>:
          <X>{this.blockHere(5, 4)}</X>|
        </div>
        <div>|
          <X>{this.blockHere(4, 0)}</X>:
          <X>{this.blockHere(4, 1)}</X>:
          <X>{this.blockHere(4, 2)}</X>:
          <X>{this.blockHere(4, 3)}</X>:
          <X>{this.blockHere(4, 4)}</X>|
        </div>
        <div>|
          <X>{this.blockHere(3, 0)}</X>:
          <X>{this.blockHere(3, 1)}</X>:
          <X>{this.blockHere(3, 2)}</X>:
          <X>{this.blockHere(3, 3)}</X>:
          <X>{this.blockHere(3, 4)}</X>|
        </div>
        <div>|
          <X>{this.blockHere(2, 0)}</X>:
          <X>{this.blockHere(2, 1)}</X>:
          <X>{this.blockHere(2, 2)}</X>:
          <X>{this.blockHere(2, 3)}</X>:
          <X>{this.blockHere(2, 4)}</X>|
        </div>
        <div>|
          <X>{this.blockHere(1, 0)}</X>:
          <X>{this.blockHere(1, 1)}</X>:
          <X>{this.blockHere(1, 2)}</X>:
          <X>{this.blockHere(1, 3)}</X>:
          <X>{this.blockHere(1, 4)}</X>|
        </div>
        <div>|
          <X>{this.blockHere(0, 0)}</X>:
          <X>{this.blockHere(0, 1)}</X>:
          <X>{this.blockHere(0, 2)}</X>:
          <X>{this.blockHere(0, 3)}</X>:
          <X>{this.blockHere(0, 4)}</X>|
        </div>
        <div>+---------+</div>
      </div>
    );
  }

  renderActionLog = () => {
    var output;
    switch (this.state.environment.actionLog) {
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
        <Tag>
          Experiment No.2
          <Title>Chicken Little</Title>
        </Tag>
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

const SidebarTab = styled.div`
  width: 30px;
  height: 60px;
  border-top-right-radius: 60px;
  border-bottom-right-radius: 60px;
  background: #ffffff33;
  position: fixed;
  top: calc(50vh - 60px);
  left: 0;
  cursor: pointer;

  > i {
    margin-top: 16px;
    color: white;
    font-size: 25px;
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  > i {
    color: #ffffff;
  }
`;

const Sidebar = styled.div`
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff22;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  color: white;
  padding: 50px 25px 50px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  opacity: 0;
  animation: float-sidebar 0.8s 0s;
  animation-fill-mode: forwards;
  @keyframes float-sidebar {
    from { left: -200px; opacity: 1; }
    to   { left: 0px; opacity: 1; }
  }
`;

const SidebarTitle = styled.div`
  margin-top: -50px;
  margin-bottom: 20px;
  margin-left: 5px;
  font-size: 16px;
  color: #ffffff88;
`;

const SidebarButton = styled.div`
  width: 100%;
  padding: 10px 15px;
  font-weight: 300;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 5px;
  background: ${props => props.selected ? '#ffffff11' : ''};

  :hover {
    background: #ffffff22;
  }
`;

const Line = styled.div`
  height: 1px;
  width: 200px;
  background: #ffffff88;
  width: 90px;
  margin-top: 10px;
`;

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
  background: ${props => props.block === 0 ? '#fcdf03dd' : props.block === 1 ? '#86f0c4dd' : ''};
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
  padding-top: 40px;
  font-weight: 300;
  color: #ffffff99;
  user-select: none;
`;

const Tag = styled.div`
  color: #ffffff66;
  letter-spacing: 3px;
  @import url('https://fonts.googleapis.com/css?family=Open+Sans&display=swap');
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  text-align: center;
  position: fixed;
  top: 50px;
  width: 200px;
  left: calc(50vw - 100px);
  user-select: none;
`;

const Title = styled.div`
  margin-top: 12px;
  font-size: 20px;
  color: #ffffff99;
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
  background: #c28580;
`;
