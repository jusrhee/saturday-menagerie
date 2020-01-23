import React from 'react';

// Import environment renderers
import Taxi from '../problems/taxi-v3/Taxi';
import ChickenLittle from '../problems/chicken-little/ChickenLittle';
import Rastrigin from '../problems/rastrigin/Rastrigin';

import SessionModal from './SessionModal.js';
import Sidebar from './Sidebar.js';

import styled, { createGlobalStyle } from 'styled-components'
import data from './rosetta';

export default class App extends React.Component {
  state = {
    selectedEnv: data.environments[0],
    page: 0,
    showSessionModal: false,
    showSidebar: false,
    activeFreezer: [],
    currentParams: [],
    currentConfig: null,
  }

  // Loads in a problem's freezer contents for the sidebar [can't do this dynamically with a path variable since webpack requires static field - even for dynamic importing]
  openFreezer = (contents) => {
    this.setState({ activeFreezer: contents });
  }

  renderMain = () => {
    switch (this.state.page) {
      case 0:
        return (
          <Taxi
            currentParams={this.state.currentParams}
            currentConfig={this.state.currentConfig}
            openFreezer={this.openFreezer}
          />
        );
        break;
      case 1:
        return (
          <ChickenLittle
            openFreezer={this.openFreezer}
            currentParams={this.state.currentParams}
            currentConfig={this.state.currentConfig}
          />
        );
        break;
      default:
        return (
          <Rastrigin
            openFreezer={this.openFreezer}
            currentParams={this.state.currentParams}
            currentConfig={this.state.currentConfig}
          />
        );
    }
  }

  pageNav = (dir) => {
    if (dir === -1 && this.state.page > 0) {
      var i = this.state.page - 1;
      this.setState({ page: i, selectedEnv: data.environments[i] });
    } else if (dir === 1 && this.state.page < 2) {
      var i = this.state.page + 1;
      this.setState({ page: i, selectedEnv: data.environments[i] });
    }
  }

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  }

  renderSessionModal = () => {
    if (this.state.showSessionModal) {
      return (
        <SessionModal closeModal={() => this.setState({ showSessionModal: false })}/>
      )
    }
    return (
      <SessionButton onClick={() => this.setState({ showSessionModal: true })}>
        <i className="material-icons">add</i>
      </SessionButton>
    )
  }

  setParams = (currentParams, currentConfig) => {
    this.setState({ currentParams, currentConfig });
  }

  render() {
    return (
      <div>
        <GlobalStyle />
        {this.renderMain()}
        <Sidebar
          toggleSidebar={this.toggleSidebar}
          showSidebar={this.state.showSidebar}
          envValue={this.state.selectedEnv.value}
          activeFreezer={this.state.activeFreezer}
          setParams={this.setParams}
        />
        <Tag>
          <BackButton onClick={() => this.pageNav(-1)}>
            <i className="material-icons">arrow_back</i>
          </BackButton>
          <span>
            Experiment No.{this.state.page + 1}
          </span>
          <ForwardButton onClick={() => this.pageNav(1)}>
            <i className="material-icons">arrow_forward</i>
          </ForwardButton>
          <Title>{this.state.selectedEnv.label}</Title>
        </Tag>
        {this.renderSessionModal()}
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
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
  width: 300px;
  left: calc(50vw - 150px);
  user-select: none;
`;

const Title = styled.div`
  margin-top: 12px;
  font-size: 20px;
  color: #ffffff99;
`;

const SessionButton = styled.div`
  position: fixed;
  height: 50px;
  width: 50px;
  right: 20px;
  top: calc(50vh - 45px);
  border-radius: 10px;
  background: #ffffff33;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;

  :hover {
    width: 54px;
    right: 18px;
    height: 54px;
    top: calc(50vh - 47px);
  }

  > i {
    color: #ffffff;
  }
`;

const BackButton = styled.div`
  display: inline-block;
  position: relative;
  cursor: pointer;
  border-radius: 50px;
  width: 25px;
  height: 25px;
  user-select: none;
  margin-bottom: -8px;
  :hover {
    background: #ffffff22;
  }
  margin-right: 15px;

  > i {
    color: #ffffff44;
    position: absolute;
    top: 3px;
    left: 3px;
    font-size: 18px;
  }
`;

const ForwardButton = styled(BackButton)`
  margin-right: 0px;
  margin-left: 10px;

  > i {
    left: 3px;
  }
`;
