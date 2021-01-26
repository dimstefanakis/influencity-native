import * as React from 'react';
import Svg, {Path, G, Defs, RadialGradient, Stop} from 'react-native-svg';

function BottomRight(props) {
  return (
    <Svg
      width={363}
      height={226}
      viewBox="0 0 363 226"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M8.5 226c4.154-29.551 51.522-41.463 86-46 42.5-5.592 121-8 155-43s23-27 56.692-83.723C317.421 34.374 335 18 362.5 9v217H8.5z"
        fill="#AAF0D1"
      />
      <Path
        d="M8.5 226c4.154-29.551 51.522-41.463 86-46 42.5-5.592 121-8 155-43s23-27 56.692-83.723C317.421 34.374 335 18 362.5 9v217H8.5z"
        fill="url(#prefix__paint0_radial)"
      />
      <G opacity={0.3}>
        <Path
          d="M0 226c4.4-30.777 33-40.269 73-49 55.398-12.092 133.78-7.24 169.797-43.691 36.017-36.452 24.364-28.12 60.055-87.195C314.746 26.426 333.369 9.374 362.5 0v226H0z"
          fill="#AAF0D1"
        />
        <Path
          d="M0 226c4.4-30.777 33-40.269 73-49 55.398-12.092 133.78-7.24 169.797-43.691 36.017-36.452 24.364-28.12 60.055-87.195C314.746 26.426 333.369 9.374 362.5 0v226H0z"
          fill="url(#prefix__paint1_radial)"
        />
      </G>
      <Defs>
        <RadialGradient
          id="prefix__paint0_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(133.22076 121.4683 -320.12469 351.09778 278.707 -78.42)">
          <Stop stopColor="#AAF0D1" />
          <Stop offset={0.272} stopColor="#1AB5E6" stopOpacity={0.776} />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="prefix__paint1_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(141.12373 126.5062 -332.83296 371.29112 273.737 -91.046)">
          <Stop stopColor="#AAF0D1" />
          <Stop offset={0.272} stopColor="#AAF0D1" stopOpacity={0.776} />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export default BottomRight;
