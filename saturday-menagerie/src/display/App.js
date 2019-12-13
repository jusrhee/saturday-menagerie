import React from 'react';
import Main from './Main';
import { createGlobalStyle } from 'styled-components'

export default class App extends React.Component {
  render() {
    return (
      <div>
        <GlobalStyle />
        <Main />
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;
