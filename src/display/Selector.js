import React from 'react';
import styled from 'styled-components'

export default class Selector extends React.Component {
  state = {
    selected: { label: '----------' },
    options: null,
    showDropdown: false,
    selectedIndex: null,
  }

  selectOption = (opt, index) => {
    this.setState({ selected: opt, selectedIndex: index, showDropdown: false });
    this.props.select(opt)
  }

  renderDropdown = () => {
    if (this.state.showDropdown) {
      return (
        <div>
          <CloseOverlay onClick={() => this.setState({ showDropdown: false })}/>
          <Dropdown>
            {this.props.values.map((opt, i) => {
              return (
                <Option
                  key={i}
                  selected={this.state.selectedIndex === i}
                  onClick={() => this.selectOption(opt, i)}
                >
                  {opt.label}
                </Option>
              );
            })}
          </Dropdown>
        </div>
      )
    }
  }

  render() {
    return (
      <StyledSelector>
        <Value onClick={() => this.setState({ showDropdown: true })}>
          {this.state.selected.label}
        </Value>
        {this.renderDropdown()}
      </StyledSelector>
    );
  }
}

const Option = styled.div`
  font-size: 12px;
  color: white;
  padding: 5px 5px;
  cursor: pointer;

  :hover {
    background: #ffffff44;
  }
`;

const StyledSelector = styled.div`
  position: relative;
  user-select: none;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 30px;
  left: 0px;
  padding: 5px;
  max-height: 130px;
  width: 100%;
  background: #d2d2d2cc;
  z-index: 999;
  overflow-y: auto;
`;

const CloseOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const Value = styled.div`
  outline: 1px solid white;
  font-size: 14px;
  color: white;
  padding: 5px;
  margin-bottom: 25px;
  margin-top: 10px;
  padding-left: 7px;
  cursor: pointer;
`;
