import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Line } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

function Node({ position, id, active, onClick }) {
    const mesh = useRef();

    useFrame((state, delta) => {
        if (active) {
            mesh.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            mesh.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            mesh.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
        mesh.current.rotation.y += delta * 0.2;
    });

    return (
        <Sphere
            ref={mesh}
            position={position}
            args={[0.8, 32, 32]}
            onClick={onClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'default'}
        >
            <meshStandardMaterial
                color={active ? "#0ea5e9" : "#334155"}
                emissive={active ? "#0ea5e9" : "#000000"}
                emissiveIntensity={active ? 2 : 0}
                metalness={0.8}
                roughness={0.2}
            />
            <Html distanceFactor={10}>
                <div className="bg-slate-900/80 backdrop-blur px-2 py-1 rounded border border-scholar-500/30 text-xs font-mono text-scholar-200">
                    Node {id}
                </div>
            </Html>
        </Sphere>
    );
}

function Connection({ start, end, active }) {
    const points = useMemo(() => [start, end], [start, end]);

    return (
        <Line
            points={points}
            color={active ? "#38bdf8" : "#1e293b"}
            lineWidth={active ? 2 : 1}
            transparent
            opacity={active ? 0.8 : 0.2}
        />
    );
}

function TopologyScene({ nodes, activeNode }) {
    // Arrange nodes in a circle
    const positions = useMemo(() => {
        const pos = [];
        const radius = 4;
        for (let i = 0; i < nodes; i++) {
            const angle = (i / nodes) * Math.PI * 2;
            pos.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        return pos;
    }, [nodes]);

    return (
        <group rotation={[0.5, 0, 0]}>
            {positions.map((p, i) => (
                <Node
                    key={i}
                    position={p}
                    id={i}
                    active={i === activeNode}
                />
            ))}
            {positions.map((p1, i) =>
                positions.slice(i + 1).map((p2, j) => (
                    <Connection
                        key={`${i}-${i + j + 1}`}
                        start={p1}
                        end={p2}
                        active={i === activeNode || (i + j + 1) === activeNode}
                    />
                ))
            )}
        </group>
    );
}

export default function NodeTopology3D({ nodes, activeNode = 0 }) {
    return (
        <div className="h-[300px] w-full bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800/50 relative">
            <div className="absolute top-2 left-2 z-10 text-xs font-serif text-slate-500 uppercase tracking-widest pl-2 border-l-2 border-scholar-500">
                System Topology Visualization
            </div>
            <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, -10]} angle={0.3} />
                <TopologyScene nodes={nodes} activeNode={activeNode} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
}
