export const triangleIcon = ({
  width = 'inherit',
  height = 'inherit',
  shapeFillColor = '#228be6',
  transform = '0deg',
}) => (
  <svg
    viewBox='-1.6 -1.6 19.20 19.20'
    width={width}
    height={height}
    version='1.1'
    fill={shapeFillColor}
    stroke='none'
    xmlns='http://www.w3.org/2000/svg'
    xmlnsXlink='http://www.w3.org/1999/xlink'
    transform={transform}
  >
    <rect
      width='16'
      height='16'
      id='icon-bound'
      stroke='none'
      fill='none'
      colorInterpolation={'red'}
      floodColor={'red'}
    />
    <polygon points='8,5 13,10 3,10' />
  </svg>
);
