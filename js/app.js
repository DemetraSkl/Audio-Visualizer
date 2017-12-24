var SCREEN_WIDTH = window.innerWidth,
    SCREEN_HEIGHT = window.innerHeight - 100,
    mouseX = 0,
    mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = (window.innerHeight - 100)/ 2,
    SEPARATION = 200,
    AMOUNTX = 10,
    AMOUNTY = 10,
    camera, scene, renderer, analyser, material, canvas, context, fftSize;
init();
animate();

function init() {
    var container, separation = 100,
        amountX = 50,
        amountY = 50,
        particles, particle;

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    renderer = new THREE.CanvasRenderer();
    renderer.setClearColor('black', 1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);


    // Find canvas element
    canvas = document.querySelector("canvas");
    context = canvas.getContext('2d');

    // particles
    var PI2 = Math.PI * 2;
    material = new THREE.SpriteCanvasMaterial({
        color: '#ad2da4',
        program: function(context) {
            context.beginPath();
            // x-coord of center, y-coord of center, radius, start angle, end angle, (opt) ccw
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();
        }
    });
    for (var i = 0; i < 1000; i++) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 10 + 450);
        particle.scale.multiplyScalar(5);
        particle.name = 10000 - i;
        scene.add(particle);
    }
    // lines
    for (var i = 0; i < 300; i++) {
        var geometry = new THREE.Geometry();
        var vertex = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vertex.normalize();
        vertex.multiplyScalar(450);
        geometry.vertices.push(vertex);
        var vertex2 = vertex.clone();
        vertex2.multiplyScalar(1.06);
        geometry.vertices.push(vertex2);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#67e822', opacity: Math.random() }));
        line.name = i;
        scene.add(line);
    }

    // load a sound and set it as the Audio object's buffer
    fftSize = 1024;
    var audioLoader = new THREE.AudioLoader();
    var listener = new THREE.AudioListener();
    var audio = new THREE.Audio(listener);
    audioLoader.load('sounds/Gu_zheng_mix.mp3', function(buffer) {

        audio.setBuffer(buffer);
        //audio.setLoop(true);
        audio.play();

    });
    //
    analyser = new THREE.AudioAnalyser(audio, fftSize);


    // var axes = new THREE.AxesHelper(100);
    // scene.add(axes);

    document.querySelector("#pause-btn").addEventListener("click", function() {
        console.log("Im clicked");
        audio.pause();
    });

    document.querySelector("#play-btn").addEventListener("click", function() {
        console.log("Im clicked");
        audio.play();
    });

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = (window.innerHeight - 100) / 2;
    camera.aspect = window.innerWidth / (window.innerHeight - 100);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, (window.innerHeight - 100));
}
//
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}
//
function animate() {
    requestAnimationFrame(animate);
    render();


}

function render() {
    //var freqData = analyser.getFrequencyData().values();
    //var freqDataLength = analyser.getFrequencyData().length;

    var timeData = analyser.getTimeDomainData().values();
    var timeDataLength = analyser.getTimeDomainData().length;
    //console.log("time data: " + timeDataLength); // 32

    var wv = new SoundWave(timeData);
    wv.draw();    


    var avgFreq = analyser.getAverageFrequency();

    // redraw particles
    for (var i = 0; i < 1000; i++) {
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(avgFreq * 2);
        particle.scale.multiplyScalar(4);
        particle.name = 10000 - i;
        scene.add(particle);
    }



    // redraw lines
    for (var i = 0; i < 300; i++) {
        var geometry = new THREE.Geometry();
        var vertex = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
        vertex.normalize();
        vertex.multiplyScalar(avgFreq * 4);
        geometry.vertices.push(vertex);
        var vertex2 = vertex.clone();
        //vertex2.multiplyScalar(Math.random() * 0.3 + 1);
        vertex2.multiplyScalar(1.06);
        geometry.vertices.push(vertex2);
        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#67e822', opacity: Math.random() }));
        line.name = i;
        scene.add(line);
    }
    // remove lines
    for (var i = 0; i < 300; i++) {
        var delLine = scene.getObjectByName(i);
        scene.remove(delLine);
    }
    // remove particles
    for (var i = 0; i < 1000; i++) {
        var delParticle = scene.getObjectByName(10000 - i);
        scene.remove(delParticle);
    }




    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY + 200 - camera.position.y) * .05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}