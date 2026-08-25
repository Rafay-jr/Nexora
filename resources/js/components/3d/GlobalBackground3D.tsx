import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GlobalBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 22;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Floating 3D Geometric Spheres & Mesh
    const sphereCount = 8;
    const spheres: THREE.Mesh[] = [];

    for (let i = 0; i < sphereCount; i++) {
      const geo = i % 2 === 0
        ? new THREE.IcosahedronGeometry(Math.random() * 1.5 + 0.8, 1)
        : new THREE.OctahedronGeometry(Math.random() * 1.2 + 0.6, 0);

      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0x6366f1 : i % 3 === 1 ? 0xa855f7 : 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        emissive: i % 2 === 0 ? 0x1e1b4b : 0x3b0764,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 15
      );
      mainGroup.add(mesh);
      spheres.push(mesh);
    }

    // Particle Constellation
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 45;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 20;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x818cf8,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0012;
      mouseY = (e.clientY - windowHalfY) * 0.0012;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      spheres.forEach((mesh, idx) => {
        mesh.rotation.x = elapsedTime * (0.15 + idx * 0.02);
        mesh.rotation.y = elapsedTime * (0.2 + idx * 0.02);
        mesh.position.y += Math.sin(elapsedTime * 1.2 + idx) * 0.008;
      });

      particles.rotation.y = elapsedTime * 0.03;

      mainGroup.rotation.y += (mouseX - mainGroup.rotation.y) * 0.03;
      mainGroup.rotation.x += (-mouseY - mainGroup.rotation.x) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70" />;
};

export default GlobalBackground3D;
