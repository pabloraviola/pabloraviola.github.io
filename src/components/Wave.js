import React from "react";

const Wave = (props: { fromColor: "", toColor: "" }) => {
  //gradient id
  const id = Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(2, 10);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="264"
      viewBox="0 0 1440 264"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 79.2L60 70.4C120 61.6 240 44 360 61.6C480 79.2 600 132 720 162.8C840 193.6 960 202.4 1080 171.6C1200 140.8 1320 70.4 1380 35.2L1440 0V264H1380C1320 264 1200 264 1080 264C960 264 840 264 720 264C600 264 480 264 360 264C240 264 120 264 60 264H0V79.2Z"
        fill={`url(#${id})`}
      />
      <defs>
        <linearGradient
          id={id}
          x1="720"
          y1="0"
          x2="720"
          y2="264"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.fromColor} />
          <stop offset="1" stopColor={props.toColor} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Wave;
