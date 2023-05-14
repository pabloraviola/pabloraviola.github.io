import React from "react";

const Tilt = (props) => {
  const { color, direction = "right" } = props;

  const tiltDirection = {
    left: "M0,160L1440,64L1440,320L0,320Z",
    right: "M0,64L1440,160L1440,320L0,320Z",
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill={color} fill-opacity="1" d={tiltDirection[direction]}></path>
    </svg>
  );
};

export default Tilt;
