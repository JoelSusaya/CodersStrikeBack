function getThrustByAngle(angle: number) {
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
};

function changeThrustByDistance(thrust: number, distance:number) {
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
};

// Target class for aiming the player pod
class Target {
    // Getter methods for getting the x and y values for a target
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

    }

    get distance() {
        return this._distanceFromPlayer;
    }

    set distance(distance) {
        this._distanceFromplayer = distance;
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
        this._course[index];
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

    // TODO Track laps

}

class Pod {
    // Position getters and setters
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

    // Methods for calculating the change in X and Y
    get xVelocity() {
        if(typeof this._lastX === "undefined") {
            return undefined;
        }

        this._lastXVelocity = this._xVelocity;
        this._xVelocity = this._x - this._lastX;
        return this._xVelocity;
    }

    get yVelocity() {
        if(typeof this._lastY === "undefined") {
            return undefined;
        }


        this._lastYVelocity = this._yVelocity;
        this._yVelocity = this._y - this._lastY;
        return this._yVelocity;
    }

    get velocity() {
        let addedSquaredVelocity = this.xVelocity^2 + this.yVelocity^2;
        /*
        if (addedSquaredVelocity < 0) {
            return Math.sqrt(Math.abs(addedSquaredVelocity)) * -1;
        }
        */
        return Math.sqrt(Math.abs(addedSquaredVelocity));
    }

    get xAccel() {
        if(typeof this._lastXVelocity === "undefined") {
            return undefined;
        }

        this._xAccel = this._xVelocity - this._lastXVelocity;
        return this._xAccel;
    }

    get yAccel() {
        if(typeof this._lastYVelocity === "undefined") {
            return undefined;
        }

        this._yAccel = this._yVelocity - this._lastYVelocity;
        return this._yAccel;
    }

    get acceleration() {
        let addedSquaredAccel = this.xAccel^2 + this.yAccel^2;

        /*
        if (addedSquaredAccel < 0) {
            return Math.sqrt(Math.abs(addedSquaredAccel)) * -1;
        }
        */

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

    get MINTHRUST() {
        return this._MINTHRUST;
    }

    get MAXTHRUST() {
        return this._MAXTHRUST;
    }

    get angle() {
        return this._angle;
    }

    set angle(newAngle) {
        this._angle = newAngle;
    }

    get thrust() {

    }

    get targetCheckpoint() {
        return player._targetCheckpoint;
    }

    set targetCheckpoint(checkpoint) {
        player._targetCheckpoint = checkpoint;
    }

    get target() {
        return player._target;
    }
    set target(target) {
        player._target = target;
    }

}

var player = new PlayerPod();
var opponent = new Pod();

var race = new RaceCourse();

// game loop
while (true) {
    var inputs = readline().split(' ');

    // Update player info
    player.x = parseInt(inputs[0]);
    player.y = parseInt(inputs[1]);

    //Set up checkpoint based on latest data
    var nextCheckpoint = new Checkpoint();
    nextCheckpoint.x = parseInt(inputs[2]); // x position of the next check point
    nextCheckpoint.y = parseInt(inputs[3]); // y position of the next check point
    nextCheckpoint.distance = parseInt(inputs[4]); // distance to the next checkpoint
    player.angle = parseInt(inputs[5]); // angle between your pod orientation and the direction of the next checkpoint

    //Update opponent info
    var inputs = readline().split(' ');
    opponent.x = parseInt(inputs[0]);
    opponent.y = parseInt(inputs[1]);

   // Each turn check to see if the next Checkpoint is already known to our race object
   // Once we've gotten all of the checkpoints, we set the
   if (race.courseLearned === false) race.learnCourse(nextCheckpoint);

    // TODO: Encapsulate thrust in the PlayerPod class so that boosting decisions are all carried out through player.thrust
    var thrust;
    if (nextCheckpoint.distance > 4000 && player.angle === 0) {
        thrust = "BOOST";
    }
    else {
        thrust = getThrustByAngle(Math.abs(player.angle));
        thrust = changeThrustByDistance(thrust, nextCheckpoint.distance);
    }

    // Print output for checking object contents
    printErr("All Checkpoints Known: " + race.allCheckpointsKnown);
    printErr("Course Length: " + race.courseLength);
    printErr("Player Velocity: " + player.velocity);
    printErr("Player Acceleration: " + player.acceleration);
    printErr("Opponent Velocity: " + opponent.velocity);
    printErr("Opponent Acceleration: " + opponent.acceleration);

    print(nextCheckpoint.x + ' ' + nextCheckpoint.y + ' ' + thrust);
}
