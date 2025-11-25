import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, useConeTwistConstraint } from "@react-three/cannon";
import { createRagdoll } from "./helpers/createRagdoll";
import { useDragConstraint } from "./helpers/Drag";
import { Block } from "./helpers/Block";
import { useGLTF } from "@react-three/drei";

const { shapes, joints } = createRagdoll(5.5, Math.PI / 16, Math.PI / 16, 0);
const context = createContext();

const BodyPart = ({ config, children, render, name, ...props }) => {
  const { color, args, mass, position } = shapes[name];
  const parent = useContext(context);
  const [ref, api] = useBox(() => ({
    mass,
    args,
    position,
    linearDamping: 0.99,
    angularDamping: 0.2,
    ...props,
  }));
  useConeTwistConstraint(ref, parent, config);
  const bind = useDragConstraint(ref);

  const [isDragging, setIsDragging] = useState(false);
  const initialPosition = useRef(null);
  const initialRotation = useRef(null);
  const currentPosition = useRef([0, 0, 0]);
  const currentRotation = useRef([0, 0, 0]);

  // Subscribe to position and rotation changes
  useEffect(() => {
    const unsubscribePos = api.position.subscribe((pos) => {
      currentPosition.current = pos;
      if (initialPosition.current === null) {
        initialPosition.current = [...pos];
      }
    });
    const unsubscribeRot = api.rotation.subscribe((rot) => {
      currentRotation.current = rot;
      if (initialRotation.current === null) {
        initialRotation.current = [...rot];
      }
    });
    return () => {
      unsubscribePos();
      unsubscribeRot();
    };
  }, [api]);

  // Override drag handlers to track dragging state
  const customBind = {
    onPointerDown: (e) => {
      setIsDragging(true);
      bind.onPointerDown(e);
    },
    onPointerUp: (e) => {
      setIsDragging(false);
      bind.onPointerUp(e);
    },
  };

  // Add gentle floating forces and return-to-origin behavior
  useFrame((state) => {
    if (!ref.current || !initialPosition.current || !initialRotation.current)
      return;

    const time = state.clock.getElapsedTime();

    if (!isDragging) {
      // Return to initial position
      const returnForce = 5;
      const dx =
        (initialPosition.current[0] - currentPosition.current[0]) * returnForce;
      const dy =
        (initialPosition.current[1] - currentPosition.current[1]) * returnForce;
      const dz =
        (initialPosition.current[2] - currentPosition.current[2]) * returnForce;
      api.applyForce([dx, dy, dz], [0, 0, 0]);

      // Return to initial rotation
      const returnTorque = 5;
      const rx =
        (initialRotation.current[0] - currentRotation.current[0]) *
        returnTorque;
      const ry =
        (initialRotation.current[1] - currentRotation.current[1]) *
        returnTorque;
      const rz =
        (initialRotation.current[2] - currentRotation.current[2]) *
        returnTorque;
      api.applyTorque([rx, ry, rz]);
    }

    // Add gentle floating forces
    const floatForceY = Math.sin(time * 0.5 + position[0]) * 3;
    const floatForceX = Math.cos(time * 0.3 + position[1]) * 2;
    const floatForceZ = Math.sin(time * 0.4 + position[2]) * 1.5;

    api.applyForce([floatForceX, floatForceY, floatForceZ], [0, 0, 0]);
  });

  return (
    <context.Provider value={ref}>
      <Block
        castShadow
        receiveShadow
        ref={ref}
        {...props}
        {...customBind}
        scale={args}
        name={name}
        color={color}
      >
        {render}
      </Block>
      {children}
    </context.Provider>
  );
};

const VansShoe = () => {
  const { scene } = useGLTF("/VansShoe/scene.gltf");
  const shoe = useMemo(() => scene.clone(true), [scene]);

  return (
    <group position={[1.5, -1, 0]} rotation={[0, -2.5, 0]}>
      <primitive object={shoe} scale={[0.4, 0.15, 0.4]} />
    </group>
  );
};

useGLTF.preload("/VansShoe/scene.gltf");

function Hair() {
  return (
    <group>
      <mesh position={[-0.35, 1, -0.2]} rotation={[0.2, 0, -0.1]}>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[0.35, 1, -0.2]} rotation={[0.2, 0, 0.1]}>
        <coneGeometry args={[0.15, 2, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[0, 1, -0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.25, 1, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[-0.35, 1, 0.2]} rotation={[0.2, 0, -0.1]}>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[0.35, 1, 0.2]} rotation={[0.2, 0, 0.1]}>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[0, 1, 0.2]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.25, 1.8, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[-0.35, 0.7, 0.5]} rotation={[0.2, 0, -0.1]}>
        <coneGeometry args={[0.15, 0.5, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[0.35, 1, 0.5]} rotation={[0.2, 0, 0.1]}>
        <coneGeometry args={[0.15, 1, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <mesh position={[0, 1, 0.5]} rotation={[0.3, 0, 0]}>
        <coneGeometry args={[0.25, 1.5, 8]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
    </group>
  );
}

function Face() {
  const mouth = useRef();
  const eyes = useRef();
  useFrame((state) => {
    eyes.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    mouth.current.scale.y = (1 + Math.sin(state.clock.elapsedTime * 2)) * 0.6;
  });

  return (
    <>
      <Hair />

      <group ref={eyes}>
        <Block
          position={[-0.3, 0.1, 0.5]}
          args={[0.2, 0.1, 0.1]}
          color="black"
          transparent
          opacity={0.8}
        />
        <Block
          position={[0.3, 0.1, 0.5]}
          args={[0.2, 0.1, 0.1]}
          color="black"
          transparent
          opacity={0.8}
        />
      </group>
      <Block
        ref={mouth}
        position={[0, -0.2, 0.5]}
        args={[0.3, 0.05, 0.1]}
        color="#700000"
        transparent
        opacity={0.8}
      />
    </>
  );
}

export function Guy(props) {
  return (
    <BodyPart name="upperBody" {...props}>
      <BodyPart
        {...props}
        name="head"
        config={joints["neckJoint"]}
        render={
          <>
            <Face />
          </>
        }
      />
      <BodyPart {...props} name="upperLeftArm" config={joints["leftShoulder"]}>
        <BodyPart
          {...props}
          name="lowerLeftArm"
          config={joints["leftElbowJoint"]}
        />
      </BodyPart>
      <BodyPart
        {...props}
        name="upperRightArm"
        config={joints["rightShoulder"]}
      >
        <BodyPart
          {...props}
          name="lowerRightArm"
          config={joints["rightElbowJoint"]}
        />
      </BodyPart>
      <BodyPart {...props} name="pelvis" config={joints["spineJoint"]}>
        <BodyPart
          {...props}
          name="upperLeftLeg"
          config={joints["leftHipJoint"]}
        >
          <BodyPart
            {...props}
            name="lowerLeftLeg"
            config={joints["leftKneeJoint"]}
            render={<VansShoe />}
          />
        </BodyPart>
        <BodyPart
          {...props}
          name="upperRightLeg"
          config={joints["rightHipJoint"]}
        >
          <BodyPart
            {...props}
            name="lowerRightLeg"
            config={joints["rightKneeJoint"]}
            render={<VansShoe />}
          />
        </BodyPart>
      </BodyPart>
    </BodyPart>
  );
}
