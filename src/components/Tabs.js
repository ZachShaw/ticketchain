import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import '../css/components/Tabs.css';

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedTabIndex: this.props.selectedTab,
    };

    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(index, title) {
    this.setState({
      selectedTabIndex: index
    })

  }

  render() {
    const { children } = this.props;
    if (!children || !Children.count(children)) return null;

    return (
      <div className="tabs--container">
        <ul>
          {Children.map(children, (child, i) => {
            const { title } = child.props;
            if (!title) return null;
            return (
              <li onClick={() => this.handleTabClick(i, title)}>
                <span>{title}</span>
              </li>
            );
          })}
        </ul>
        <ul>
          {Children.map(children, (child, i) => {
            const showTab = this.state.selectedTabIndex === i;
            if (!showTab) return null;
            return child;
          })}
        </ul>
      </div>
    )
  }
}

Tabs.propTypes = {
  selectedTab: PropTypes.number,
  onTabClick: PropTypes.func,
};

Tabs.defaultProps = {
  selectedTab: 0,
  onTabClick: () => {},
};

export default Tabs;