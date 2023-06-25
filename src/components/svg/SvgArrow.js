export default SvgArrow = ({width, height}) => {
  const scale = 1;
  return (
    <svg width={width * scale} height={height * scale}>
      <defs>
        <marker id="arrowhead" markerWidth="3" markerHeight="2"
                refX="3" refY="1" orient="auto">
          <polygon points="0 0, 3 1, 0 2" />
        </marker>
      </defs>
      <path d="M1,1 L7,4 L1,7"
            stroke="black" stroke-width="0.5"
            marker-end="url(#arrowhead)" />
    </svg>
  )
}