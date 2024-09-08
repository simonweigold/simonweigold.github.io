// Basic Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Create nodes and store them in an array
const nodes = [];
const edges = [];
const nodeCount = 100;  // Adjust this number for more nodes

const createNode = (x, y, z, size = 1, color = 0x00ff00) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    scene.add(sphere);
    return sphere;
};

// Main nodes
nodes.push(createNode(0, 0, 0, 3, 0x7A67E0)); // Home
nodes.push(createNode(10, 15, 0, 2.5, 0x7A67E0)); // About
nodes.push(createNode(-20, -5, 0, 3.25, 0x7A67E0)); // Projects

// Background nodes (randomly generated)
for (let i = 0; i < nodeCount; i++) {
    const randomNode = createNode(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        0.5,
        0xEDEAFF
    );
    nodes.push(randomNode);
}

// Create edges between nodes
const createEdge = (node1, node2) => {
    const material = new THREE.LineBasicMaterial({ color: 0x2A2A2A });
    const points = [];
    points.push(node1.position);
    points.push(node2.position);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    edges.push(line);
};

// Add edges based on average of 2.4 edges per node
const totalEdges = Math.round(nodes.length * 2.4 / 2);  // Divided by 2 to account for bi-directional edges

for (let i = 0; i < totalEdges; i++) {
    const node1 = nodes[Math.floor(Math.random() * nodes.length)];
    const node2 = nodes[Math.floor(Math.random() * nodes.length)];

    if (node1 !== node2) {
        createEdge(node1, node2);
    }
}

// Set the camera position
camera.position.set(0, 0, 100);

// Render loop
const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

// Resize handling
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Debugging: log to check if the script is running correctly
console.log("Three.js scene initialized with nodes and edges.");
