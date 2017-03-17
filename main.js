function getThrustByAngle(angle) {
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
function changeThrustByDistance(thrust, distance) {
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
class CodingGame {
    print(output) {
        let expression = "print('" + output + "');";
        eval(expression);
    }
    printErr(output) {
        let expression = "printErr('" + output + "');";
        eval(expression);
    }
    readline() {
        return eval("readline();");
    }
}
class Target {
    get x() {
        return this._x;
    }
    set x(position) {
        this._x = position;
    }
    get y() {
        return this._y;
    }
    set y(position) {
        this._y = position;
    }
}
class Checkpoint extends Target {
    constructor() {
        super();
        this._RADIUS = 600;
    }
    outerPointByDegree(degree) {
        return;
    }
    get distance() {
        return this._distanceFromPlayer;
    }
    set distance(distance) {
        this._distanceFromPlayer = distance;
    }
}
class RaceCourse {
    constructor() {
        this._course = [];
        this._courseLearned = false;
    }
    checkpointExists(newCheckpoint) {
        for (let checkpoint of this._course) {
            if (checkpoint.x === newCheckpoint.x && checkpoint.y === newCheckpoint.y) {
                return true;
            }
        }
        return false;
    }
    addCheckpoint(newCheckpoint) {
        this._course.push(newCheckpoint);
        this._nextCheckpoint = newCheckpoint;
    }
    getCheckpoint(index) {
        return this._course[index];
    }
    get courseLength() {
        return this._course.length;
    }
    get nextCheckpoint() {
        return this._nextCheckpoint;
    }
    set nextCheckpoint(checkpoint) {
        this._nextCheckpoint = checkpoint;
    }
    get courseLearned() {
        return this._courseLearned;
    }
    learnCourse(checkpoint) {
        if (!this.checkpointExists(checkpoint)) {
            this.addCheckpoint(checkpoint);
        }
        else if (this.nextCheckpoint.x !== checkpoint.x && this.nextCheckpoint.y !== checkpoint.y) {
            this._courseLearned = true;
        }
    }
}
class Pod {
    get x() {
        return this._x;
    }
    set x(position) {
        this._lastX = this._x;
        this._x = position;
    }
    get y() {
        return this._y;
    }
    set y(position) {
        this._lastY = this._y;
        this._y = position;
    }
    get xVelocity() {
        if (typeof (this._lastX) === "undefined") {
            return undefined;
        }
        this._lastXVelocity = this._xVelocity;
        this._xVelocity = this._x - this._lastX;
        return this._xVelocity;
    }
    get yVelocity() {
        if (typeof this._lastY === "undefined") {
            return undefined;
        }
        this._lastYVelocity = this._yVelocity;
        this._yVelocity = this._y - this._lastY;
        return this._yVelocity;
    }
    get velocity() {
        let addedSquaredVelocity = (this.xVelocity ^ 2) + (this.yVelocity ^ 2);
        return Math.sqrt(Math.abs(addedSquaredVelocity));
    }
    get xAccel() {
        if (typeof this._lastXVelocity === "undefined") {
            return undefined;
        }
        this._xAccel = this._xVelocity - this._lastXVelocity;
        return this._xAccel;
    }
    get yAccel() {
        if (typeof this._lastYVelocity === "undefined") {
            return undefined;
        }
        this._yAccel = this._yVelocity - this._lastYVelocity;
        return this._yAccel;
    }
    get acceleration() {
        let addedSquaredAccel = (this.xAccel ^ 2) + (this.yAccel ^ 2);
        return Math.sqrt(Math.abs(addedSquaredAccel));
    }
}
class PlayerPod extends Pod {
    constructor() {
        super();
        this._MINTHRUST = 0;
        this._MAXTHRUST = 100;
        this._hasBoost = true;
    }
    get minThrust() {
        return this._MINTHRUST;
    }
    get maxThrust() {
        return this._MAXTHRUST;
    }
    get angle() {
        return this._angle;
    }
    set angle(newAngle) {
        this._angle = newAngle;
    }
    get thrust() {
        return;
    }
    get targetCheckpoint() {
        return this._targetCheckpoint;
    }
    set targetCheckpoint(checkpoint) {
        this._targetCheckpoint = checkpoint;
    }
    get target() {
        return this._target;
    }
    set target(target) {
        this._target = target;
    }
}
let player = new PlayerPod();
let opponent = new Pod();
let race = new RaceCourse();
let codingGame = new CodingGame();
while (true) {
    let inputs;
    inputs = codingGame.readline().split(" ");
    player.x = parseInt(inputs[0], 10);
    player.y = parseInt(inputs[1], 10);
    let nextCheckpoint = new Checkpoint();
    nextCheckpoint.x = parseInt(inputs[2], 10);
    nextCheckpoint.y = parseInt(inputs[3], 10);
    nextCheckpoint.distance = parseInt(inputs[4], 10);
    player.angle = parseInt(inputs[5], 10);
    inputs = codingGame.readline().split(" ");
    opponent.x = parseInt(inputs[0], 10);
    opponent.y = parseInt(inputs[1], 10);
    if (race.courseLearned === false) {
        race.learnCourse(nextCheckpoint);
    }
    let thrust;
    if (nextCheckpoint.distance > 4000 && player.angle === 0) {
        thrust = "BOOST";
    }
    else {
        thrust = getThrustByAngle(Math.abs(player.angle));
        thrust = changeThrustByDistance(thrust, nextCheckpoint.distance);
    }
    codingGame.printErr("All Checkpoints Known: " + race.courseLearned);
    codingGame.printErr("Course Length: " + race.courseLength);
    codingGame.printErr("Player Velocity: " + player.velocity);
    codingGame.printErr("Player Acceleration: " + player.acceleration);
    codingGame.printErr("Opponent Velocity: " + opponent.velocity);
    codingGame.printErr("Opponent Acceleration: " + opponent.acceleration);
    codingGame.print(nextCheckpoint.x + " " + nextCheckpoint.y + " " + thrust);
}
//# sourceMappingURL=main.js.map