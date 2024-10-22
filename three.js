import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import gsap from "gsap";
import texture1Pic from './post1.jpeg'
import texture2Pic from './post2.jpeg'
import texture3Pic from './post3.jpeg'
import texture4Pic from './post4.jpeg'
class Sketch {
  constructor(containerId) {
    this.container = document.getElementById(containerId);

    // Основные параметры
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.scene = this.createScene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.time = 0;
    // this.controls = this.addOrbitControls();
    this.mousePos = new THREE.Vector2(0, 0);
    this.scrollProgress = 0;
    this.count = 6;
    this.lethForOne = 800;

    // Запускаем инициализацию
    this.init();

    const containerTL = gsap.timeline({
      paused: true
    });
    containerTL.from(this.container, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    });
    containerTL.reverse();

    const toggleContainerOpacity = () => {
      containerTL.reversed(!containerTL.reversed());
    }

    this.tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: `+=${this.count * this.lethForOne}`,
        scrub: 1,
        pin: true,
        markers: false,
        onToggle: () => {
          toggleContainerOpacity();
        },
        onUpdate: (self) => {
          const udaptedVal = self.progress * -8;
          this.scrollProgress = udaptedVal;
          console.log('scrollProgress', this.scrollProgress);
        }
      }
    })
    gsap.set(this.container, {
      opacity: 0,
    })
    gsap.from(this.meshes[0].mesh.scale, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: this.container,
        start: 'top top',
        end: '+=5',
        scrub: 1,
        markers: false,
      }
    })
  }

  async init() {
    // Добавляем объекты на сцену
    this.addObjects();

    // Обработчики событий
    this.addEventListeners();

    // Добавляем освещение
    this.addLight();

    // Запуск анимации
    this.animate();
  }

  // Создание сцены
  createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x242424);
    return scene;
  }

  // Создание камеры
  createCamera() {
    const fov = 70;
    const aspect = this.width / this.height;
    const near = 0.1;
    const far = 10;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 1.3);
    return camera;
  }

  // Создание рендера
  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(this.width, this.height);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    if (this.container) {
      this.container.appendChild(renderer.domElement);
    } else {
      console.error(`Элемент с id "${this.containerId}" не найден.`);
    }

    return renderer;
  }

  addLight() {
    const hemiLight = new THREE.HemisphereLight(0x099ff, 0xaa5500);
    this.scene.add(hemiLight);
  }

  // Добавление OrbitControls
  addOrbitControls() {
    return new OrbitControls(this.camera, this.renderer.domElement);
  }

  getMaterial() {
    const arrOfPics = [texture1Pic, texture2Pic, texture3Pic, texture4Pic];

    // get radmon pic from array
    const randomPic = arrOfPics[Math.floor(Math.random() * arrOfPics.length)];
    let texture1 = new THREE.TextureLoader().load(randomPic);
    texture1.colorSpace = THREE.SRGBColorSpace;
    return new THREE.ShaderMaterial({
      extensions: {
        derivatives: "extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { value: 0 },
        uTexture: { value: texture1 },
        progress: { value: 0 },
        resolution: { value: new THREE.Vector4() },
      },
      transparent: true,
      wireframe: false,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    });
  }

  addObjects() {
    this.geo = new THREE.PlaneGeometry(2, 1, 100, 100);


    this.meshes = [];
    for (let i = 0; i < this.count; i++) {
      let mesh = new THREE.Mesh(this.geo, this.getMaterial());
      this.meshes.push({
        mesh: mesh,
        progress: 0,
        pos: 0.8 * i,
      });
      this.scene.add(mesh);
    }
  }

  // Обработчик изменения размеров окна
  onWindowResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  onMouseMove(evt) {
    this.mousePos.x = (evt.clientX / this.width) * 2 - 1;
    this.mousePos.y = -(evt.clientY / this.height) * 2 + 1;
  }

  // Добавление обработчиков событий
  addEventListeners() {
    window.addEventListener("resize", this.onWindowResize.bind(this));

    window.addEventListener("mousemove", this.onMouseMove.bind(this), false);
  }

  // Анимация
  animate() {
    this.time += 0.05;
    this.meshes.forEach((mesh) => {
      mesh.mesh.material.uniforms.progress.value = mesh.pos + this.scrollProgress;
    })

    // this.controls.update();

    requestAnimationFrame(this.animate.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

export default Sketch;
