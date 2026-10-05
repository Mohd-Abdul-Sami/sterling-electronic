import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Eye, Sparkles } from 'lucide-react';

interface Product3DViewerProps {
  modelType?: 'phone' | 'laptop' | 'audio' | 'watch' | 'console' | 'sphere';
  primaryColor?: string;
  productName?: string;
  fallbackImage?: string;
  autoRotate?: boolean;
}

export const Product3DViewer: React.FC<Product3DViewerProps> = ({
  modelType = 'phone',
  primaryColor = '#1e2433',
  productName = 'Sterling Electronics',
  fallbackImage = '',
  autoRotate: initialAutoRotate = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const primaryMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(initialAutoRotate);
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  // Live color change
  useEffect(() => {
    if (primaryMaterialRef.current) {
      primaryMaterialRef.current.color.set(primaryColor);
    }
  }, [primaryColor]);

  // Wireframe toggle
  useEffect(() => {
    if (objectGroupRef.current) {
      objectGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => (m.wireframe = wireframe));
          } else {
            child.material.wireframe = wireframe;
          }
        }
      });
    }
  }, [wireframe]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlAvailable(false);
        return;
      }
    } catch {
      setWebGlAvailable(false);
      return;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.8, 5.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x06b6d4, 3.2);
    cyanRim.position.set(-6, 2, -3);
    scene.add(cyanRim);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fillLight.position.set(4, -4, -2);
    scene.add(fillLight);

    // Master Model Group
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);
    objectGroupRef.current = objectGroup;

    const primaryMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(primaryColor),
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });
    primaryMaterialRef.current = primaryMat;

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.25,
    });

    const glowScreenMat = new THREE.MeshPhysicalMaterial({
      color: 0x050711,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.35,
    });

    if (modelType === 'phone') {
      // Rounded Titanium Phone Chassis
      const shape = new THREE.Shape();
      const w = 2.0, h = 4.1, r = 0.32;
      shape.moveTo(-w / 2 + r, -h / 2);
      shape.lineTo(w / 2 - r, -h / 2);
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      shape.lineTo(w / 2, h / 2 - r);
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      shape.lineTo(-w / 2 + r, h / 2);
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      shape.lineTo(-w / 2, -h / 2 + r);
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

      const phoneGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.03, bevelThickness: 0.03 });
      phoneGeo.center();
      const phoneMesh = new THREE.Mesh(phoneGeo, primaryMat);
      objectGroup.add(phoneMesh);

      // Curved Screen
      const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.92, 4.0), glowScreenMat);
      screenMesh.position.z = 0.115;
      objectGroup.add(screenMesh);

      // Camera Island
      const islandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.35, 0.1), accentMat);
      islandMesh.position.set(-0.48, 1.15, -0.12);
      objectGroup.add(islandMesh);

      // Lenses
      const lensGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 32);
      const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x0284c7, metalness: 0.95, roughness: 0.05, emissive: 0x0284c7, emissiveIntensity: 0.5 });
      for (let i = 0; i < 3; i++) {
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(-0.48, 1.5 - i * 0.42, -0.16);
        objectGroup.add(lens);
      }
    } else if (modelType === 'laptop') {
      // Aluminum unibody base
      const base = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.1, 2.3), primaryMat);
      objectGroup.add(base);

      // Trackpad
      const trackpad = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.75), accentMat);
      trackpad.rotation.x = -Math.PI / 2;
      trackpad.position.set(0, 0.052, 0.65);
      objectGroup.add(trackpad);

      // Screen Lid
      const lidGroup = new THREE.Group();
      lidGroup.position.set(0, 0.05, -1.1);
      lidGroup.rotation.x = -Math.PI / 3;

      const lid = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.2, 0.08), primaryMat);
      lid.position.set(0, 1.1, 0);
      lidGroup.add(lid);

      const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.05), glowScreenMat);
      screen.position.set(0, 1.1, 0.045);
      lidGroup.add(screen);

      objectGroup.add(lidGroup);
      objectGroup.position.y = -0.4;
    } else if (modelType === 'audio') {
      // Planar headphones
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 16, 64, Math.PI), primaryMat);
      band.rotation.z = -Math.PI;
      objectGroup.add(band);

      const cupGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.42, 32);
      const leftCup = new THREE.Mesh(cupGeo, primaryMat);
      leftCup.rotation.z = Math.PI / 2;
      leftCup.position.set(-1.6, -0.2, 0);
      objectGroup.add(leftCup);

      const rightCup = new THREE.Mesh(cupGeo, primaryMat);
      rightCup.rotation.z = Math.PI / 2;
      rightCup.position.set(1.6, -0.2, 0);
      objectGroup.add(rightCup);

      const padGeo = new THREE.TorusGeometry(0.7, 0.18, 16, 32);
      const padMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.85 });
      const leftPad = new THREE.Mesh(padGeo, padMat);
      leftPad.rotation.y = Math.PI / 2;
      leftPad.position.set(-1.4, -0.2, 0);
      objectGroup.add(leftPad);

      const rightPad = new THREE.Mesh(padGeo, padMat);
      rightPad.rotation.y = Math.PI / 2;
      rightPad.position.set(1.4, -0.2, 0);
      objectGroup.add(rightPad);
    } else if (modelType === 'watch') {
      // Titanium smartwatch
      const caseMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.35, 0.35, 48), primaryMat);
      caseMesh.rotation.x = Math.PI / 2;
      objectGroup.add(caseMesh);

      const face = new THREE.Mesh(new THREE.CircleGeometry(1.22, 48), glowScreenMat);
      face.position.z = 0.18;
      objectGroup.add(face);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.25, 24), accentMat);
      crown.rotation.z = Math.PI / 2;
      crown.position.set(1.45, 0.2, 0);
      objectGroup.add(crown);

      const strapGeo = new THREE.BoxGeometry(1.15, 1.8, 0.12);
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x1e2433, roughness: 0.65 });
      const topStrap = new THREE.Mesh(strapGeo, strapMat);
      topStrap.position.set(0, 1.8, -0.05);
      objectGroup.add(topStrap);

      const bottomStrap = new THREE.Mesh(strapGeo, strapMat);
      bottomStrap.position.set(0, -1.8, -0.05);
      objectGroup.add(bottomStrap);
    } else {
      // Cyber console / ambient orb
      const orb = new THREE.Mesh(new THREE.SphereGeometry(1.4, 48, 48), primaryMat);
      objectGroup.add(orb);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.06, 16, 64), glowScreenMat);
      ring.rotation.x = Math.PI / 3;
      objectGroup.add(ring);
    }

    // Drag Orbit with smooth inertia damping
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velX = 0;
    let velY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      velX = 0;
      velY = 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      velX = deltaX * 0.008;
      velY = deltaY * 0.008;

      if (objectGroupRef.current) {
        objectGroupRef.current.rotation.y += velX;
        objectGroupRef.current.rotation.x += velY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Touch support for mobile/tablets
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        velX = 0;
        velY = 0;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;

      velX = deltaX * 0.008;
      velY = deltaY * 0.008;

      if (objectGroupRef.current) {
        objectGroupRef.current.rotation.y += velX;
        objectGroupRef.current.rotation.x += velY;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop with inertia settling
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (objectGroupRef.current) {
        if (!isDragging) {
          // Inertia decay
          objectGroupRef.current.rotation.y += velX;
          objectGroupRef.current.rotation.x += velY;
          velX *= 0.94;
          velY *= 0.94;

          if (autoRotate) {
            objectGroupRef.current.rotation.y += 0.006;
          }
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.8 : 1.25;
    cameraRef.current.position.z = Math.max(2.5, Math.min(9, cameraRef.current.position.z * factor));
  };

  const handleReset = () => {
    if (!cameraRef.current || !objectGroupRef.current) return;
    cameraRef.current.position.set(0, 0.8, 5.8);
    objectGroupRef.current.rotation.set(0, 0, 0);
  };

  if (!webGlAvailable) {
    return (
      <div className="w-full h-80 rounded-2xl overflow-hidden relative border border-white/10 bg-slate-950 flex items-center justify-center p-6">
        <img src={fallbackImage} alt={productName} className="max-h-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e111a] to-[#08090d] select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'h-96'
      }`}
    >
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          360° PRECISION CAD INSPECTOR
        </span>
      </div>

      {/* Control Tools Toolbar */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 shadow-2xl">
        <button
          onClick={() => setAutoRotate((prev) => !prev)}
          title={autoRotate ? 'Pause auto-rotation' : 'Resume auto-rotation'}
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
        </button>

        <button
          onClick={() => handleZoom('in')}
          title="Zoom in"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom('out')}
          title="Zoom out"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => setWireframe((prev) => !prev)}
          title="Toggle wireframe topology"
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            wireframe ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
        </button>

        <button
          onClick={handleReset}
          title="Reset position"
          className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          RESET
        </button>

        <button
          onClick={() => setIsFullscreen((prev) => !prev)}
          title={isFullscreen ? 'Exit fullscreen' : 'Inspect fullscreen'}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Helper cue */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-[11px] font-mono text-slate-500">
        DRAG TO ROTATE WITH INERTIA · PICK FINISH COLOR TO LIVE MORPH
      </div>
    </div>
  );
};
