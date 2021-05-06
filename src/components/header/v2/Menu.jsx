import React from 'react';
import { Link } from 'gatsby';
import V2Selector from '../../selector/v2';

const Menu = ({
  version,
  options,
  setSelected,
  navList
}) => (

  <div className="nav-section">
    {
      navList.map(i => {
        const { label, link, isExternal } = i;
        return (
          isExternal ?
            (<a className="nav-item" href={link} key={label} target="_blank" rel="noopener noreferrer" >{label}</a>) :
            (<Link className="nav-item" to={link} key={label}>{label}</Link>)
        );
      })
    }
    <div className="drop-down">
      <V2Selector
        className="mobile-selector"
        selected={version}
        options={options}
        setSelected={setSelected}
      />
    </div>
  </div>
);


export default Menu;