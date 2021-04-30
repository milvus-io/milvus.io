import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import './index.scss';

const V2Selector = ({
  selected,
  options,
  setSelected = () => { },
  className = ""
}) => {
  const choosenWrapper = useRef(null);
  const [open, setOpen] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setOpen(open ? false : true);
  };

  useEffect(() => {
    const hideOptions = e => {
      const container = document.querySelector('.selector-container');
      if (container) {
        const isInclude = container.contains(e.target);
        if (!isInclude) {
          setOpen(false);
        }
      };

      window.addEventListener('click', hideOptions, false);
      return () => {
        window.removeEventListener('click', hideOptions, false);
      };
    };
  }, []);

  return (
    <div className={`selector-container ${className}`}>
      <div
        role='button'
        tabIndex={0}
        className="choosen-wrapper"
        ref={choosenWrapper}
        onClick={e => handleClick(e)}
        onKeyDown={e => handleClick(e)}
      >
        <p className="label-wrapper">{selected}</p>
        <div className={`icon-wrapper ${open ? 'show' : ''}`}>
          <i className="fa fa-chevron-down"></i>
        </div>
      </div>

      <div className={`options-wrapper ${open ? 'show' : ''}`}>
        {
          options.map(option => (
            <Link
              to={`/docs/${selected}/overview.md`}
              className={`option-item ${option === selected && 'active'}`}
              key={option}
            >{option}</Link>
          ))
        }
      </div>
    </div>
  );
};

export default V2Selector;