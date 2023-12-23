import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function SailShip(props) {
  const { nodes, materials } = useGLTF('/models/ship/SailShip.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[0, 2.453, -1.048]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.BackSail_1.geometry} material={materials.Wood} />
        <mesh geometry={nodes.BackSail_2.geometry} material={materials.Fabric} />
      </group>
      <group position={[0, 2.05, 1.134]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.Front_Sail_1.geometry} material={materials.Wood} />
        <mesh geometry={nodes.Front_Sail_2.geometry} material={materials.Fabric} />
      </group>
      <group position={[0, 2.486, 0.051]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.MidleSail_1.geometry} material={materials.Wood} />
        <mesh geometry={nodes.MidleSail_2.geometry} material={materials.Fabric} />
      </group>
      <group position={[-0.002, -0.071, -0.048]} rotation={[-Math.PI / 2, 0, 0]} scale={100}>
        <mesh geometry={nodes.BigShip_1.geometry} material={materials.Wood} />
        <mesh geometry={nodes.BigShip_2.geometry} material={materials.Fabric} />
        <mesh geometry={nodes.BigShip_3.geometry} material={materials.LightWood} />
        <mesh geometry={nodes.BigShip_4.geometry} material={materials.DarkWood} />
        <mesh geometry={nodes.BigShip_5.geometry} material={materials.DarkRed} />
      </group>
      <mesh geometry={nodes.Rudder.geometry} material={materials.Wood} position={[0, 1.273, -1.908]} rotation={[-Math.PI, 0, 0]} scale={[8.692, 8.692, 1.292]} />
    </group>
  );
}

useGLTF.preload('/models/ship/SailShip.glb');
