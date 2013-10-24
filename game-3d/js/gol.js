var container, stats;
var camera, scene, renderer;
var directionallight;
var grid;
var gridold;
var gridmax;
var cubegeometry;
var cubematerial;
var linegeometry;
var linematerial;
var ambientLight;
var lastStep = Date.now();
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

initGrid();
seedLife();
preInit();
buildScene();
animate();

function initGrid() {
    gridmax = 40;
    grid = new Array(gridmax);
    for (var i = 0; i < gridmax; i++) {
        grid[i] = new Array(gridmax);
        for (var j = 0; j < gridmax; j++) {
            grid[i][j] = false;
        }
    }
}

function seedLife() {
    var h = gridmax / 2;
    grid[h][h - 1] = true;
    grid[h][h] = true;
    grid[h][h + 1] = true;
    grid[h - 1][h] = true;
    grid[h + 1][h - 1] = true;
}

function step() {
    gridold = grid;
    initGrid();
    for (var i = 1; i < gridmax - 1; i++) {
        for (var j = 1; j < gridmax - 1; j++) {
            var neighbours = 0;

            if (gridold[i - 1][j - 1]) neighbours++;
            if (gridold[i][j - 1]) neighbours++;
            if (gridold[i + 1][j - 1]) neighbours++;

            if (gridold[i - 1][j]) neighbours++;
            if (gridold[i + 1][j]) neighbours++;

            if (gridold[i - 1][j + 1]) neighbours++;
            if (gridold[i][j + 1]) neighbours++;
            if (gridold[i + 1][j + 1]) neighbours++;

            grid[i][j] = (neighbours == 3) || ((neighbours == 2) && gridold[i][j]);
        }
    }
}

function preInit() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 5000);
    camera.position.x = 200;
    camera.position.y = 500;

    // Grid

    var size = gridmax * 25, step = 50;

    linegeometry = new THREE.Geometry();

    for (var i = -size; i <= size; i += step) {

        linegeometry.vertices.push(new THREE.Vector3(-size, 0, i));
        linegeometry.vertices.push(new THREE.Vector3(size, 0, i));

        linegeometry.vertices.push(new THREE.Vector3(i, 0, -size));
        linegeometry.vertices.push(new THREE.Vector3(i, 0, size));

    }

    linematerial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 });

    // Cubes

    cubegeometry = new THREE.CubeGeometry(50, 50, 50);
    cubematerial = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading, overdraw: true });


    // Lights

    ambientLight = new THREE.AmbientLight(Math.random() * 0x10);

    directionalLight = new THREE.DirectionalLight(Math.random() * 0xffffff);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random() - 0.5;
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);

}

function buildScene() {
    scene = new THREE.Scene();
    var sceneline = new THREE.Line(linegeometry, linematerial);
    sceneline.type = THREE.LinePieces;
    scene.add(sceneline);
    for (var i = 0; i < gridmax; i++) {
        for (var j = 0; j < gridmax; j++) {
            if (grid[i][j] == true) {
                var cube = new THREE.Mesh(cubegeometry, cubematerial);
                cube.scale.y = 1;

                cube.position.x = i * 50 - gridmax * 25 + 25;
                cube.position.y = 25;
                cube.position.z = j * 50 - gridmax * 25 + 25;

                scene.add(cube);
            }
        }
    }
    scene.add(ambientLight);
    scene.add(directionalLight);
}

function onWindowResize() {

    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove(event) {

    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);

}

function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {
    if (Date.now() - lastStep > 200) {
        lastStep = Date.now();
        buildScene();
        step();
    }
    var timer = Date.now() * 0.00005;

    timer += mouseX * 0.001;

    camera.position.x = Math.cos(timer) * 2000;
    camera.position.z = Math.sin(timer) * 2000;
    camera.position.y += (-mouseY - camera.position.y) * 1 + 1000;
    camera.lookAt(scene.position);

    directionalLight.position.x = camera.position.x;
    directionalLight.position.y = camera.position.y;
    directionalLight.position.z = camera.position.z;
    directionalLight.position.normalize();

    renderer.render(scene, camera);

}
