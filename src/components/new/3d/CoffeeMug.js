import { useGLTF } from "@react-three/drei";
import { useCylinder } from "@react-three/cannon";
import { useDragConstraint } from "./helpers/Drag";

const CoffeeMug = ({ scale = [1, 1, 1], ...props }) => {
  const { nodes, materials } = useGLTF("/cup.glb");
  const [cup] = useCylinder(() => ({
    mass: 1,
    args: [0.62, 0.62, 1.2, 16],
    linearDamping: 0.95,
    angularDamping: 0.95,
    ...props,
  }));
  // const bind = useDragConstraint(cup);
  return (
    <group ref={cup} dispose={null}>
      <group rotation={[Math.PI / 2, 0, 1.5]} scale={scale}>
        <mesh
          receiveShadow
          castShadow
          material={materials.default}
          geometry={nodes["buffer-0-mesh-0"].geometry}
        />
        <mesh
          material={materials.Liquid}
          geometry={nodes["buffer-0-mesh-0_1"].geometry}
        />
      </group>
    </group>
  );
};

export default CoffeeMug;
