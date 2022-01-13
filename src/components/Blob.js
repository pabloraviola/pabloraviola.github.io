import React, { useEffect } from "react";
// @ts-ignore
import { spline } from "@georgedoescode/spline";
// @ts-ignore
import SimplexNoise from "simplex-noise";

// type Size = "small" | "medium" | "large";

const Blob = (props: { size: "", color: "", class: "", opacity: "" }) => {
  // used to set our custom property values
  const id = new Date().getUTCMilliseconds();
  let noiseStep = 0.005;

  const simplex = new SimplexNoise();

  const createPoints = () => {
    const points = [];
    // how many points do we need
    const numPoints = 6;
    // used to equally space each point around the circle
    const angleStep = (Math.PI * 2) / numPoints;
    // the radius of the circle
    const rad = 75;

    for (let i = 1; i <= numPoints; i++) {
      // x & y coordinates of the current point
      const theta = i * angleStep;

      const x = 100 + Math.cos(theta) * rad;
      const y = 100 + Math.sin(theta) * rad;

      // store the point's position
      points.push({
        x: x,
        y: y,
        // we need to keep a reference to the point's original point for when we modulate the values later
        originX: x,
        originY: y,
        // more on this in a moment!
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }

    return points;
  };

  const points = createPoints();

  const animate = () => {
    const path = document.querySelector(`#blob-${id}`);

    if (path) {
      path.setAttribute("d", spline(points, 1, true));
    }
    // for every point...
    for (let i = 0; i < points.length; i++) {
      const point = points[i];

      // return a pseudo random value between -1 / 1 based on this point's current x, y positions in "time"
      const nX = noise(point.noiseOffsetX, point.noiseOffsetX);
      const nY = noise(point.noiseOffsetY, point.noiseOffsetY);
      // map this noise value to a new value, somewhere between it's original location -20 and it's original location + 20
      const x = map(nX, -1, 1, point.originX - 20, point.originX + 20);
      const y = map(nY, -1, 1, point.originY - 20, point.originY + 20);

      // update the point's current coordinates
      point.x = x;
      point.y = y;

      // progress the point's x, y values through "time"
      point.noiseOffsetX += noiseStep;
      point.noiseOffsetY += noiseStep;
    }

    requestAnimationFrame(animate);
  };

  const map = (n, start1, end1, start2, end2) => {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  };

  const noise = (x, y) => {
    return simplex.noise2D(x, y);
  };

  useEffect(() => {
    animate();
  });

  const getSize = () => {
    switch (props.size) {
      case "small":
        return 200;
      case "medium":
        return 500;
      case "large":
        return 600;
      default:
        return;
    }
  };

  return (
    <div className={"absolute z-0 " + props.class}>
      <svg
        width={getSize()}
        height={getSize()}
        viewBox="0 0 200 200"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          id={"blob-" + id}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M294.246 0.000372841C355.708 -0.141574 410.616 40.2685 455.329 85.1047C495.992 125.881 511.656 183.359 532.213 238.623C554.403 298.275 606.017 361.72 579.697 419.443C552.791 478.454 468.882 465.866 414.495 496.802C370.988 521.548 342.67 571.74 294.246 581.804C239.911 593.097 174.308 595.62 134.184 555.062C94.2975 514.744 123.291 441.185 101.825 387.304C76.8076 324.506 -6.72576 287.104 0.433518 219.331C7.41529 153.239 82.4752 124.065 133.67 85.8476C183.932 48.3269 232.832 0.142208 294.246 0.000372841Z"
          fill={props.color}
          opacity={props.opacity}
        />
        <defs>
          <linearGradient
            id="paint0_linear"
            x1="293.5"
            y1="0"
            x2="293.5"
            y2="589"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7DC5EE" />
            <stop offset="1" stopColor="#1A5F9E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Blob;
