import React from 'react';

import styled from 'styled-components'

export default class SessionModal extends React.Component {
  state = {
    logData: 'Training . . .',
    interval: null,
  }

  step = () => {
    var logs = require('../logs.json');
    this.setState({ logData: logs });
  }

  componentDidMount() {
    var interval = setInterval(this.step, 100);
    this.setState({ interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <StyledLogger>
        {this.state.logData}
      </StyledLogger>
    );
  }
}

const StyledLogger = styled.div`
`;
