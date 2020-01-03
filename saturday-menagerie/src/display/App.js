import React from 'react';
import Taxi from './Taxi';
import ChickenLittle from './ChickenLittle';
import { createGlobalStyle } from 'styled-components'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <GlobalStyle />
        <ChickenLittle />
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;
