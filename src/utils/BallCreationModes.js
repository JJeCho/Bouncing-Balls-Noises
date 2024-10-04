/* src/utils/BallCreationModes.jsx */

export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians) {
  return (radians * 180) / Math.PI;
}


export class BallCreationMode {
  constructor() {
    this.type = 'Base';
  }

  shouldCreateBall(ball, collisionData, currentTime) {
    return false;
  }
}

export class CreateOnAnyBounceMode extends BallCreationMode {
  constructor() {
    super();
    this.type = 'CreateOnAnyBounceMode';
  }

  shouldCreateBall(ball, collisionData, currentTime) {
    return true;
  }
}

export class CreateOnSpecificAreaBounceMode extends BallCreationMode {
  constructor(area) {
    super();
    this.area = area;
    this.type = 'CreateOnSpecificAreaBounceMode';
  }

  shouldCreateBall(ball, collisionData, currentTime) {
    const { position } = collisionData;

    const angle = radiansToDegrees(Math.atan2(-position.y, position.x));
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    const { startAngle, endAngle } = this.area;

    if (startAngle > endAngle) {
      return (
        normalizedAngle >= startAngle ||
        normalizedAngle <= endAngle
      );
    } else {
      return (
        normalizedAngle >= startAngle &&
        normalizedAngle <= endAngle
      );
    }
  }
}

export class CreateAfterXSecondsMode extends BallCreationMode {
  constructor(intervalSeconds) {
    super();
    this.interval = intervalSeconds;
    this.lastCreationTime = 0;
    this.type = 'CreateAfterXSecondsMode';
  }

  shouldCreateBall(ball, collisionData, currentTime) {
    if (currentTime - this.lastCreationTime >= this.interval) {
      this.lastCreationTime = currentTime;
      return true;
    }
    return false;
  }
}
