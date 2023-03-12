import * as THREE from 'three'
import * as dat from 'dat.gui'
import './style.css'

// Debug
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
directionalLightFolder.open()
directionalLightFolder
  .addColor(parameters, 'directionalLightColor')
  .onChange(() => {
    directionalLight.color.set(parameters.directionalLightColor)
  })
directionalLightFolder.add(parameters, 'directionalLightIntensity').min(0)
.max(1)
.step(0.05)
.onChange(() => {
	directionalLight.intensity = parameters.directionalLightIntensity
})

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Material
const meshMaterial = new THREE.MeshToonMaterial({
  color: parameters.meshMaterialColor,
})

// Meshes
const mesh1 = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.4, 16, 60),
  meshMaterial
)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), meshMaterial)
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  meshMaterial
)
scene.add(mesh1, mesh2, mesh3)

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

// Animate
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}
tick()
