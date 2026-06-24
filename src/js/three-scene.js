import * as THREE from 'three'

let renderer, scene, camera, mesh, animId

export function initScene(container) {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.z = 3

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Fabric-like plane with vertex displacement
  const geo = new THREE.PlaneGeometry(4, 5, 48, 60)
  const mat = new THREE.MeshStandardMaterial({
    color: 0xc9b99a,
    roughness: 0.85,
    metalness: 0.1,
    side: THREE.DoubleSide,
    wireframe: false,
  })
  mesh = new THREE.Mesh(geo, mat)
  mesh.rotation.x = -0.2
  scene.add(mesh)

  // Lighting
  const ambient = new THREE.AmbientLight(0xf0ece4, 0.4)
  scene.add(ambient)

  const key = new THREE.DirectionalLight(0xffffff, 1.2)
  key.position.set(2, 4, 3)
  scene.add(key)

  const fill = new THREE.DirectionalLight(0xc9b99a, 0.5)
  fill.position.set(-3, -1, 2)
  scene.add(fill)

  window.addEventListener('resize', onResize)
  animate()
}

function animate() {
  animId = requestAnimationFrame(animate)
  const t = performance.now() * 0.001

  // Ripple vertex displacement
  const pos = mesh.geometry.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const wave = Math.sin(x * 1.5 + t * 0.8) * 0.08
               + Math.sin(y * 1.2 + t * 0.6) * 0.06
               + Math.sin((x + y) * 0.9 + t * 0.5) * 0.04
    pos.setZ(i, wave)
  }
  pos.needsUpdate = true
  mesh.geometry.computeVertexNormals()

  mesh.rotation.y = Math.sin(t * 0.2) * 0.08

  renderer.render(scene, camera)
}

function onResize() {
  const container = renderer.domElement.parentElement
  if (!container) return
  camera.aspect = container.clientWidth / container.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.clientWidth, container.clientHeight)
}

export function destroyScene() {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
  mesh?.geometry.dispose()
  mesh?.material.dispose()
}
