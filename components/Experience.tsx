"use client";
import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

/* Camera spline through the 6 scenes */
const SPLINE_POINTS = [
  new THREE.Vector3(0, 0.4, 8),
  new THREE.Vector3(2, 0.6, -18),
  new THREE.Vector3(-2, -0.4, -44),
  new THREE.Vector3(1.6, 0.5, -70),
  new THREE.Vector3(-1.4, 0.2, -96),
  new THREE.Vector3(0.8, 0.4, -120),
  new THREE.Vector3(0, 0.3, -144),
];
const curve = new THREE.CatmullRomCurve3(SPLINE_POINTS);

function Rig() {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const max = document.body.scrollHeight - window.innerHeight;
    const raw = max > 0 ? window.scrollY / max : 0;
    const p = THREE.MathUtils.clamp(raw, 0, 1);
    const eased = p * p * (3 - 2 * p);
    curve.getPoint(eased, tmp);
    // gyroscopic drift from cursor
    tmp.x += pointer.x * 0.7;
    tmp.y += pointer.y * 0.45 + Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
    camera.position.lerp(tmp, 0.06);
    curve.getPoint(Math.min(eased + 0.045, 1), look);
    target.copy(look);
    camera.lookAt(target);
  });
  return null;
}

/* Custom GLSL ribbon — organic/synthetic hybrid plasma band */
function PlasmaRibbon({ position, colorA, colorB, speed = 1 }: {
  position: [number, number, number];
  colorA: string;
  colorB: string;
  speed?: number;
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uA: { value: new THREE.Color(colorA) },
          uB: { value: new THREE.Color(colorB) },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec3 p = position;
            p.y += sin(p.x * 1.4 + uTime * 0.8) * 0.45;
            p.z += cos(p.x * 0.9 + uTime * 0.6) * 0.35;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uA;
          uniform vec3 uB;
          varying vec2 vUv;
          void main() {
            float flow = sin(vUv.x * 12.0 - uTime * 1.4 + sin(vUv.y * 8.0) * 1.5) * 0.5 + 0.5;
            vec3 col = mix(uA, uB, flow);
            float edge = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
            gl_FragColor = vec4(col, edge * 0.35);
          }
        `,
      }),
    [colorA, colorB]
  );
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} position={position} rotation={[0, 0.25, 0.12]}>
      <planeGeometry args={[26, 5, 64, 8]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

function ParticleField({ count, color, size, spread }: {
  count: number; color: string; size: number; spread: [number, number, number];
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * spread[0];
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      arr[i * 3 + 2] = 12 - Math.random() * 170;
    }
    return arr;
  }, [count, spread]);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.05) * 0.08;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.3) * 0.4;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Volumetric dust motes — curl drift, pointer vortex wake,
   Beer-Lambert depth fade, quiet pocket behind type (center calm) */
function DustMotes() {
  const count =
    typeof window !== "undefined" && window.innerWidth < 640 ? 2200 : 6000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 46;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 2] = 14 - Math.random() * 176;
    }
    return arr;
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uPixelRatio: {
            value: typeof window !== "undefined" ? window.devicePixelRatio : 1,
          },
          uSize: { value: 42.0 },
          uOpacity: { value: 0.16 },
          uVortex: { value: 0.9 },
          uColorA: { value: new THREE.Color("#9FFCE4") },
          uColorB: { value: new THREE.Color("#C9B8FF") },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform vec2 uPointer;
          uniform float uPixelRatio;
          uniform float uSize;
          uniform float uVortex;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            vec3 p = position;
            float t = uTime * 0.12;
            p.x += sin(p.y * 0.35 + t * 1.7 + sin(p.z * 0.12 + t)) * 0.9;
            p.y += cos(p.z * 0.25 + t * 1.3 + sin(p.x * 0.2)) * 0.7;
            p.z += sin(p.x * 0.15 + p.y * 0.15 + t) * 1.2;
            vec2 d = p.xy - uPointer * vec2(7.0, 4.0);
            float dist = length(d) + 0.0001;
            float pull = uVortex / (dist * dist * 0.25 + 1.0);
            vec2 swirl = vec2(-d.y, d.x) / dist;
            p.xy += swirl * pull * 1.4;
            p.xy += (d / dist) * pull * 0.5 * sin(uTime * 0.9);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            float depth = max(-mv.z, 0.001);
            float fogF = exp(-depth * 0.022);
            float axis = length(p.xy - vec2(0.0, 0.3));
            float calm = smoothstep(0.6, 5.2, axis);
            vAlpha = fogF * (0.22 + 0.78 * calm);
            float ps = (uSize * uPixelRatio) * (1.0 / depth);
            gl_PointSize = clamp(ps * 10.0, 1.0, 20.0);
            float h = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
            vColor = mix(uColorA, uColorB, h);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uOpacity;
          varying float vAlpha;
          varying vec3 vColor;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float m = smoothstep(0.5, 0.05, length(uv));
            gl_FragColor = vec4(vColor, m * vAlpha * uOpacity);
          }
        `,
      }),
    []
  );
  useFrame((state) => {
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uPointer.value.set(state.pointer.x, state.pointer.y);
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <primitive object={mat} attach="material" />
    </points>
  );
}

/* Soft volumetric light shafts arcing down the corridor */
function LightShafts() {
  const group = useRef<THREE.Group>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color("#00F5C0") },
          uIntensity: { value: 0.16 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec2 vUv;
          void main() {
            float beam = smoothstep(0.0, 0.32, vUv.x) * smoothstep(1.0, 0.68, vUv.x);
            float len = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
            gl_FragColor = vec4(uColor, beam * len * uIntensity);
          }
        `,
      }),
    []
  );
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.08) * 0.06;
    }
  });
  const shafts: Array<[number, number, number, string, number]> = [
    [-4, 3, -25, "#00F5C0", 0.5],
    [4.5, 2, -55, "#7A5CFF", -0.4],
    [-3, 4, -90, "#FF5CE0", 0.35],
    [2, 3, -120, "#FFB84D", -0.3],
  ];
  return (
    <group ref={group}>
      {shafts.map(([x, y, z, c, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0.2, 0.3, r]}>
          <planeGeometry args={[9, 60]} />
          <primitive
            object={mat.clone()}
            attach="material"
            onUpdate={(m: THREE.ShaderMaterial) => m.uniforms.uColor.value.set(c)}
          />
        </mesh>
      ))}
    </group>
  );
}

const MONOLITHS = [
  { z: -20, color: "#00F5C0", scale: 1.6 },
  { z: -32, color: "#7A5CFF", scale: 2.0 },
  { z: -44, color: "#FF5CE0", scale: 1.5 },
  { z: -56, color: "#FFB84D", scale: 1.9 },
  { z: -68, color: "#3BFFB0", scale: 1.6 },
  { z: -80, color: "#00F5C0", scale: 2.1 },
];

function World() {
  return (
    <group>
      <fogExp2 attach="fog" args={["#05060A", 0.02]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 0]} intensity={30} color="#00F5C0" />
      <pointLight position={[-4, -2, -60]} intensity={40} color="#7A5CFF" />
      <pointLight position={[2, 3, -108]} intensity={50} color="#FFB84D" />

      <DustMotes />
      <LightShafts />
      <Sparkles count={120} scale={[30, 12, 150]} position={[0, 0, -70]} size={3} speed={0.25} color="#F4F2ED" opacity={0.45} />

      <PlasmaRibbon position={[0, 1.5, -30]} colorA="#00F5C0" colorB="#7A5CFF" />
      <PlasmaRibbon position={[0, -1.8, -85]} colorA="#7A5CFF" colorB="#FF5CE0" speed={0.7} />
      <PlasmaRibbon position={[0, 0.8, -130]} colorA="#FFB84D" colorB="#FF5CE0" speed={0.5} />

      {/* six service monoliths */}
      {MONOLITHS.map((m, i) => (
        <Float key={i} speed={1.4} rotationIntensity={0.35} floatIntensity={1.1}>
          <mesh position={[(i % 2 === 0 ? 3.4 : -3.4), (i % 3) - 1, m.z]} scale={m.scale}>
            <icosahedronGeometry args={[1, 3]} />
            <MeshDistortMaterial
              color={m.color}
              emissive={m.color}
              emissiveIntensity={0.55}
              roughness={0.25}
              metalness={0.65}
              distort={0.42}
              speed={2}
              transparent
              opacity={0.85}
            />
          </mesh>
        </Float>
      ))}

      {/* project gallery frames */}
      {[-88, -94, -100, -106].map((z, i) => (
        <Float key={`f${i}`} speed={1} floatIntensity={0.7}>
          <mesh position={[(i % 2 === 0 ? -2.6 : 2.6), 0.4, z]} rotation={[0, (i % 2 === 0 ? 0.35 : -0.35), 0]}>
            <boxGeometry args={[4.4, 2.6, 0.12]} />
            <meshStandardMaterial
              color="#0B0D14"
              emissive={i % 2 === 0 ? "#00F5C0" : "#FF5CE0"}
              emissiveIntensity={0.35}
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
        </Float>
      ))}

      {/* warm consultation chamber core */}
      <Float speed={0.8} floatIntensity={0.5}>
        <mesh position={[0, 0, -116]}>
          <sphereGeometry args={[2.4, 48, 48]} />
          <meshStandardMaterial
            color="#FFB84D"
            emissive="#FFB84D"
            emissiveIntensity={1.1}
            roughness={0.4}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* closing glow */}
      <mesh position={[0, 0, -146]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#7A5CFF" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

export default function Experience({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <div className="canvas-fixed" aria-hidden>
      <Canvas
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.75]}
        camera={{ fov: 55, near: 0.1, far: 420, position: [0, 0.4, 8] }}
      >
        <color attach="background" args={["#05060A"]} />
        <Suspense fallback={null}>
          <World />
          <Rig />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.85} luminanceThreshold={0.12} luminanceSmoothing={0.2} mipmapBlur radius={0.75} />
          <ChromaticAberration
            offset={new THREE.Vector2(0.00045, 0.00045)}
            radialModulation={false}
            modulationOffset={0.15}
          />
          <Noise premultiply />
          <Vignette eskil={false} offset={0.22} darkness={0.78} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
