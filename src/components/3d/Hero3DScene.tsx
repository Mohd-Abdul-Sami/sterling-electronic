import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles } from 'lucide-react';

interface Hero3DSceneProps {
  fallbackImage?: string;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ fallbackImage }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090d, 0.035);

    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0.2, 7.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x06b6d4, 4.5, 20);
    cyanRim.position.set(-6, 3, 2);
    scene.add(cyanRim);

    const violetRim = new THREE.PointLight(0xa855f7, 3.8, 20);
    violetRim.position.set(6, -2, -1);
    scene.add(violetRim);

    const underGlow = new THREE.DirectionalLight(0x0284c7, 1.2);
    underGlow.position.set(0, -5, 2);
    scene.add(underGlow);

    // Master Stage Group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Dynamic procedural OLED Screen Texture
    const createScreenTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Deep dark futuristic gradient background
      const grad = ctx.createLinearGradient(0, 0, 512, 1024);
      grad.addColorStop(0, '#040711');
      grad.addColorStop(0.3, '#070f23');
      grad.addColorStop(0.7, '#0b0c1e');
      grad.addColorStop(1, '#05070d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1024);

      // Glowing curved quantum wave
      ctx.beginPath();
      ctx.moveTo(0, 650);
      ctx.bezierCurveTo(180, 500, 320, 800, 512, 580);
      ctx.lineWidth = 14;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 32;
      ctx.stroke();

      // Secondary violet orbital wave
      ctx.beginPath();
      ctx.moveTo(0, 720);
      ctx.bezierCurveTo(220, 600, 360, 900, 512, 680);
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 28;
      ctx.stroke();

      // Sterling Horizon UI clock / widget mock
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
      ctx.fillText('09:41', 48, 140);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px system-ui, -apple-system, sans-serif';
      ctx.fillText('STERLING HORIZON OS · 5G ULTRA', 48, 180);

      // Dynamic battery / signal pill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.roundRect(48, 220, 180, 38, 19);
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.fillText('⚡ 100% QUANTUM', 66, 245);

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 4;
      return texture;
    };

    const screenTexture = createScreenTexture();

    // --- 1. FLAGSHIP SMARTPHONE ---
    const phoneGroup = new THREE.Group();
    masterGroup.add(phoneGroup);

    // Chamfered Titanium chassis (Rounded box via Extrude)
    const createRoundedRectShape = (w: number, h: number, r: number) => {
      const shape = new THREE.Shape();
      const x = -w / 2;
      const y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y);
      shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r);
      shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h);
      shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r);
      shape.quadraticCurveTo(x, y, x + r, y);
      return shape;
    };

    const phoneShape = createRoundedRectShape(2.2, 4.4, 0.35);
    const extrudeSettings = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const phoneGeo = new THREE.ExtrudeGeometry(phoneShape, extrudeSettings);
    phoneGeo.center();

    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1e28,
      metalness: 0.94,
      roughness: 0.2,
      reflectivity: 0.95,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });

    const phoneMesh = new THREE.Mesh(phoneGeo, titaniumMat);
    phoneGroup.add(phoneMesh);

    // Edge-to-edge curved OLED screen
    const screenGeo = new THREE.PlaneGeometry(2.1, 4.3);
    const screenMat = new THREE.MeshPhysicalMaterial({
      map: screenTexture,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      emissive: 0xffffff,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.45,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.z = 0.135;
    phoneGroup.add(screenMesh);

    // Rear Camera Island
    const islandShape = createRoundedRectShape(0.95, 1.5, 0.22);
    const islandGeo = new THREE.ExtrudeGeometry(islandShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    });
    islandGeo.center();

    const islandMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a0d14,
      metalness: 0.9,
      roughness: 0.25,
      clearcoat: 0.8,
    });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(-0.5, 1.2, -0.16);
    phoneGroup.add(islandMesh);

    // 3 Periscope & Photon Lenses
    const lensRingGeo = new THREE.TorusGeometry(0.18, 0.035, 16, 32);
    const lensRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.98,
      roughness: 0.1,
    });

    const lensGlassGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.04, 32);
    const lensGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.3,
      emissive: 0x0369a1,
      emissiveIntensity: 0.7,
    });

    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(lensRingGeo, lensRingMat);
      ring.position.set(-0.5, 1.55 - i * 0.45, -0.22);
      phoneGroup.add(ring);

      const glass = new THREE.Mesh(lensGlassGeo, lensGlassMat);
      glass.rotation.x = Math.PI / 2;
      glass.position.set(-0.5, 1.55 - i * 0.45, -0.21);
      phoneGroup.add(glass);
    }

    // LiDAR & Flash dots
    const sensorGeo = new THREE.CircleGeometry(0.06, 16);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const flash = new THREE.Mesh(sensorGeo, flashMat);
    flash.rotation.y = Math.PI;
    flash.position.set(-0.15, 1.45, -0.22);
    phoneGroup.add(flash);

    // --- 2. ORBITING LAPTOP ---
    const laptopGroup = new THREE.Group();
    masterGroup.add(laptopGroup);

    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.08, 1.6),
      new THREE.MeshPhysicalMaterial({ color: 0x1e2433, metalness: 0.9, roughness: 0.25 })
    );
    laptopGroup.add(laptopBase);

    const laptopLidGroup = new THREE.Group();
    laptopLidGroup.position.set(0, 0.04, -0.8);
    laptopLidGroup.rotation.x = -Math.PI / 3;

    const laptopLid = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.55, 0.06),
      new THREE.MeshPhysicalMaterial({ color: 0x1e2433, metalness: 0.9, roughness: 0.25 })
    );
    laptopLid.position.set(0, 0.775, 0);
    laptopLidGroup.add(laptopLid);

    const laptopScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.26, 1.42),
      new THREE.MeshPhysicalMaterial({
        color: 0x060810,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.35,
        roughness: 0.1,
      })
    );
    laptopScreen.position.set(0, 0.775, 0.035);
    laptopLidGroup.add(laptopScreen);

    laptopGroup.add(laptopLidGroup);
    laptopGroup.position.set(-3.2, -1.2, -0.8);
    laptopGroup.rotation.set(0.2, 0.6, -0.1);

    // --- 3. FLOATING TITANIUM WATCH ---
    const watchGroup = new THREE.Group();
    masterGroup.add(watchGroup);

    const watchBezel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.16, 48),
      new THREE.MeshPhysicalMaterial({ color: 0x334155, metalness: 0.95, roughness: 0.15 })
    );
    watchBezel.rotation.x = Math.PI / 3;
    watchGroup.add(watchBezel);

    const watchScreen = new THREE.Mesh(
      new THREE.CircleGeometry(0.58, 32),
      new THREE.MeshPhysicalMaterial({ color: 0x05070d, emissive: 0x10b981, emissiveIntensity: 0.4 })
    );
    watchScreen.rotation.x = -Math.PI / 6;
    watchScreen.position.set(0, 0.05, 0.08);
    watchGroup.add(watchScreen);

    watchGroup.position.set(3.2, -1.0, 0.4);

    // --- 4. HOLOGRAPHIC LIGHT RINGS ---
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.012, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.55 })
    );
    ring1.rotation.x = Math.PI / 2.8;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.2, 0.008, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.4 })
    );
    ring2.rotation.y = Math.PI / 3.5;
    scene.add(ring2);

    // --- 5. FLOATING DUST PARTICLES ---
    const pCount = 240;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 16;
      pPos[i + 1] = (Math.random() - 0.5) * 12;
      pPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Tracking with smooth interpolation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotY = x * 0.4;
      targetRotX = -y * 0.25;

      // Dynamic light movement
      cyanRim.position.x = -6 + x * 2;
      cyanRim.position.y = 3 + y * 2;
      violetRim.position.x = 6 - x * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Render loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth camera lerp
      masterGroup.rotation.y += (targetRotY - masterGroup.rotation.y) * 0.05;
      masterGroup.rotation.x += (targetRotX - masterGroup.rotation.x) * 0.05;

      if (isRotating) {
        phoneGroup.position.y = Math.sin(t * 1.3) * 0.15;
        phoneGroup.rotation.y = Math.sin(t * 0.7) * 0.28 - 0.15;
        phoneGroup.rotation.z = Math.cos(t * 0.9) * 0.04;

        laptopGroup.position.y = -1.2 + Math.cos(t * 1.1) * 0.08;
        laptopGroup.rotation.y = 0.6 + Math.sin(t * 0.5) * 0.1;

        watchGroup.position.y = -1.0 + Math.sin(t * 1.4) * 0.1;
        watchGroup.rotation.y = t * 0.3;

        ring1.rotation.z = t * 0.18;
        ring2.rotation.x = t * 0.14;

        particles.rotation.y = t * 0.025;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRotating]);

  if (!webGlSupported && fallbackImage) {
    return (
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        <img
          src={fallbackImage}
          alt="Sterling Tech 3D Showcase"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor="3d"
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
    >
      {/* 3D Scene HUD pill */}
      <div className="absolute top-4 right-4 z-10 pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0d14]/85 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="tracking-wide uppercase text-[11px]">3D WebGL Studio</span>
        <button
          onClick={() => setIsRotating((prev) => !prev)}
          title={isRotating ? 'Pause rotation' : 'Resume rotation'}
          className="ml-1 p-0.5 text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {isHovered && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-cyan-300 animate-fade-in flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Move cursor to interact with showroom</span>
        </div>
      )}
    </div>
  );
};
