import React from 'react';
import './styles.css'

const Play = () => {

  function start_playing() {
    alert("test");
  }

  return (
    <button className='button' onClick={start_playing}>
      Start playing !
    </button>
  );
}

export default Play;
