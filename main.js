import * as THREE from 'three'
import * as dat from 'dat.gui'
import './style.css'

/*
Debug UI-
 */
const gui = new dat.GUI({ closed: false, width: 320 })

const parameters = {
  meshMaterialColor: '#ffeded',
  directionalLightColor: '#ffffff',
  directionalLightIntensity: 1,
}

gui.addColor(parameters, 'meshMaterialColor').onChange(() => {
  meshMaterial.color.set(parameters.meshMaterialColor)
})

// directionalLightFolder
const directionalLightFolder = gui.addFolder('directionalLight')
directionalLightFolder
  .addColor(parameters, 'directionalLightColor')
  .onChange(() => {
    directionalLight.color.set(parameters.directionalLightColor)
  })
directionalLightFolder
  .add(parameters, 'directionalLightIntensity')
  .min(0)
  .max(1)
  .step(0.05)
  .onChange(() => {
    directionalLight.intensity = parameters.directionalLightIntensity
  })
/* 
-Debug UI
 */

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('./textures/gradients/gradient1.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const meshMaterial = new THREE.MeshToonMaterial({
  color: parameters.meshMaterialColor,
  gradientMap: gradientTexture,
})

// Meshes
const objectsDistance = 4

const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 24, 64),
  meshMaterial
)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 44), meshMaterial)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 126, 42),
  meshMaterial
)

mesh2.position.y = -objectsDistance * 1
mesh3.position.y = -objectsDistance * 2

scene.add(mesh1, mesh2, mesh3)

const sectionsMeshes = [mesh1, mesh2, mesh3]

// Lights
const directionalLight = new THREE.DirectionalLight(
  parameters.directionalLightColor,
  1
)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 6
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Scroll
let scrollY = window.scrollY

window.addEventListener('scroll', () => {
  scrollY = window.scrollY
})

// Animate
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Animate meshes
  sectionsMeshes.forEach((mesh) => {
    mesh.rotation.x = elapsedTime * 0.1
    mesh.rotation.y = elapsedTime * 0.12
  })

  // Animate camera
  camera.position.y = (-scrollY / sizes.height) * objectsDistance

  // Render
  renderer.render(scene, camera)
  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}
tick()
