function Target(id) {
    const x = random(0, width);
    const y = random(0, height);
    const pos = new p5.Vector(x, y);

    const dx = random(-1, 1);
    const dy = random(-1, 1);
    // Constant initial velocity
    // const vel = new p5.Vector(dx, dy).normalize().mult(TARGET_MAX_SPEED);
    const vel = new p5.Vector(0, 0);

    this.id = id;
    this.pos = pos;
    this.vel = vel;
    this.acc = new p5.Vector(0, 0);
    this.r = 30;

    // Either wrap around edges or return an acceleration repealling from edges
    this.getBorderAvoidingAcceleration = () => {
        const steering = new p5.Vector(0, 0);
        // if (boidsSettings.enableWrapEdges) {
            if (this.pos.x < 0 ) {
                this.pos.x = width;
            }
            if (this.pos.x > width) {
                this.pos.x = 0;
            }
            if (this.pos.y < 0 ) {
                this.pos.y = height;
            }
            if (this.pos.y > height) {
                this.pos.y = 0;
            }
            return steering;
        // }

        /*
         * // Keep the target in the screen
         * if (this.pos.x < targetsSettings.BORDER_LIMIT) {
         *     this.vel.x = abs(this.vel.x);
         * }
         * if (this.pos.x > width - targetsSettings.BORDER_LIMIT) {
         *     this.vel.x = -abs(this.vel.x);
         * }
         * if (this.pos.y < targetsSettings.BORDER_LIMIT) {
         *     this.vel.y = abs(this.vel.y);
         * }
         * if (this.pos.y > height - targetsSettings.BORDER_LIMIT) {
         *     this.vel.y = -abs(this.vel.y);
         * }
         * return steering;
         */
    };

    this.getWiggleAcceleration = () => {
        const maxAngleRad = radians(40);
        const wiggleSteer = p5.Vector.random2D();
        wiggleSteer.normalize().setMag(targetsSettings.WIGGLE_ACC_INTENSITY);
        return wiggleSteer;
    };

    // Compute steering force aways from birds acceleration
    this.getAvoidBirdsAcceleration = () => {
        const cohesionSteer = new p5.Vector(0, 0);

        const localBirds = [];
        const nearCircle = new Circle(this.pos.x, this.pos.y, targetsSettings.ALIGNMENT_FRIENDS_RADIUS * 2);
        birdsQTree.query(nearCircle, localBirds);

        localBirds.forEach(b => {
            const acc = b.acc;
            const steer = this.pos.copy().sub(acc);
            cohesionSteer.add(steer);
        });

        cohesionSteer.div(birds.length);
        cohesionSteer.setMag(targetsSettings.AVOID_BIRD_ACC_INTENSITY);
        return cohesionSteer;
    };

    this.getStayOnFrameAcceleration = () => {
        const frameSteer = new p5.Vector(width/2, height/2);
        frameSteer.normalize().setMag(targetsSettings.FRAME_ACC_INTENSITY);
        return frameSteer;
    }

    // Compute steering rejecting from obstacles
    this.getObstaclesAvoidingAcceleration = () => {
        const myobstacles = []; // The name obstacles is already a global variable
        const obstaclesCircle = new Circle(this.pos.x, this.pos.y, targetsSettings.OBSTACLE_RADIUS);
        obstaclesQTree.query(obstaclesCircle, myobstacles);

        const obstacleSteer = new p5.Vector(0, 0);
        myobstacles.map(i => i.userData).forEach(id => {
            const o = obstacles[id];
            const steer = p5.Vector.sub(this.pos, o.pos);
            obstacleSteer.add(steer);
        });

        obstacleSteer.setMag(targetsSettings.OBSTACLE_ACC_INTENSITY);
        return obstacleSteer;
    }

    this.move = () => {
        // Reset the acceleration after moving to avoid stacking forces of each iteration
        this.acc.mult(0);

        this.acc.add(this.getBorderAvoidingAcceleration());
        // this.acc.add(this.getWiggleAcceleration());
        this.acc.add(this.getAvoidBirdsAcceleration());
        // this.acc.add(this.getStayOnFrameAcceleration());
        // this.acc.add(this.getObstaclesAvoidingAcceleration());

        this.vel.add(this.acc);
        // this.vel.limit(targetsSettings.MAX_SPEED);
        this.vel.limit(boidsSettings.MAX_SPEED * 0.7);
        this.pos.add(this.vel);
    }

    this.show = () => {
        noStroke();
        fill('green');
        circle(this.pos.x, this.pos.y, this.r);
    }
}
