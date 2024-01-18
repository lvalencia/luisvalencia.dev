import { AmbientLight, Color, DirectionalLight, Light, PerspectiveCamera, Scene, WebGLRenderer } from "three";

interface AdjustViewArgs {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
}

export function adjustView({ canvas, renderer, camera }: AdjustViewArgs) {
  camera.updateMatrixWorld();

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width !== canvas.width || height !== canvas.height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
}

interface InitializeSceneArgs {
  canvas: HTMLCanvasElement;
}

interface InitializedScene {
  camera: PerspectiveCamera;
  scene: Scene;
}

export function initializeScene({canvas}: InitializeSceneArgs): InitializedScene {
  const camera = new PerspectiveCamera();
  const scene = new Scene();

  configureScene(scene);
  configureCamera({
    canvas,
    scene,
    camera,
  });

  return {
    camera,
    scene
  }
}

function configureScene(scene: Scene): void {
  const {
    background
  } = sceneConfiguration();
  const lightGrey = new Color(0xf0f0f0);

  scene.background = background;

  lights().forEach((light) => {
    scene.add(light);
  });
}

interface SceneConfiguration {
  background: Color;
}
function sceneConfiguration(): SceneConfiguration {
  const lightGrey = new Color(0xf0f0f0);
  return {
    background: lightGrey
  };
};

function lights(): Light[] {
  const white = new Color(0xffffff);

  // Make sure we can see the cubes in the scene
  const ambientLight = new AmbientLight(white, 0.5);

  /*
   * Cast a direct light from off to the side so we can see
   * the shadows made from the cubes onto each other
   */
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  const x = 5;
  const y = 5;
  const z = 5;
  directionalLight.position.set(x, y, z);
  directionalLight.castShadow = true;

  return [
    ambientLight,
    directionalLight
  ];
};

interface ConfigureCameraArgs {
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera; 
  scene: Scene;
}

function configureCamera({canvas, camera, scene}: ConfigureCameraArgs): void {
  const {
    fieldOfView,
    aspectRatio,
    nearClipping,
    farClipping,
    position: {
      x,
      y,
      z
    }
  } = cameraConfiguration(canvas);

  camera.fov = fieldOfView;
  camera.aspect = aspectRatio;
  camera.near = nearClipping;
  camera.far = farClipping;
  camera.position.set(x, y, z);
  camera.lookAt(scene.position);
  camera.updateProjectionMatrix();
}

interface SimplePosition {
  x: number;
  y: number;
  z: number;
}

interface CameraConfiguration {
  fieldOfView: number;
  aspectRatio: number;
  nearClipping: number;
  farClipping: number;
  position: SimplePosition;
}

function cameraConfiguration(canvas: HTMLCanvasElement): CameraConfiguration {
  /*
   * Camera position we want is an overhead view at
   * at a slight angle off perpendicular
   */
  const angleInDegrees = 70;
  const angleInRadians = (angleInDegrees / 180) * Math.PI;
  const distance = 4;

  const x = 0;
  const y = distance * Math.sin(angleInRadians);
  const z = distance * Math.cos(angleInRadians);

  /*
   * Camera aspect ratio should match the current 
   * aspect ratio of the canvas
   */
  const aspectRatio = canvas.clientWidth / canvas.clientHeight;

  return {
    fieldOfView: 75,
    aspectRatio,
    nearClipping: 0.1,
    farClipping: 100,
    position: {
      x,
      y,
      z
    }
  };
}
