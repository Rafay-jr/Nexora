import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroCanvas3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central TorusKnot (Primary 3D mesh)
    const torusGeo = new THREE.TorusKnotGeometry(2.8, 0.8, 128, 32);
    const torusMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      emissive: 0x1e1b4b,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: true,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    mainGroup.add(torusMesh);

    // 2. Floating Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      wireframe: true,
      emissive: 0x3b0764,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(-6, 3, -2);
    mainGroup.add(icoMesh);

    // 3. Floating Octahedron
    const octaGeo = new THREE.OctahedronGeometry(1.2, 0);
    const octaMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      wireframe: true,
      emissive: 0x831843,
    });
    const octaMesh = new THREE.Mesh(octaGeo, octaMat);
    octaMesh.position.set(6, -3, -1);
    mainGroup.add(octaMesh);

    // 4. Particle Constellation
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(geometry, particleMat);
    scene.add(particles);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x818cf8, 2.5);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc084fc, 2.0);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    // Mouse interactive target
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0015;
      mouseY = (e.clientY - windowHalfY) * 0.0015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Rotate 3D meshes
      torusMesh.rotation.x = elapsedTime * 0.2;
      torusMesh.rotation.y = elapsedTime * 0.3;

      icoMesh.rotation.x = elapsedTime * 0.4;
      icoMesh.rotation.z = elapsedTime * 0.2;
      icoMesh.position.y = 3 + Math.sin(elapsedTime * 1.5) * 0.4;

      octaMesh.rotation.y = elapsedTime * 0.5;
      octaMesh.position.y = -3 + Math.cos(elapsedTime * 1.2) * 0.4;

      particles.rotation.y = elapsedTime * 0.05;

      // Smooth camera/group tilt based on cursor
      mainGroup.rotation.y += (mouseX - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (-mouseY - mainGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80" />;
};

export default HeroCanvas3D;
