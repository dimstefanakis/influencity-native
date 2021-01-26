import * as React from 'react';
import Svg, {Path, G, Defs, RadialGradient, Stop} from 'react-native-svg';

function TopLeft(props) {
  return (
    <Svg
      width={363}
      height={226}
      viewBox="0 0 363 226"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M354 0c-4.154 29.551-51.522 41.463-86 46-42.5 5.592-121 8-155 43s-23 27-56.692 83.723C45.079 191.626 27.5 208 0 217V0h354z"
        fill="#FFD29B"
      />
      <Path
        d="M354 0c-4.154 29.551-51.522 41.463-86 46-42.5 5.592-121 8-155 43s-23 27-56.692 83.723C45.079 191.626 27.5 208 0 217V0h354z"
        fill="url(#prefix__paint0_radial)"
      />
      <G opacity={0.3}>
        <Path
          d="M362.5 0c-4.4 30.777-33 40.269-73 49-55.398 12.092-133.78 7.24-169.797 43.691-36.017 36.452-24.364 28.12-60.055 87.195C47.754 199.574 29.131 216.627 0 226V0h362.5z"
          fill="#FFD29B"
        />
        <Path
          d="M362.5 0c-4.4 30.777-33 40.269-73 49-55.398 12.092-133.78 7.24-169.797 43.691-36.017 36.452-24.364 28.12-60.055 87.195C47.754 199.574 29.131 216.627 0 226V0h362.5z"
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
          gradientTransform="rotate(-137.642 100.87 135.977) scale(180.284 475.131)">
          <Stop stopColor="#FFD29B" />
          <Stop offset={0.272} stopColor="red" stopOpacity={0.776} />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </RadialGradient>
        <RadialGradient
          id="prefix__paint1_radial"
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-141.12307 -126.50694 332.8349 -371.28937 88.763 317.046)">
          <Stop stopColor="#FFD29B" />
          <Stop offset={0.272} stopColor="red" stopOpacity={0.776} />
          <Stop offset={1} stopColor="#fff" stopOpacity={0} />
        </RadialGradient>
      </Defs>
    </Svg>
  );
}

export default TopLeft;
