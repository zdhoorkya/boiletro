import { useEffect, useRef, useState } from "react";

const BottleScene = () => {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const mount = mountRef.current;
    let cleanup = () => {};

    Promise.all([
      import("three"),
      import("three/examples/jsm/loaders/GLTFLoader.js")
    ]).then(([THREE, { GLTFLoader }]) => {
      let frameId = 0;
      let disposed = false;
      let bottlePivot = null;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x08111d, 6, 22);

      const camera = new THREE.PerspectiveCamera(28, mount.clientWidth / mount.clientHeight, 0.1, 100);
      camera.position.set(0, 0.8, 8.8);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.65, 2.15, 0.4, 64),
        new THREE.MeshStandardMaterial({
          color: 0x09141f,
          metalness: 0.78,
          roughness: 0.26,
          emissive: 0x0a2432,
          emissiveIntensity: 0.5
        })
      );
      pedestal.position.y = -2.55;
      group.add(pedestal);

      const baseRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.45, 0.08, 16, 100),
        new THREE.MeshStandardMaterial({ color: 0x5ef2ff, emissive: 0x2bf4ff, emissiveIntensity: 1.1 })
      );
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = -2.28;
      group.add(baseRing);

      const haloA = new THREE.Mesh(
        new THREE.TorusGeometry(2.55, 0.018, 16, 140),
        new THREE.MeshBasicMaterial({ color: 0x69e8ff, transparent: true, opacity: 0.62 })
      );
      haloA.rotation.x = Math.PI / 2.15;
      scene.add(haloA);

      const haloB = new THREE.Mesh(
        new THREE.TorusGeometry(3.25, 0.024, 16, 160),
        new THREE.MeshBasicMaterial({ color: 0xd9ff57, transparent: true, opacity: 0.32 })
      );
      haloB.rotation.x = Math.PI / 2.55;
      haloB.rotation.y = 0.34;
      scene.add(haloB);

      const floorGlow = new THREE.Mesh(
        new THREE.CircleGeometry(2.7, 64),
        new THREE.MeshBasicMaterial({ color: 0x103a52, transparent: true, opacity: 0.48 })
      );
      floorGlow.rotation.x = -Math.PI / 2;
      floorGlow.position.y = -2.62;
      scene.add(floorGlow);

      const ambient = new THREE.AmbientLight(0xb4dcff, 2);
      const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
      const rimLight = new THREE.PointLight(0xd9ff57, 22, 30, 2);
      const fillLight = new THREE.PointLight(0x4fd5ff, 18, 24, 2);

      keyLight.position.set(4, 5, 6);
      rimLight.position.set(-2.5, 0.5, 4.5);
      fillLight.position.set(2.5, -1.5, 2.5);

      scene.add(ambient, keyLight, rimLight, fillLight);

      const loader = new GLTFLoader();
      loader.load(
        "/models/water_bottle/scene.gltf",
        (gltf) => {
          if (disposed) {
            return;
          }

          const modelRoot = gltf.scene;
          bottlePivot = new THREE.Group();
          bottlePivot.add(modelRoot);
          group.add(bottlePivot);

          modelRoot.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.material.needsUpdate = true;
                if ("envMapIntensity" in child.material) {
                  child.material.envMapIntensity = 1.3;
                }
              }
            }
          });

          const initialBox = new THREE.Box3().setFromObject(modelRoot);
          const initialSize = initialBox.getSize(new THREE.Vector3());
          const maxAxis = Math.max(initialSize.x, initialSize.y, initialSize.z);
          const scale = 4.6 / maxAxis;
          modelRoot.scale.setScalar(scale);
          modelRoot.updateMatrixWorld(true);

          const centeredBox = new THREE.Box3().setFromObject(modelRoot);
          const centeredCenter = centeredBox.getCenter(new THREE.Vector3());
          modelRoot.position.x -= centeredCenter.x;
          modelRoot.position.z -= centeredCenter.z;
          modelRoot.updateMatrixWorld(true);

          const groundedBox = new THREE.Box3().setFromObject(modelRoot);
          modelRoot.position.y += -2.35 - groundedBox.min.y;
          modelRoot.rotation.y = Math.PI * 0.08;
          modelRoot.updateMatrixWorld(true);

          setStatus("ready");
        },
        undefined,
        () => {
          if (!disposed) {
            setStatus("error");
          }
        }
      );

      let pointerX = 0;
      let pointerY = 0;

      const onPointerMove = (event) => {
        const rect = mount.getBoundingClientRect();
        pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.5;
        pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 1.2;
      };

      const onPointerLeave = () => {
        pointerX = 0;
        pointerY = 0;
      };

      mount.addEventListener("pointermove", onPointerMove);
      mount.addEventListener("pointerleave", onPointerLeave);

      const clock = new THREE.Clock();

      const animate = () => {
        const t = clock.getElapsedTime();
        if (bottlePivot) {
          bottlePivot.rotation.y += 0.006;
        }
        group.rotation.y += (pointerX * 0.32 - group.rotation.y) * 0.05;
        group.rotation.x += (-pointerY * 0.2 - group.rotation.x) * 0.05;
        group.position.y = Math.sin(t * 1.2) * 0.08;
        haloA.rotation.z = t * 0.4;
        haloB.rotation.z = -t * 0.22;
        pedestal.material.emissiveIntensity = 0.45 + Math.sin(t * 1.8) * 0.1;
        baseRing.material.emissiveIntensity = 0.8 + Math.sin(t * 2.4) * 0.25;
        rimLight.intensity = 18 + Math.sin(t * 2.2) * 4;
        fillLight.intensity = 14 + Math.cos(t * 1.7) * 3;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };

      const onResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };

      window.addEventListener("resize", onResize);
      animate();

      cleanup = () => {
        disposed = true;
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", onResize);
        mount.removeEventListener("pointermove", onPointerMove);
        mount.removeEventListener("pointerleave", onPointerLeave);
        renderer.dispose();
        scene.traverse((object) => {
          if (object.isMesh) {
            object.geometry.dispose();
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        if (mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      };
    }).catch(() => {
      setStatus("error");
    });

    return () => cleanup();
  }, []);

  return (
    <div className="bottle-canvas-wrap">
      <div className="bottle-canvas" ref={mountRef} />
      {status !== "ready" ? (
        <div className="bottle-status">
          {status === "loading" ? "Loading 3D bottle..." : "3D bottle failed to load."}
        </div>
      ) : null}
    </div>
  );
};

export default BottleScene;
