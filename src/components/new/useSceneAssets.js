import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SCENE_MODELS = [
  "/MacbookPro132020/scene.gltf",
  "/Desktop3D/scene.gltf",
  "/LogitechKeyboard/scene.gltf",
  "/LogitechMouse/scene.gltf",
  "/Monitor/scene.gltf",
  "/Plant/scene.gltf",
  "/cup.glb",
  "/VansShoe/scene.gltf",
  "/aws.glb",
  "/docker.glb",
  "/node.glb",
  "/tailwind.glb",
  "/vue.glb",
  "/react.glb",
  "/typescript.glb",
  "/snowflake.glb",
];

const loadVideo = (src) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = src;
    const done = () => resolve();
    video.addEventListener("canplaythrough", done, { once: true });
    video.addEventListener("error", done, { once: true });
    video.load();
  });

const loadFont = (family, src) =>
  new Promise((resolve) => {
    if (typeof FontFace === "undefined") {
      resolve();
      return;
    }
    const face = new FontFace(family, `url(${src})`);
    face
      .load()
      .then((loaded) => {
        document.fonts.add(loaded);
        resolve();
      })
      .catch(() => resolve());
  });

export const useSceneAssets = () => {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let extrasWeight = 0;
    let modelsWeight = 0;
    let sawModelProgress = false;

    const report = () => {
      if (cancelled) return;
      setProgress(Math.min(1, modelsWeight * 0.85 + extrasWeight * 0.15));
    };

    const manager = THREE.DefaultLoadingManager;
    const prevProgress = manager.onProgress;
    const prevLoad = manager.onLoad;
    const prevError = manager.onError;

    let resolveModels;
    const modelsDone = new Promise((resolve) => {
      resolveModels = resolve;
    });

    manager.onProgress = (url, loaded, total) => {
      sawModelProgress = true;
      modelsWeight = total > 0 ? loaded / total : 0;
      report();
      if (prevProgress) prevProgress(url, loaded, total);
    };
    manager.onLoad = () => {
      modelsWeight = 1;
      report();
      resolveModels();
      if (prevLoad) prevLoad();
    };
    manager.onError = (url) => {
      if (prevError) prevError(url);
    };

    SCENE_MODELS.forEach((url) => useGLTF.preload(url));

    const cacheCheck = window.setTimeout(() => {
      if (!sawModelProgress) {
        modelsWeight = 1;
        report();
        resolveModels();
      }
    }, 900);

    const extras = Promise.all([
      loadVideo("/code-coding.mp4"),
      loadFont("Fareno", "/fonts/Fareno.otf"),
    ]).then(() => {
      extrasWeight = 1;
      report();
    });

    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 20000);

    Promise.all([modelsDone, extras]).then(() => {
      if (cancelled) return;
      setProgress(1);
      window.setTimeout(() => {
        if (!cancelled) setReady(true);
      }, 280);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearTimeout(cacheCheck);
      manager.onProgress = prevProgress;
      manager.onLoad = prevLoad;
      manager.onError = prevError;
    };
  }, []);

  return { progress, ready };
};
