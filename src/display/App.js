import React from 'react';

// Import environment renderers
import Taxi from '../problems/taxi-v3/Taxi';
import ChickenLittle from '../problems/chicken-little/ChickenLittle';
import Rastrigin from '../problems/rastrigin/Rastrigin';

import SessionModal from './SessionModal.js';
import styled, { createGlobalStyle } from 'styled-components'

export default class App extends React.Component {
  state = {
    page: 1,
    showSessionModal: true,
  }

  renderMain = () => {
    switch (this.state.page) {
      case 0:
        return <Taxi />
        break;
      case 1:
        return <ChickenLittle />
        break;
      default:
        return <Rastrigin />
    }
  }

  pageNav = (dir) => {
    if (dir === -1 && this.state.page > 0) {
      this.setState({ page: this.state.page - 1 });
    } else if (dir === 1 && this.state.page < 2) {
      this.setState({ page: this.state.page + 1 });
    }
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

  render() {
    return (
      <div>
        <GlobalStyle />
        {this.renderMain()}
        <BackButton onClick={() => this.pageNav(-1)}>
          <i className="material-icons">arrow_back</i>
        </BackButton>
        <ForwardButton onClick={() => this.pageNav(1)}>
          <i className="material-icons">arrow_forward</i>
        </ForwardButton>
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
  position: fixed;
  top: 20px;
  left: 20px;
  cursor: pointer;
  border-radius: 50px;
  width: 25px;
  height: 25px;
  user-select: none;
  :hover {
    background: #ffffff22;
  }

  > i {
    color: #ffffff44;
  }
`;

const ForwardButton = styled(BackButton)`
  left: 60px;
`;
