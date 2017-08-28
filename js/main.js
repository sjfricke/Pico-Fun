utils.addTimerElement();

// initalize event variables "e_" prefix == "event variable"
var e_theta = 0;
var e_phi = 0;
var e_amortization = 0.50; // increase for less resistant after drag release
var e_drag = false;
var e_oldX = 0, e_oldY = 0;
var e_drag_dX = 0, e_drag_dY = 0;

var canvas = document.getElementById("gl-canvas");
if (!utils.testWebGL2()) {
    console.error("WebGL 2 not available");
    document.body.innerHTML = "This example requires WebGL 2 which is unavailable on this system."
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var app = PicoGL.createApp(canvas)
.clearColor(0.0, 0.0, 0.0, 1.0)
.depthTest();
var timer = app.createTimer();


// PROGRAM
var vsSource =  document.getElementById("vs").text.trim();
var fsSource =  document.getElementById("fs").text.trim();
var program = app.createProgram(vsSource, fsSource);
// GEOMETRY IN VERTEX BUFFERS
var positions = app.createVertexBuffer(PicoGL.FLOAT, 3, bunny_points);
// COMBINE VERTEX BUFFERS INTO VERTEX ARRAY
var triangleArray = app.createVertexArray()
.attributeBuffer(0, positions);

// SET UP UNIFORM BUFFER
var projMatrix = mat4.create();
var viewMatrix = mat4.create();
var eyePosition = vec3.fromValues(1, 1, 5);
var viewProjMatrix = mat4.create();

mat4.perspective(projMatrix, Math.PI / 2, canvas.width / canvas.height, 0.1, 10.0);
mat4.lookAt(viewMatrix, eyePosition, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
var sceneUniformBuffer = app.createUniformBuffer([
    PicoGL.FLOAT_MAT4,
])
.set(0, viewProjMatrix)
.update();

var modelMatrix = mat4.create();
var rotateXMatrix = mat4.create();
var rotateYMatrix = mat4.create();
var angleX = 0;
var angleY = 0;

window.onresize = function() {
    app.resize(window.innerWidth, window.innerHeight);
    mat4.perspective(projMatrix, Math.PI / 2, app.width / app.height, 0.1, 10.0);
    mat4.multiply(viewProjMatrix, projMatrix, viewMatrix);
    
    sceneUniformBuffer.set(0, viewProjMatrix).update();
}

// CREATE DRAW CALL FROM PROGRAM AND VERTEX ARRAY
//var drawCall = app.createDrawCall(program, triangleArray, PicoGL.POINTS)
var drawCall = app.createDrawCall(program, triangleArray)
.uniformBlock("SceneUniforms", sceneUniformBuffer);

// Only runs first time so block appears on load
mat4.fromXRotation(rotateXMatrix, angleX);
mat4.fromYRotation(rotateYMatrix, angleY);
mat4.multiply(modelMatrix, rotateXMatrix, rotateYMatrix);
drawCall.uniform("uModel", modelMatrix);

function draw() {      
    if (timer.ready()) {
        utils.updateTimerElement(timer.cpuTime, timer.gpuTime);
    }
    timer.start();
    // DRAW
    app.clear();

    if (!e_drag) {
       e_drag_dX *= e_amortization, e_drag_dY*=e_amortization;
       e_theta+=e_drag_dX, e_phi+=e_drag_dY;
      // mat4.fromXRotation(rotateXMatrix, e_phi);
        //mat4.fromYRotation(rotateYMatrix, e_theta);
        
    }

     mat4.fromXRotation(rotateXMatrix, e_phi);
     mat4.fromYRotation(rotateYMatrix, e_theta);   
    mat4.multiply(modelMatrix, rotateXMatrix, rotateYMatrix);
        drawCall.uniform("uModel", modelMatrix);

    drawCall.draw();
    
    timer.end();
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
