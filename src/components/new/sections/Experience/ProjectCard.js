import React, { Suspense, useRef, useMemo } from "react";
import { Text, Image, Line } from "@react-three/drei";
import * as THREE from "three";
import { CARD, cardOutlinePoints } from "./journeyPath";
import { useDistanceFade, fadeProfiles } from "./useDistanceFade";

const TITLE_FONT = "/fonts/Fareno.otf";
const BODY_FONT = "/fonts/Poppins-Regular.ttf";

// Card layout (local coordinates: x centered, y from 0 (bottom) to CARD.height (top))
const PAD = 0.55;
const COLUMN_GAP = 0.5;
const MAIN_W = 6.9;
const MAIN_H = 4.5;
const TITLE_BLOCK = 1.2;
const THUMBS_PER_ROW = 4;
const THUMB_GAP = 0.15;
const THUMB_W = (MAIN_W - THUMB_GAP * (THUMBS_PER_ROW - 1)) / THUMBS_PER_ROW;
const THUMB_H = 1.0;

const LEFT_X = -CARD.width / 2 + PAD;
const RIGHT_X = LEFT_X + MAIN_W + COLUMN_GAP;
const TEXT_W = CARD.width / 2 - PAD - RIGHT_X;
const TOP_Y = CARD.height - PAD;

// Rounded rectangle background, shared by every card
const backgroundGeometry = (() => {
  const { width: W, height: H, radius: R } = CARD;
  const x = -W / 2;
  const y = 0;
  const shape = new THREE.Shape();
  shape.moveTo(x + R, y);
  shape.lineTo(x + W - R, y);
  shape.quadraticCurveTo(x + W, y, x + W, y + R);
  shape.lineTo(x + W, y + H - R);
  shape.quadraticCurveTo(x + W, y + H, x + W - R, y + H);
  shape.lineTo(x + R, y + H);
  shape.quadraticCurveTo(x, y + H, x, y + H - R);
  shape.lineTo(x, y + R);
  shape.quadraticCurveTo(x, y, x + R, y);
  return new THREE.ShapeGeometry(shape, 8);
})();

const ImageTile = ({ url, position, width, height, interactiveRef }) => {
  const isInteractive = () => interactiveRef.current > 0.6;
  return (
    <Image
      url={url}
      position={position}
      scale={[width, height]}
      transparent
      toneMapped={false}
      onClick={(e) => {
        if (!isInteractive()) return;
        e.stopPropagation();
        window.open(url, "_blank", "noopener");
      }}
      onPointerOver={(e) => {
        if (!isInteractive()) return;
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    />
  );
};

const CardContent = ({ project, interactiveRef }) => {
  const thumbs = project.images || [];
  const mainCenterY = TOP_Y - TITLE_BLOCK - MAIN_H / 2;
  const thumbsTop = TOP_Y - TITLE_BLOCK - MAIN_H - 0.25;
  // Keep long titles inside the left column
  const titleSize = Math.min(0.7, MAIN_W / (project.name.length * 0.6));

  return (
    <group position={[0, 0, -0.02]}>
      {/* Title + tagline */}
      <Text
        font={TITLE_FONT}
        fontSize={titleSize}
        anchorX="left"
        anchorY="top"
        position={[LEFT_X, TOP_Y + 0.05, 0]}
        whiteSpace="nowrap"
      >
        {project.name}
        <meshBasicMaterial color="#ffffff" transparent toneMapped={false} />
      </Text>
      <Text
        font={TITLE_FONT}
        fontSize={0.26}
        anchorX="left"
        anchorY="top"
        position={[LEFT_X, TOP_Y - 0.72, 0]}
        whiteSpace="nowrap"
        letterSpacing={0.08}
      >
        {project.tagline}
        <meshBasicMaterial color="#60a5fa" transparent toneMapped={false} />
      </Text>

      {/* Main screenshot */}
      <ImageTile
        url={project.mainImage}
        position={[LEFT_X + MAIN_W / 2, mainCenterY, 0]}
        width={MAIN_W}
        height={MAIN_H}
        interactiveRef={interactiveRef}
      />

      {/* Remaining screenshots */}
      {thumbs.map((url, i) => {
        const row = Math.floor(i / THUMBS_PER_ROW);
        const col = i % THUMBS_PER_ROW;
        const x = LEFT_X + THUMB_W / 2 + col * (THUMB_W + THUMB_GAP);
        const y = thumbsTop - THUMB_H / 2 - row * (THUMB_H + THUMB_GAP);
        return (
          <ImageTile
            key={url}
            url={url}
            position={[x, y, 0]}
            width={THUMB_W}
            height={THUMB_H}
            interactiveRef={interactiveRef}
          />
        );
      })}

      {/* Description */}
      <Text
        font={BODY_FONT}
        fontSize={0.27}
        lineHeight={1.45}
        maxWidth={TEXT_W}
        anchorX="left"
        anchorY="top"
        textAlign="left"
        position={[RIGHT_X, TOP_Y, 0]}
      >
        {project.description}
        <meshBasicMaterial color="#d1d5db" transparent toneMapped={false} />
      </Text>

      {/* Tech stack */}
      {project.tech && project.tech.length > 0 && (
        <Text
          font={TITLE_FONT}
          fontSize={0.27}
          anchorX="left"
          anchorY="bottom"
          position={[RIGHT_X, PAD + 0.1, 0]}
          maxWidth={TEXT_W}
          lineHeight={1.6}
          letterSpacing={0.05}
        >
          {project.tech.join("  -  ")}
          <meshBasicMaterial color="#38bdf8" transparent toneMapped={false} />
        </Text>
      )}
    </group>
  );
};

/**
 * A portfolio project card standing on the timeline "floor" (bottom edge at
 * y = 0) facing the camera. The journey line paints its perimeter.
 */
const ProjectCard = ({ project, z }) => {
  const groupRef = useRef();
  const opacityRef = useDistanceFade(groupRef, z, fadeProfiles.card);
  const outline = useMemo(() => cardOutlinePoints, []);

  return (
    <group ref={groupRef} position={[0, 0, z]}>
      {/* Background panel */}
      <mesh geometry={backgroundGeometry} position={[0, 0, -0.06]}>
        <meshBasicMaterial
          color="#0b1322"
          transparent
          opacity={0.88}
          toneMapped={false}
        />
      </mesh>

      {/* Faint border - the journey line paints over it */}
      <group position={[0, 0, -0.03]}>
        <Line
          points={outline}
          color="#1e3a5f"
          lineWidth={1.5}
          transparent
          opacity={0.45}
        />
      </group>

      <Suspense fallback={null}>
        <CardContent project={project} interactiveRef={opacityRef} />
      </Suspense>
    </group>
  );
};

export default ProjectCard;
