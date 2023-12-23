/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 public/models/islands/Island.glb 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Island(props) {
  const { nodes, materials } = useGLTF('/models/islands/Island.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Island.geometry} material={materials.Mat} />
    </group>
  )
}

useGLTF.preload('/models/islands/Island.glb')