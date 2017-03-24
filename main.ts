/// <reference path="./Codingame.d.ts" />

function getThrustByAngle(angle: number): number {
    if (angle > 135) {
        return 0;
    }
    else if (angle > 90) {
        return 5;
    }
    else if (angle > 80) {
        return 50;
    }
    else if (angle > 70) {
        return 55;
    }
    else if (angle > 60) {
        return 60;
    }
    else if (angle > 45) {
        return 65;
    }
    else if (angle > 30) {
        return 70;
    }
    else if (angle > 15) {
        return 75;
    }
    else if (angle > 5) {
        return 90;
    }

    return 100;
}

function changeThrustByDistance(thrust: number, distance: number): number {
    if (distance < 100) {
        return thrust * .2;
    }
    else if (distance < 300) {
        return thrust * .5;
    }
    else if (distance < 600) {
        return thrust * .7;
    }
    else if (distance < 900) {
        return thrust * .9;
    }
    return thrust;
}

// Target class for aiming the player pod
class Target {
  private _x: number;
  private _y: number;

  // Getter methods for getting the x and y values for a target
  get x(): number {
    return this._x;
  }
  set x(position: number) {
    this._x = position;
  }

  get y(): number {
    return this._y;
  }
  set y(position: number) {
    this._y = position;
  }
}

class Checkpoint extends Target {
  private _RADIUS: number;
  private _distanceFromPlayer: number;

  constructor() {
    super();
    this._RADIUS = 600;
  }

  outerPointByDegree(degree: number): void {
    return;
  }

  get distance(): number {
    return this._distanceFromPlayer;
  }

  set distance(distance: number) {
    this._distanceFromPlayer = distance;
  }

}

class RaceCourse {
  private _course: Array<Checkpoint>;
  private _courseLearned: boolean;
  private _nextCheckpoint: Checkpoint;

  constructor() {
    this._course = [];
    this._courseLearned = false;
  }

  checkpointExists(newCheckpoint: Checkpoint): boolean {
    for (let checkpoint of this._course) {
      if (checkpoint.x === newCheckpoint.x && checkpoint.y === newCheckpoint.y) {
        return true;
      }
    }
    return false;
  }

  addCheckpoint(newCheckpoint: Checkpoint): void {
    this._course.push(newCheckpoint);
    this._nextCheckpoint = newCheckpoint;
  }

  getCheckpoint(index: number): Checkpoint {
    return this._course[index];
  }

  get courseLength(): number {
    return this._course.length;
  }

  get nextCheckpoint(): Checkpoint {
    return this._nextCheckpoint;
  }
  set nextCheckpoint(checkpoint: Checkpoint) {
    this._nextCheckpoint = checkpoint;
  }

  get courseLearned(): boolean {
    return this._courseLearned;
  }

  learnCourse(checkpoint: Checkpoint): void {
    if (!this.checkpointExists(checkpoint)) {
      this.addCheckpoint(checkpoint);
    }
    else if (this.nextCheckpoint.x !== checkpoint.x && this.nextCheckpoint.y !== checkpoint.y) {
      this._courseLearned = true;
    }
  }

  // TODO Track laps

}

class Pod {
  private _x: number;
  private _lastX: number;
  private _y: number;
  private _lastY: number;
  private _xVelocity: number;
  private _lastXVelocity: number;
  private _yVelocity: number;
  private _lastYVelocity: number;
  private _xAccel: number;
  private _yAccel: number;

    // Position getters and setters
  get x(): number {
    return this._x;
  }
  set x(position: number) {
    this._lastX = this._x;
    this._x = position;
  }

  get y(): number {
    return this._y;
  }
  set y(position: number) {
    this._lastY = this._y;
    this._y = position;
  }

  // Methods for calculating the change in X and Y
  get xVelocity(): number {
    if (typeof this._lastX === "undefined") {
        return undefined;
    }

    this._lastXVelocity = this._xVelocity;
    this._xVelocity = this._x - this._lastX;
    return this._xVelocity;
  }

  get yVelocity(): number {
    if (typeof this._lastY === "undefined") {
        return undefined;
    }


    this._lastYVelocity = this._yVelocity;
    this._yVelocity = this._y - this._lastY;
    return this._yVelocity;
  }

  get velocity(): number {
    let addedSquaredVelocity = (this.xVelocity ** 2) + (this.yVelocity ** 2);
    /*
    if (addedSquaredVelocity < 0) {
        return Math.sqrt(Math.abs(addedSquaredVelocity)) * -1;
    }
    */
    return Math.sqrt(Math.abs(addedSquaredVelocity));
  }

  get xAccel(): number  {
    if (typeof this._lastXVelocity === "undefined") {
        return undefined;
    }

    this._xAccel = this._xVelocity - this._lastXVelocity;
    return this._xAccel;
  }

  get yAccel(): number  {
    if (typeof this._lastYVelocity === "undefined") {
        return undefined;
    }

    this._yAccel = this._yVelocity - this._lastYVelocity;
    return this._yAccel;
  }

  get acceleration(): number  {
    let addedSquaredAccel = (this.xAccel ** 2) + (this.yAccel ** 2);

    /*
    if (addedSquaredAccel < 0) {
        return Math.sqrt(Math.abs(addedSquaredAccel)) * -1;
    }
    */

    return Math.sqrt(Math.abs(addedSquaredAccel));
  }
}

class PlayerPod extends Pod {
  private readonly _MINTHRUST: number;
  private readonly _MAXTHRUST: number;
  private _hasBoost: boolean;
  private _angle: number;
  private _target: Target;
  private _targetCheckpoint: Checkpoint;

  constructor() {
      super();
      this._MINTHRUST = 0;
      this._MAXTHRUST = 100;
      this._hasBoost = true;
  }

  get minThrust(): number {
      return this._MINTHRUST;
  }

  get maxThrust(): number {
      return this._MAXTHRUST;
  }

  get angle(): number {
      return this._angle;
  }

  set angle(newAngle: number) {
      this._angle = newAngle;
  }

  get thrust(): void {
    return;
  }

  get targetCheckpoint(): Checkpoint {
      return this._targetCheckpoint;
  }

  set targetCheckpoint(checkpoint: Checkpoint) {
      this._targetCheckpoint = checkpoint;
  }

  get target(): Target {
      return this._target;
  }
  set target(target: Target) {
      this._target = target;
  }

}

let player = new PlayerPod();
let opponent = new Pod();

let race = new RaceCourse();

// game loop
while (true) {
  let inputs: Array<string>;

  inputs = readline().split(" ");

  // Update player info
  player.x = parseInt(inputs[0], 10);
  player.y = parseInt(inputs[1], 10);

  // Set up checkpoint based on latest data
  let nextCheckpoint = new Checkpoint();
  nextCheckpoint.x = parseInt(inputs[2], 10); // x position of the next check point
  nextCheckpoint.y = parseInt(inputs[3], 10); // y position of the next check point
  nextCheckpoint.distance = parseInt(inputs[4], 10); // distance to the next checkpoint
  player.angle = parseInt(inputs[5], 10); // angle between your pod orientation and the direction of the next checkpoint

  // Update opponent info
  inputs = readline().split(" ");
  opponent.x = parseInt(inputs[0], 10);
  opponent.y = parseInt(inputs[1], 10);

 // Each turn check to see if the next Checkpoint is already known to our race object
 // Once we"ve gotten all of the checkpoints, we set the
 if (race.courseLearned === false) {
  race.learnCourse(nextCheckpoint);
}

  // TODO: Encapsulate thrust in the PlayerPod class so that boosting decisions are all carried out through player.thrust
  let thrust;
  if (nextCheckpoint.distance > 4000 && player.angle === 0) {
      thrust = "BOOST";
  }
  else {
      thrust = getThrustByAngle(Math.abs(player.angle));
      thrust = changeThrustByDistance(thrust, nextCheckpoint.distance);
  }

  // Print output for checking object contents
  printErr("All Checkpoints Known: " + race.courseLearned);
  printErr("Course Length: " + race.courseLength);
  printErr("Player Velocity: " + player.velocity);
  printErr("Player Acceleration: " + player.acceleration);
  printErr("Opponent Velocity: " + opponent.velocity);
  printErr("Opponent Acceleration: " + opponent.acceleration);

  print(nextCheckpoint.x + " " + nextCheckpoint.y + " " + thrust);
}
