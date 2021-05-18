import React from 'react'

const SpinningLoader = ({variant='normal'}) => {
  return (
    <div className={`sk-chase sk-chase-${variant}`}>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
      <div className="sk-chase-dot"></div>
    </div>
  );
}

export default SpinningLoader

