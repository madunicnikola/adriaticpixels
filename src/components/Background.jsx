import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useMemo, useRef } from "react";
import { SailShip } from './SailShip';
import { Float, Line } from '@react-three/drei';
import { Island } from './Island';

let camera, scene, renderer;
let controls, water, sun;
const totalLinePoints = 12000;

const loader = new GLTFLoader();
class Ship{
    constructor(){
        loader.load("/models/ship/SailShip.glb", function(gltf){
            scene.add(gltf.scene);
            gltf.scene.scale.set(8, 8, 8);
            gltf.scene.position.set(5, 0.8, 30);
            gltf.scene.rotation.y = 3;
        });
    }
    update(){
        if (this.shipModel){
            this.shipModel.rotation.y += 0.1;
        }
    }
};

class IslandOne{
    constructor(){
        loader.load("/models/islands/Island.glb", function(gltf){
            scene.add(gltf.scene);
            gltf.scene.scale.set(5, 5, 5);
            gltf.scene.position.set(300, 0, -2000);
            gltf.scene.rotation.y = 3;
        });
    }
    update(){
        if (this.islandModel){
            this.islandModel.rotation.y += 20;
        }
    }
}

const islandModel = new IslandOne();
const shipModel = new Ship();
WaterBackground();
animate();

export function WaterBackground() {

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    document.body.appendChild( renderer.domElement );

   
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 40, 30, 120 );
    
    // Water
    sun = new THREE.Vector3();

    const waterGeometry = new THREE.PlaneGeometry( 10000, 10000 );

    water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( './src/assets/waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;

    scene.add( water );

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;

    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        if ( renderTarget !== undefined ) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene( sky );

        scene.environment = renderTarget.texture;

    }

    updateSun();

    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    const waterUniforms = water.material.uniforms;

    window.addEventListener( 'resize', onWindowResize );

    // catmullromcurve3
const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -100),
    new THREE.Vector3(-2, 0, -200),
    new THREE.Vector3(-3, 0, -300),
    new THREE.Vector3(0, 0, -400),
    new THREE.Vector3(5, 0, -500),
    new THREE.Vector3(7, 0, -600),
    new THREE.Vector3(5, 0, -700),
    new THREE.Vector3(0, 0, -800),
    new THREE.Vector3(0, 0, -900),
    new THREE.Vector3(0, 0, -5000),
  ];
const curve = new THREE.CatmullRomCurve3(points);

const extrudePath = new THREE.TubeGeometry(curve, 200, 0.1, 8, false);
const shape = new THREE.Shape();
const points2D = curve.getPoints(50);
for (let i = 0; i < points2D.length; i++) {
  shape.lineTo(points2D[i].x, points2D[i].y);
}

const extrudeSettings = {
  steps: 100,
  bevelEnabled: false,
  extrudePath: new THREE.CatmullRomCurve3(points),
};

const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); 

const extrudedMesh = new THREE.Mesh(geometry, material);

scene.add(extrudedMesh);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
    requestAnimationFrame( animate );
    render();

}

function render() {
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderer.render( scene, camera );
}
