import { RigidBody } from "@react-three/rapier";
import * as THREE from "three"
export default function Road() {
  return (
    <RigidBody type='fixed' scale={[1, 1, 10]} friction={0} restitution={0.5} >
    <mesh receiveShadow position-y={-0.23} >
      <boxGeometry args={[90, 0.5, 30]} />
      <meshStandardMaterial side={THREE.DoubleSide} color="lightgreen" />
    </mesh>
  </RigidBody>
  );
}
