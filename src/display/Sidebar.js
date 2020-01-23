import React from 'react';
import styled from 'styled-components';

export default class Sidebar extends React.Component {

  state = {
    files: [],
    selectedAgentIndex: null,
  }

  componentDidMount() {
    this.setState({ files: this.props.activeFreezer });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({ files: this.props.activeFreezer });
    }
  }

  setParams = (params, config, i) => {
    this.setState({ selectedAgentIndex: i });
    this.props.setParams(params, config);
  }

  renderSidebar = () => {
    if (this.props.showSidebar) {
      return (
        <StyledSidebar>
          <CloseIcon onClick={this.props.toggleSidebar}>
            <i className="material-icons">close</i>
          </CloseIcon>
          <SidebarTitle>
            Select Agent
            <Line />
          </SidebarTitle>
          {this.state.files.map((file, i) => {
            return (
              <SidebarButton
                key={i}
                onClick={() => this.setParams(file.data, file.config, i)}
                selected={this.state.selectedAgentIndex === i}
              >
                Log {i}
              </SidebarButton>
            );
          })}
        </StyledSidebar>
      )
    }
    return (
      <SidebarTab onClick={this.props.toggleSidebar}>
        <i className="material-icons">keyboard_arrow_right</i>
      </SidebarTab>
    );
  }

  render() {
    return (
      <div>{this.renderSidebar()}</div>
    )
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

const StyledSidebar = styled.div`
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #ffffff22;
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  color: white;
  padding: 130px 25px 50px 20px;
  display: flex;
  overflow-y: auto;
  flex-direction: column;

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
  font-size: 14px;
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
  width: 80px;
  background: #ffffff88;
  margin-top: 10px;
`;
