import React, { Children } from 'react';
import PropTypes from 'prop-types';

const TabPanel = ({ children, selected }) =>
  <div>
    {Children.map(children, (child, i) =>
      <div key={i}>{child}</div>
    )}
  </div>
;

TabPanel.propTypes = {
  children: PropTypes.node,
  selected: PropTypes.bool,

  // this title will be used by the parent, the Tab component
  title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};

export default TabPanel;
