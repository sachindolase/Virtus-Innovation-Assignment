import React, { useRef, useState } from 'react';
import { RigidBody, useRevoluteJoint } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from "three"
import { giveOut, score } from '../../features/positionSlice';
import { useDispatch } from 'react-redux';

const Vehicle = () => {
  const bodyRef = useRef(null);
  const frontWheelRef = useRef(null);
  const backLeftWheelRef = useRef(null);
  const backRightWheelRef = useRef(null);
  const action = useDispatch()
  const [subscribeKeys, getKeys] = useKeyboardControls();
  let [forwardDir, setMoveForward] = useState(false)
  useFrame((state, delta) => {
    const { x, y } = state.mouse;


    let velocity = { x: 0, y: 0, z: 0 };
    let torque = { x: 0, y: 0, z: 0 };

    const velocityStrength = 900 * delta;
    const torqueStrength = 2;
   
    function changeDirection() {

      if (x > 0 && y > 0) {
        velocity.x = velocityStrength;
        torque.y = -torqueStrength;
      } else if (x > 0 && y < 0) {
        velocity.x = velocityStrength;
        torque.y = -torqueStrength;
      } else if (x < 0 && y < 0) {
        velocity.x = -velocityStrength;
        torque.y = torqueStrength;
      } else if (x < 0 && y > 0) {
        velocity.x = -velocityStrength;
        torque.y = torqueStrength;
      }
     
    }

    const { forward, backward } = getKeys();

    if (forward) {
      velocity.z = -velocityStrength;
      forwardDir ? changeDirection() : ""

    } else if (backward) {
      velocity.z = velocityStrength;
      forwardDir ? changeDirection() : ""
    }

    bodyRef.current?.setLinvel(velocity);
    forwardDir?bodyRef.current?.applyTorqueImpulse(torque) : ""
    frontWheelRef.current?.setLinvel(velocity);
    forwardDir?frontWheelRef.current?.applyTorqueImpulse(torque) : ""
    backLeftWheelRef.current?.setLinvel(velocity);
    forwardDir?backLeftWheelRef.current?.applyTorqueImpulse(torque) : ""
    backRightWheelRef.current?.setLinvel(velocity);
    forwardDir?backRightWheelRef.current?.applyTorqueImpulse(torque) : ""


    const bodyPosition = bodyRef.current.translation()

    const cameraposition = new THREE.Vector3()
    cameraposition.copy(bodyPosition)
    cameraposition.z += 12.25
    cameraposition.y += 9.65

    action(giveOut({ x: cameraposition.x, y: cameraposition.y, z: cameraposition.z }))



    state.customObject = { x: cameraposition.x, y: cameraposition.y, z: cameraposition.z }



  });

  useRevoluteJoint(bodyRef, frontWheelRef, [
    [0, -1, 4],
    [0, 0, 0],
    [0, 0, 1],
  ]);

  useRevoluteJoint(bodyRef, backLeftWheelRef, [
    [-2, -1, -3],
    [0, 0, 0],
    [0, 0, 1],
  ]);

  useRevoluteJoint(bodyRef, backRightWheelRef, [
    [2, -1, -3],
    [0, 0, 0],
    [0, 0, 1],
  ]);

  return (
    <>

      <RigidBody
        ref={bodyRef}
        type="kinematicVelocity"
        position={[0, 2, 0]}
        mass={10}
        onCollisionEnter={() => action(score(1))}

      >
        <mesh>
          <gridHelper position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} args={[50, 50, 0xff0000, 'teal']}
            onPointerOver={() => { setMoveForward(false) }} onPointerLeave={() => setMoveForward(true)} />
          <boxGeometry args={[4, 2, 8]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>


      <RigidBody
        ref={frontWheelRef}
        type="kinematicVelocity"
        position={[0, 1, -3]}
        colliders="trimesh"
        onCollisionEnter={() => action(score(1))}
        friction={0}
        mass={5}
      >
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>


      <RigidBody
        ref={backLeftWheelRef}
        type="kinematicVelocity"
        position={[-2, 1, 4]}
        mass={5}
        onCollisionEnter={() => action(score(1))}
        colliders="trimesh"
      >
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>


      <RigidBody ref={backRightWheelRef} type="kinematicVelocity" position={[2, 1, 4]} mass={5} colliders="trimesh" onCollisionEnter={() => action(score(1))}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Vehicle;
