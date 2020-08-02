function customResizeCanvas() {
    const dim = Math.min(windowHeight, windowWidth) * 0.9;
    resizeCanvas(dim, dim);
}

function initializeButtons() {
    document.getElementById('toggleWiggleButton').addEventListener('click', (e) => {
        boidsSettings.enableWiggle = !boidsSettings.enableWiggle;
    })

    document.getElementById('changeShapeButton').addEventListener('click', (e) => {
        boidsSettings.enableRoundShape = !boidsSettings.enableRoundShape;
    })

    document.getElementById('toggleAlignmentButton').addEventListener('click', (e) => {
        boidsSettings.enableAlignment = !boidsSettings.enableAlignment;
    })

    document.getElementById('toggleSeparationButton').addEventListener('click', (e) => {
        boidsSettings.enableSeparation = !boidsSettings.enableSeparation;
    })

    document.getElementById('toggleCohesionButton').addEventListener('click', (e) => {
        boidsSettings.enableCohesion = !boidsSettings.enableCohesion;
    })

    document.getElementById('followMouseButton').addEventListener('click', (e) => {
        boidsSettings.enableFollowMouse = !boidsSettings.enableFollowMouse;
    });

    document.getElementById('followTargetButton').addEventListener('click', (e) => {
        boidsSettings.enableFollowTarget = !boidsSettings.enableFollowTarget;
    });

    document.getElementById('wrapEdgesButton').addEventListener('click', (e) => {
        boidsSettings.enableWrapEdges = !boidsSettings.enableWrapEdges;
    });

    document.getElementById('showPerceptionCirclesButton').addEventListener('click', (e) => {
        boidsSettings.enableShowPerception = !boidsSettings.enableShowPerception;
    });

    document.getElementById('obstaclesDrawingButton').addEventListener('click', (e) => {
        boidsSettings.enableObstaclesDrawing = !boidsSettings.enableObstaclesDrawing;
    });

    document.getElementById('predatorDrawingButton').addEventListener('click', (e) => {
        boidsSettings.enablePredatorDrawing = !boidsSettings.enablePredatorDrawing;
    });
}

function keyPressed() {
    if (keyCode === CONTROL) {
        boidsSettings.enableObstaclesDrawing = true;
    }
    if (keyCode === SHIFT) {
        boidsSettings.enablePredatorDrawing = true;
    }
};

function keyReleased() {
    if (keyCode === CONTROL) {
        boidsSettings.enableObstaclesDrawing = false;
    }
    if (keyCode === SHIFT) {
        boidsSettings.enablePredatorDrawing = false;
    }
}

function windowResized() {
    customResizeCanvas();
}

function mousePressed(e) {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return;
    }
    const mousePosition = new p5.Vector(mouseX, mouseY);

    if (mouseButton === 'left') {
        const dx = random(-1, 1);
        const dy = random(-1, 1);
        const vel = new p5.Vector(dx, dy).normalize();

        birds.push(new Bird(birds.length, mousePosition, vel));
    }

    if (mouseButton === 'right') {
        const obstacle = new Obstacle(obstacles.length, mousePosition, 30);
        obstacles.push(obstacle);
    }
}
