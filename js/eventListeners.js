// Mouse and Keyboard events listeners
canvas.addEventListener('wheel',     mouseWheel, false);
canvas.addEventListener("mousedown", mouseDown,  false);
canvas.addEventListener("mouseup",   mouseUp,    false);
canvas.addEventListener("mouseout",  mouseUp,    false);
canvas.addEventListener("mousemove", mouseMove,  false);
window.addEventListener('keydown',   keyDown,    false);

// Mouse and keyboard event functions

var ZOOM_SPEED = 0.25;
// zooms into the point cloud by going towards origin
function mouseWheel(event) {
    console.log(event);
    if (event.deltaY < 0.0){ // Zoom Out
        eyePosition[2] -=  ZOOM_SPEED;
    }
    else { // Zoom In
        eyePosition[2] += (eyePosition[2] > 1.5) ? ZOOM_SPEED : 0.0;
    }

    // update viewProjection
    mat4.lookAt(viewMatrix, eyePosition, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
    mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
    sceneUniformBuffer.set(0, viewProjMatrix).update();
}

// Turn on drag effect and get starting x,y coords
function mouseDown(event) {
    e_drag = true;
    e_oldX = event.pageX, e_oldY = event.pageY;
    event.preventDefault();
    return false; // TODO nned?
}

// turn of all mouse effect
function mouseUp(event) {
    e_drag = false;
}

function mouseMove(event) {
    if (!e_drag) { return false; }
    e_drag_dX = (event.pageX-e_oldX)*2*Math.PI/canvas.width,
    e_drag_dY = (event.pageY-e_oldY)*2*Math.PI/canvas.height;
    e_theta += e_drag_dX;
    e_phi += e_drag_dY;
    e_oldX = event.pageX, e_oldY = event.pageY;
    event.preventDefault();
}


// rotate with arrow keys
function keyDown(event) {
    switch(event.keyCode) {
    case 37: // left
        angleX -= .05;
        break;
    case 39: // right
        angleX += .05;
        break; 
    case 38: // up
        angleY += .05;
        break;
    case 40: // down
        angleY -= .05;
        break;   
    default:
        return;       
    }

    mat4.fromXRotation(rotateXMatrix, angleX);
    mat4.fromYRotation(rotateYMatrix, angleY);
    mat4.multiply(modelMatrix, rotateXMatrix, rotateYMatrix);
    drawCall.uniform("uModel", modelMatrix);
   
};