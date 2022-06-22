import React from 'react';
import './styles.css'

const Play = () => {
  const [on, setOn] = React.useState(false);

  const handleClick = () => {
    setOn(true);
  };

  return (
    <div>
      <button className="button" onClick={handleClick}>
        Start playing
      </button>
      {on}
    </div>
  );
};

export default Play;
