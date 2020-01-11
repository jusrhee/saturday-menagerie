import React from 'react';
import Taxi from '../problems/taxi-v3/Taxi';
import ChickenLittle from '../problems/chicken-little/ChickenLittle';
import Rastrigin from '../problems/rastrigin/Rastrigin';
import styled, { createGlobalStyle } from 'styled-components'

export default class App extends React.Component {
  state = {
    page: 1,
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
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
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
