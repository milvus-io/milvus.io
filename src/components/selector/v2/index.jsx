import React, { useRef, useEffect, useState } from 'react';
import './index.scss';

const V2Selector = ({
  selected,
  options,
  setSelected = () => { },
  className = ""
}) => {
  const choosenWrapper = useRef(null);
  const [open, setOpen] = useState(false);

  console.log(selected);

  const handleSelected = (value) => {
    if (selected === value) return;
    setSelected(value);
  };

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

      window.addEventListener('click', (e) => hideOptions(e), false);
      return () => {
        window.removeEventListener('click', (e) => hideOptions(e), false);
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
            <i
              role='button'
              tabIndex={-1}
              className={`option-item ${option === selected && 'active'}`}
              key={option}
              onClick={() => handleSelected(option)}
              onKeyDown={() => handleSelected(option)}
            >{option}</i>
          ))
        }
      </div>
    </div>
  );
};

export default V2Selector;