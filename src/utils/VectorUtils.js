/* src/utils/VectorUtils.jsx */

export const add = (v1, v2) => ({
  x: v1.x + v2.x,
  y: v1.y + v2.y,
});

export const subtract = (v1, v2) => ({
  x: v1.x - v2.x,
  y: v1.y - v2.y,
});

export const multiply = (v, scalar) => ({
  x: v.x * scalar,
  y: v.y * scalar,
});

export const magnitude = (v) => Math.sqrt(v.x * v.x + v.y * v.y);

export const normalize = (v) => {
  const mag = magnitude(v);
  return mag === 0 ? { x: 0, y: 0 } : { x: v.x / mag, y: v.y / mag };
};

export const reflect = (velocity, normal) => {
  const dotProduct = velocity.x * normal.x + velocity.y * normal.y;
  return {
    x: velocity.x - 2 * dotProduct * normal.x,
    y: velocity.y - 2 * dotProduct * normal.y,
  };
};

export const polarToCartesian = (centerX, centerY, radius, angleInRadians) => {
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY - radius * Math.sin(angleInRadians),
  };
};

export const describeEdgeArc = (cx, cy, r, startAngle, endAngle) => {
  const start = {
    x: cx + r * Math.cos(startAngle),
    y: cy - r * Math.sin(startAngle),
  };
  const end = {
    x: cx + r * Math.cos(endAngle),
    y: cy - r * Math.sin(endAngle),
  };

  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  ].join(' ');
};
