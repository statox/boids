let target;

let birds;
let birdsQTree;

let obstacles;
let obstaclesQTree;
let obstaclesCreationTimer=0;

let predators;
let predatorsQTree;
let predatorsCreationTimer=0;

let ORD;
let app;

let boidsSettings = {
    enableWiggle: true,
    enableRoundShape: true,

    enableAlignment: true,
    enableSeparation: true,
    enableCohesion: true,

    enableFollowMouse: false,
    enableFollowTarget: true,

    enableWrapEdges: true,
    enableShowPerception: false,

    enableObstaclesDrawing: false,
    enablePredatorDrawing: false,

    CROWD_SIZE: 100,
    MAX_WIGGLE_ANGLE: 50,

    ALIGNMENT_FRIENDS_RADIUS: 100,
    SEPARATION_FRIENDS_RADIUS: 30,
    COHESION_FRIENDS_RADIUS: 80,
    OBSTACLE_RADIUS: 30,
    PREDATOR_RADIUS: 50,

    WIGGLE_ACC_INTENSITY: 3,
    ALIGNMENT_ACC_INTENSITY: 3,
    SEPARATION_ACC_INTENSITY: 2,
    COHESION_ACC_INTENSITY: 3,
    TARGET_ACC_INTENSITY: 0.5,
    OBSTACLE_ACC_INTENSITY: 5,
    PREDATOR_ACC_INTENSITY: 7,

    MAX_ACC: 1,
    MAX_SPEED: 3,
    BORDER_LIMIT: 20,
}

let targetsSettings = {
    MAX_ACC: 1,
    MAX_SPEED: 3,
    BORDER_LIMIT: 40,

    ALIGNMENT_FRIENDS_RADIUS: 200,
    OBSTACLE_RADIUS: 30,

    WIGGLE_ACC_INTENSITY: 3,
    AVOID_BIRD_ACC_INTENSITY: 1,
    OBSTACLE_ACC_INTENSITY: 15,
    FRAME_ACC_INTENSITY: 3,
}


function resetObstacles() {
    obstacles = [];
}

function resetBirds() {
    birds = [];
    predators = [];

    target = new Target(0);

    for (let i=0; i<boidsSettings.CROWD_SIZE; i++) {
        // Random initial position
        const x = random(0, width);
        const y = random(0, height);
        const pos = new p5.Vector(x, y);

        const dx = random(-1, 1);
        const dy = random(-1, 1);

        // Constant initial velocity
        // const vel = new p5.Vector(1, 0).normalize();
        // Random initial velocity
        const vel = new p5.Vector(dx, dy).normalize();

        birds.push(new Bird(i, pos, vel));
    }
}
function setup() {
    app = new Vue({
        el: '#boidsApp',
        data: boidsSettings
    });

    // Create the canvas and put it in its div
    const myCanvas = createCanvas(10, 10);
    customResizeCanvas();
    myCanvas.parent("canvasDiv");
    ORD = new p5.Vector(0, 1);

    initializeButtons();
    resetBirds();
    resetObstacles();

    for (let i=0; i<2; i++) {
        const pos = new p5.Vector(random(0, width), random(0, height));
        predators.push(new Predator(i, pos, 30));
    }

    for (let i=0; i<width; i+=30) {
        const p1 = new p5.Vector(i, 0);
        const obstacle1 = new Obstacle(obstacles.length, p1, 30);
        obstacles.push(obstacle1);

        const p2 = new p5.Vector(i, height);
        const obstacle2 = new Obstacle(obstacles.length, p2, 30);
        obstacles.push(obstacle2);
    }
}

function draw() {
    background(0, 0, 0);

    const boundaries = new Rectangle(0, 0, width, height);
    const capacity = 4;
    birdsQTree = new QuadTree(boundaries, capacity);
    obstaclesQTree = new QuadTree(boundaries, capacity);
    predatorsQTree = new QuadTree(boundaries, capacity);

    const mouseInScreen = (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height);

    if (boidsSettings.enableObstaclesDrawing && mouseInScreen) {
        obstaclesCreationTimer = (obstaclesCreationTimer + 1) % 10;
        if (obstaclesCreationTimer === 0) {
            const mousePosition = new p5.Vector(mouseX, mouseY);
            const obstacle = new Obstacle(obstacles.length, mousePosition, 30);
            obstacles.push(obstacle);
        }
    }

    if (boidsSettings.enablePredatorDrawing && mouseInScreen) {
        predatorsCreationTimer = (predatorsCreationTimer + 1) % 50;
        if (predatorsCreationTimer === 0) {
            const mousePosition = new p5.Vector(mouseX, mouseY);
            const predator = new Predator(predators.length, mousePosition, 30);
            predators.push(predator);
        }
    }

    predators.forEach(p => {
        predatorsQTree.insert(new Point(p.pos.x, p.pos.y, p.id));
    });

    obstacles.forEach(o => {
        // TODO: I think it's not needed to do that at each iteration
        obstaclesQTree.insert(new Point(o.pos.x, o.pos.y, o.id));
        o.show();
    });

    birds.forEach(b => {
        birdsQTree.insert(new Point(b.pos.x, b.pos.y, b.id));
    });

    // TODO:
    // I thought there was an issue when the compute and the move were done
    // at the same time but now I'm not sure I see a visible change when
    // the computation is done with the move
    birds.forEach(b => {
        b.computeMove();
    });

    birds.forEach(b => {
        b.move();
        b.show();
    });

    predators.forEach(p => {
        p.move();
        p.show();
    });

    if (!boidsSettings.enableWrapEdges) {
        stroke('green');
        strokeWeight(10);
        line(0, 0, width, 0);
        line(0, 0, 0, height);
        line(width, 0, width, height);
        line(0, height, width, height);
    }

    if (boidsSettings.enableFollowTarget) {
        target.move();
        target.show();
    }
}
