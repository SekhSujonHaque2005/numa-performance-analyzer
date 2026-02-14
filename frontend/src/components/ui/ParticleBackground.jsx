import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 100 }) {
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, [count]);

    useFrame((state) => {
        mesh.current.rotation.x = state.clock.getElapsedTime() * 0.05;
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#38bdf8"
                sizeAttenuation
                transparent
                opacity={0.4}
            />
        </points>
    );
}

export default function ParticleBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 1.5]}>
                <Particles count={80} />
            </Canvas>
        </div>
    );
}
