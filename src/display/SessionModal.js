import React from 'react';
import Selector from './Selector.js';
import axios from 'axios';
import data from './rosetta';
import io from 'socket.io-client';

import styled from 'styled-components'

export default class SessionModal extends React.Component {
  state = {
    sessionName: '',
    selectedEnv: null,
    selectedHeuristic: null,
    selectedAgent: null,
    heuristicSettings: {},
    agentConfig: {},
    showHeuristicSettings: false,
    showAgentConfig: false,
    socket: null,
  }

  componentDidMount() {
    var socket = io('http://localhost:8001');
    socket.on('logs', data => console.log(data));
  }

  submit = () => {
    var { sessionName, selectedEnv, selectedHeuristic, selectedAgent, heuristicSettings, agentConfig } = this.state;

    for (var key in heuristicSettings) {
      heuristicSettings[key] = parseFloat(heuristicSettings[key]);
    }

    if (agentConfig.architecture) {
      agentConfig.architecture = JSON.parse(agentConfig.architecture);
    }

    var data = {
      env: selectedEnv,
      heuristic: selectedHeuristic.value,
      settings: heuristicSettings,
      agent: selectedAgent.value,
      config: agentConfig,
      title: sessionName
    };

    axios.post('http://localhost:8000/train', { data: data })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  onHSChange = (e, name) => {
    this.state.heuristicSettings[name] = e.target.value;

    // Lmao holy shit we've transcended
    this.forceUpdate();
  }

  onACChange = (e, name) => {
    this.state.agentConfig[name] = e.target.value;

    // Lmao holy shit we've transcended
    this.forceUpdate();
  }

  renderHeuristicSettings = () => {
    var { heuristicSettings } = this.state;
    if (this.state.showHeuristicSettings) {
      return (
        <Subsection>
          {this.state.selectedHeuristic.settings.map((name, i) => {
            return (
              <div key={i}>
                <FieldLabel>{name}:</FieldLabel>
                <Field
                  value={heuristicSettings[name] || ''}
                  onChange={(e) => this.onHSChange(e, name)}
                />
              </div>
            );
          })}
        </Subsection>
      )
    }
  }

  renderAgentConfig = () => {
    if (this.state.showAgentConfig) {
      return (
        <Subsection>
          <FieldLabel>NN:</FieldLabel>
          <Field
            value={this.state.agentConfig['architecture'] || ''}
            onChange={(e) => this.onACChange(e, 'architecture')}
          />
        </Subsection>
      )
    }
  }

  renderHeuristicsIcon = () => {
    if (this.state.selectedHeuristic) {
      if (this.state.showHeuristicSettings) {
        return '[-]';
      }
      return '[+]';
    }
  }

  renderAgentsIcon = () => {
    if (this.state.selectedAgent) {
      if (this.state.showAgentConfig) {
        return '[-]';
      }
      return '[+]';
    }
  }

  render() {
    return (
      <StyledSessionModal>
        <CloseIcon onClick={this.props.closeModal}>
          <i className="material-icons">close</i>
        </CloseIcon>
        <PanelTitle>
          Create Session
          <Line />
        </PanelTitle>
        <PanelLabel>
          <i className="material-icons">label</i> Label
        </PanelLabel>
        <Input
          placeholder='Session name'
          value={this.state.sessionName}
          onChange={(e) => this.setState({ sessionName: e.target.value })}
        />
        <PanelLabel>
          <i className="material-icons">filter_hdr</i> Environment
        </PanelLabel>
        <Selector
          values={data.environments}
          select={(x) => this.setState({ selectedEnv: x.value })}
        />
        <PanelLabel>
          <i className="material-icons">bar_chart</i> Metaheuristic
        </PanelLabel>
        <ToggleButton
          onClick={() => this.setState({ showHeuristicSettings: !this.state.showHeuristicSettings })}
        >
          {this.renderHeuristicsIcon()}
        </ToggleButton>
        <Selector
          values={data.metaheuristics}
          select={(x) => this.setState({ selectedHeuristic: x })}
        />
        {this.renderHeuristicSettings()}
        <PanelLabel>
          <i className="material-icons">emoji_people</i> Agent
        </PanelLabel>
        <ToggleButton
          onClick={() => this.setState({ showAgentConfig: !this.state.showAgentConfig })}
        >
          {this.renderAgentsIcon()}
        </ToggleButton>
        <Selector
          values={data.agents}
          select={(x) => this.setState({ selectedAgent: x })}
        />
        {this.renderAgentConfig()}
        <SubmitButton onClick={this.submit}>Generate</SubmitButton>
      </StyledSessionModal>
    );
  }
}

const FieldLabel = styled.span`
  color: #ffffff88;
  font-size: 12px;
`;

const Field = styled.input`
  margin-top: 10px;
  margin-left: 5px;
  border: 0;
  border-bottom: 1px solid white;
  background: transparent;
  outline: none;
  color: white;
  max-width: 100px;
`;

const Subsection = styled.div`
  margin-top: -10px;
  margin-bottom: 35px;
  margin-left: 10px;
`;

const ToggleButton = styled.span`
  font-size: 14px
  margin-left: 8px;
  color: #ffffffcc;
  cursor: pointer;
  user-select: none;
`;

const SubmitButton = styled.div`
  width: 120px;
  color: white;
  background: #ffffff44;
  font-size: 14px;
  padding: 7px 10px;
  margin-top: 40px;
  margin-left: -2px;
  cursor: pointer;
  border-radius: 5px;
`;

const Input = styled.input`
  font-size: 14px;
  background: transparent;
  outline: none;
  border: 0;
  border-bottom: 1px solid white;
  padding: 7px 3px;
  color: white;
  margin-bottom: 25px;
  width: 100%;

  ::placeholder {
    color: #ffffff88;
  }
`;

const PanelLabel = styled.div`
  position: relative;
  color: #ffffff88;
  user-select: none;
  font-size: 14px;
  padding-left: 24px;
  display: inline-block;

  > i {
    font-size: 17px;
    position: absolute;
    top: 1px;
    left: 0px;
  }
`;

const PanelTitle = styled.div`
  margin-bottom: 30px;
  font-size: 14px;
  color: #ffffff88;
  margin-left: -1px;
`;

const Line = styled.div`
  height: 1px;
  margin-left: 2px;
  background: #ffffff88;
  width: 94px;
  margin-top: 10px;
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  user-select: none;

  > i {
    color: #ffffff;
  }
`;

const StyledSessionModal = styled.div`
  position: fixed;
  top: calc(50vh - 260px);
  right: 0;
  width: 350px;
  height: 500px;
  background: #ffffff22;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-family: 'Open Sans', sans-serif;
  padding: 26px;
  overflow-y: auto;

  opacity: 0;
  animation: float-panel 0.8s 0s;
  animation-fill-mode: forwards;
  @keyframes float-panel {
    from { right: -200px; opacity: 0; }
    to   { right: 0px; opacity: 1; }
  }
`;
