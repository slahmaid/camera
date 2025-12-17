"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  MeshTransmissionMaterial, 
  Environment, 
  Text, 
  OrbitControls, 
  PerspectiveCamera,
  ContactShadows
} from "@react-three/drei";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Sun, Cpu, Menu, X } from "lucide-react";
import * as THREE from "three";

// --- 3D COMPONENTS ---

function SolarLens() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Subtle parallax based on mouse
  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = state.mouse;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, y * 0.3, 0.1);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.3, 0.1);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 15]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={0.05}
          anisotropy={0.1}
          distortion={0.3}
          distortionScale={0.3}
          temporalDistortion={0.5}
          color="#ffffff"
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
        />
      </mesh>
      {/* Inner "Solar Core" */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#FFB300" 
          emissive="#FFB300" 
          emissiveIntensity={10} 
          toneMapped={false} 
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (!lightRef.current) return;
    const { x, y } = state.mouse;
    // Map mouse (-1 to 1) to world coordinates
    lightRef.current.position.set(x * 10, y * 10, 5);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      <Environment preset="city" />
      <ambientLight intensity={0.2} />
      <pointLight ref={lightRef} intensity={50} color="#FFB300" distance={20} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
      
      <Suspense fallback={null}>
        <SolarLens />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Suspense>
    </>
  );
}

// --- UI COMPONENTS ---

const NavItem = ({ label }: { label: string }) => (
  <motion.a
    href="#"
    whileHover={{ y: -2 }}
    className="text-white/70 hover:text-amber-400 transition-colors duration-300 text-sm font-medium"
  >
    {label}
  </motion.a>
);

const TelemetryLine = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1 border-r border-amber-500/30 pr-4">
    <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
    <span className="text-xs font-mono text-amber-500 tracking-tighter">{value}</span>
  </div>
);

export default function PrumyslHero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main dir="rtl" className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden selection:bg-amber-500/30 font-['Cairo']">
      
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0 opacity-60 md:opacity-100">
        <Canvas gl={{ antialias: true }}>
          <Scene />
        </Canvas>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-amber-500 rounded-sm flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <Sun className="text-black w-6 h-6" fill="black" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">Prumysl</span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <NavItem label="المنتجات" />
            <NavItem label="التقنية" />
            <NavItem label="عن بروميسل" />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-white text-sm"
            >
              تسجيل الدخول
            </motion.button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={30} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-44 md:pt-60 grid md:grid-cols-2 gap-12 pointer-events-none">
        <div className="flex flex-col items-start pointer-events-auto">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-500 text-[10px] font-bold tracking-[0.2em]">نظام طاقة نشط 100%</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-black text-white leading-[1.1] mb-6"
          >
            الأمان المستدام.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-400 to-amber-600">
              دقة لا تغيب عنها الشمس.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-white/50 max-w-md leading-relaxed mb-10"
          >
            مراقبة ذكية تعمل بالطاقة الشمسية. صُممت للمنشآت الصناعية والمناطق النائية حيث تتلاقى القوة مع الاستدامة.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button className="group relative px-8 py-4 bg-amber-500 text-black font-bold rounded-none overflow-hidden transition-all hover:bg-amber-400">
              <span className="relative z-10 flex items-center gap-2">
                احجز استشارتك <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
              {/* Energy Pulse Effect */}
              <div className="absolute inset-0 border-2 border-amber-300 animate-[ping_2s_infinite] opacity-20" />
            </button>

            <button className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
              عرض المواصفات
            </button>
          </motion.div>

          {/* Telemetry UI */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 flex gap-8"
          >
            <TelemetryLine label="Latency" value="12ms" />
            <TelemetryLine label="Solar Efficiency" value="98.2%" />
            <TelemetryLine label="Storage" value="72h Backup" />
          </motion.div>
        </div>
      </section>

      {/* Decorative Side Elements */}
      <div className="absolute left-10 bottom-10 z-10 hidden md:block">
        <div className="flex flex-col gap-6">
          {[Shield, Cpu, Sun].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + (i * 0.1) }}
              className="w-12 h-12 flex items-center justify-center border border-white/10 bg-white/5 text-white/40 hover:text-amber-500 hover:border-amber-500/50 transition-all cursor-help"
            >
              <Icon size={20} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Sheet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" 
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[60vh] bg-[#121212] border-t border-amber-500/30 rounded-t-[3rem] z-[70] p-12"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-10" />
              <div className="flex flex-col gap-8 text-right">
                <a href="#" className="text-3xl font-bold text-white">المنتجات</a>
                <a href="#" className="text-3xl font-bold text-white">التقنية</a>
                <a href="#" className="text-3xl font-bold text-white">عن بروميسل</a>
                <button className="mt-4 w-full py-5 bg-amber-500 text-black font-black text-xl">احجز استشارتك</button>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-8 left-8 text-white/50"
              >
                <X size={32} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        
        body {
          background-color: #0A0A0A;
          overflow-x: hidden;
        }

        ::selection {
          background: #FFB300;
          color: #000;
        }
      `}</style>
    </main>
  );
}