export const getRightEndOfPath = (d: string) => {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number);
  if (!nums) return null;

  const points = [];
  for (let i = 0; i < nums.length; i += 2) {
    points.push([nums[i], nums[i + 1]]);
  }

  let targetPoint = points[0];

  points.forEach(p => {
    if (p[0] > targetPoint[0]) targetPoint = p;
  });
  const [x, y] = targetPoint;
  return { x, y };
};

export const getLeftEndOfPath = (
  d: string,
  pathIndex: number,
  pathName: string,
) => {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number);
  if (!nums) return null;

  const points: [number, number][] = [];
  for (let i = 0; i < nums.length; i += 2) {
    points.push([nums[i], nums[i + 1]]);
  }

  let minXPoint = points[0];
  for (const p of points) {
    if (p[0] < minXPoint[0]) minXPoint = p;
  }

  let x = minXPoint[0];
  let y = minXPoint[1];
  if (pathName !== 'forth') {
    if (pathIndex === 24) {
      x = x - 283;
      y = y + -15;
    }
    if (pathIndex === 25) {
      x -= 1;
      y = y - 2;
    }
    if (pathIndex === 26) {
      x -= 4;
      y = y - -23;
    }
  }

  return { x, y };
};

export const sortPathsByVerticalPosition = paths => {
  const withGeom = paths.map((d, i) => {
    const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    const points = [];

    for (let j = 0; j < nums.length; j += 2) {
      points.push([nums[j], nums[j + 1]]);
    }

    let maxY = points[0][1];
    for (const p of points) {
      if (p[1] > maxY) maxY = p[1];
    }

    return { d, index: i, maxY };
  });

  return withGeom.sort((a, b) => a.maxY - b.maxY).map(obj => obj.d);
};
export const handleExceptionalIndex = (index: number, pathName: string) => {
  if (pathName !== 'third') return index;

  if (index === 24) return 26;
  if (index === 26) return 24;

  return index;
};
