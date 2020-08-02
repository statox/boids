function Predator(id, pos, vel, r) {
    this.id = id;
    this.pos = pos;
    this.vel = new p5.Vector(0, 0);
    this.acc = new p5.Vector(0, 0);
    this.r = r || 30;

    // Either wrap around edges or return an acceleration repealling from edges
    this.getBorderAvoidingAcceleration = () => {
        const steering = new p5.Vector(0, 0);
        if (boidsSettings.enableWrapEdges) {
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
        }

        const maxPullbackAcc = 100;
        if (this.pos.x < boidsSettings.BORDER_LIMIT) {
            this.vel.x = abs(this.vel.x);
        }
        if (this.pos.x > width - boidsSettings.BORDER_LIMIT) {
            this.vel.x = -abs(this.vel.x);
        }
        if (this.pos.y < boidsSettings.BORDER_LIMIT) {
            this.vel.y = abs(this.vel.y);
        }
        if (this.pos.y > height - boidsSettings.BORDER_LIMIT) {
            this.vel.y = -abs(this.vel.y);
        }
        return steering;
    };

    this.getWiggleAcceleration = () => {
        const maxAngleRad = radians(40);
        const wiggleSteer = p5.Vector.random2D();
        wiggleSteer.normalize().setMag(boidsSettings.WIGGLE_ACC_INTENSITY);
        return wiggleSteer;
    };

    // Compute steering force towards birds center of mass
    this.getChaseBirdsAcceleration = () => {
        const cohesionSteer = new p5.Vector(0, 0);

        const localBirds = [];
        const nearCircle = new Circle(this.pos.x, this.pos.y, boidsSettings.ALIGNMENT_FRIENDS_RADIUS * 2);
        birdsQTree.query(nearCircle, localBirds);

        localBirds.map(i => i.userData).forEach(id => {
            const pos = birds[id].pos;
            const steer = pos.copy().sub(this.pos);
            cohesionSteer.add(steer);
        });

        cohesionSteer.div(birds.length);
        cohesionSteer.setMag(boidsSettings.COHESION_ACC_INTENSITY);
        cohesionSteer.limit(boidsSettings.MAX_ACC);
        return cohesionSteer;
    };

    this.move = () => {
        // Reset the acceleration after moving to avoid stacking forces of each iteration
        this.acc.mult(0);

        this.acc.add(this.getBorderAvoidingAcceleration());
        this.acc.add(this.getWiggleAcceleration());
        this.acc.add(this.getChaseBirdsAcceleration());

        this.vel.add(this.acc);
        this.vel.limit(boidsSettings.MAX_SPEED);
        this.pos.add(this.vel);
    }

    this.show = () => {
        fill('red');
        circle(this.pos.x, this.pos.y, 30);
    }
}
