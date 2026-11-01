import * as THREE from './vendor/three.module.min.js';

// Owl Know: coruja 3D montada em código (cabeça, óculos, terno e gravata).
export function createOwl(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.2, 11.5);

  // Luzes
  scene.add(new THREE.HemisphereLight(0xf4f1e8, 0x06231d, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 5, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xe3ef26, 2.4);
  rim.position.set(-5, 2, -4); scene.add(rim);
  const fill = new THREE.PointLight(0xe3ef26, 6, 12); fill.position.set(0, -2, 4); scene.add(fill);

  const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0, ...o });
  const feather = M(0xebe6dc, { roughness: 0.95 });
  const featherGrey = M(0xa9a59d, { roughness: 0.95 });
  const suit = M(0x0f4a33, { roughness: 0.85 });
  const suitDark = M(0x0a3524, { roughness: 0.85 });
  const shirt = M(0xf3f1ea, { roughness: 0.6 });
  const lime = M(0xd9e81f, { roughness: 0.35, metalness: 0.05 });
  const limeGlass = M(0xe3ef26, { roughness: 0.25, metalness: 0.1, emissive: 0x2a2d00 });
  const black = M(0x0b0c0b, { roughness: 0.2 });
  const beakMat = M(0x3b3d3c, { roughness: 0.4 });
  const browMat = M(0x2b2a28, { roughness: 0.9 });

  const owl = new THREE.Group();
  scene.add(owl);

  // ---- Corpo (terno)
  const body = new THREE.Group(); owl.add(body);
  const torso = new THREE.Mesh(new THREE.SphereGeometry(1.55, 48, 48), suit);
  torso.scale.set(1.15, 1.05, 0.85); torso.position.y = -1.85; torso.castShadow = true; body.add(torso);
  // camisa em V
  const shirtV = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.15, 3, 1), shirt);
  shirtV.rotation.set(0, 0, Math.PI); shirtV.scale.set(1, 1, 0.25);
  shirtV.position.set(0, -0.95, 1.2); body.add(shirtV);
  // lapelas
  for (const s of [-1, 1]) {
    const lap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.6, 0.12), suitDark);
    lap.position.set(0.42 * s, -1.25, 1.2); lap.rotation.set(-0.25, 0, 0.42 * s); body.add(lap);
    const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.1, 8, 24), suit);
    sleeve.position.set(1.62 * s, -2.05, 0.1); sleeve.rotation.z = 0.18 * s; sleeve.castShadow = true; body.add(sleeve);
  }
  // gravata
  const knot = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), lime);
  knot.scale.set(1.1, 0.9, 0.7); knot.position.set(0, -0.62, 1.32); body.add(knot);
  const tie = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.25, 4), lime);
  tie.rotation.set(Math.PI - 0.22, Math.PI / 4, 0); tie.scale.set(1, 1, 0.45);
  tie.position.set(0, -1.32, 1.34); body.add(tie);

  // ---- Cabeça
  const head = new THREE.Group(); head.position.y = 0.55; owl.add(head);
  const skullGeo = new THREE.SphereGeometry(1.35, 96, 96);
  const skull = new THREE.Mesh(skullGeo, feather);
  skull.scale.set(1.12, 1, 0.95); skull.castShadow = true; head.add(skull);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(1.36, 48, 24, 0, Math.PI * 2, 0, 0.9), featherGrey);
  cap.scale.set(1.12, 1, 0.95); cap.rotation.x = -0.25; head.add(cap);
  // tufos (orelhas)
  for (const s of [-1, 1]) {
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.75, 16), featherGrey);
    tuft.position.set(0.92 * s, 1.08, 0.1); tuft.rotation.set(0, 0, -0.55 * s); tuft.scale.set(1, 1, 0.55); head.add(tuft);
  }
  // disco facial
  for (const s of [-1, 1]) {
    const disc = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 40), feather);
    disc.scale.set(1, 1, 0.45); disc.position.set(0.5 * s, 0.05, 1.05); head.add(disc);
  }
  // olhos
  const eyes = [];
  const lids = [];
  for (const s of [-1, 1]) {
    const eye = new THREE.Group(); eye.position.set(0.5 * s, 0.08, 1.22); head.add(eye);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.3, 40, 40), M(0xc9d81c, { roughness: 0.15, emissive: 0x1a1f00 }));
    ball.scale.z = 0.6; eye.add(ball);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.17, 32, 32), black);
    pupil.position.z = 0.13; pupil.scale.z = 0.5; eye.add(pupil);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), M(0xffffff, { emissive: 0xffffff }));
    glint.position.set(0.07, 0.07, 0.22); eye.add(glint);
    eyes.push(eye);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.33, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), feather);
    lid.position.set(0.5 * s, 0.08, 1.2); lid.scale.set(1, 0.02, 0.7); head.add(lid);
    lids.push(lid);
    // sobrancelha séria
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.11, 0.12), browMat);
    brow.position.set(0.52 * s, 0.6, 1.25); brow.rotation.z = 0.22 * s; head.add(brow);
  }
  // óculos
  const glasses = new THREE.Group(); head.add(glasses);
  for (const s of [-1, 1]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.05, 20, 64), limeGlass);
    ring.position.set(0.52 * s, 0.08, 1.42); glasses.add(ring);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.41, 48), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0, transmission: 0.2 }));
    lens.position.set(0.52 * s, 0.08, 1.41); glasses.add(lens);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1, 12), limeGlass);
    arm.rotation.x = Math.PI / 2; arm.position.set(1.0 * s, 0.12, 0.92); arm.rotation.y = 0.35 * s; glasses.add(arm);
  }
  const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.04, 12, 24, Math.PI), limeGlass);
  bridge.position.set(0, 0.1, 1.42); glasses.add(bridge);
  // bico
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.5, 24), beakMat);
  beak.rotation.x = Math.PI + 0.5; beak.position.set(0, -0.28, 1.42); head.add(beak);

  // sombra no chão
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -3.2; scene.add(shadow);

  owl.position.y = 0.55;
  owl.scale.setScalar(0.92);

  // ---- Interação
  const state = { yaw: 0, vel: 0.004, dragging: false, lastX: 0, pointer: new THREE.Vector2(), anim: null, animT: 0, blinkAt: 2 };
  const onDown = (e) => { state.dragging = true; state.lastX = e.clientX; canvas.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const cl = v => Math.max(-1, Math.min(1, v));
    state.pointer.set(cl(((e.clientX - r.left) / r.width) * 2 - 1), cl(-(((e.clientY - r.top) / r.height) * 2 - 1)));
    if (state.dragging) { const dx = e.clientX - state.lastX; state.lastX = e.clientX; state.vel = dx * 0.006; state.yaw += dx * 0.01; }
  };
  const onUp = () => { state.dragging = false; };
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  canvas.addEventListener('dblclick', () => react('spin'));

  function react(kind) { if (kind === 'spin') { state.spinT = 0; return; } state.anim = kind; state.animT = 0; }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas); resize();

  const clock = new THREE.Clock();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (!state.dragging) {
      state.vel *= 0.95;
      const idle = reduce ? 0 : Math.sin(t * 0.35) * 0.0025;
      state.yaw += state.vel + idle;
      state.yaw += (0 - state.yaw) * 0.025; // volta para frente
    }
    owl.rotation.y = state.yaw + (state.spinOff || 0);
    owl.position.y = 0.55 + (reduce ? 0 : Math.sin(t * 1.6) * 0.06);

    // cabeça e olhos seguem o ponteiro
    head.rotation.y += ((state.pointer.x * 0.35) - head.rotation.y) * 0.08;
    head.rotation.x += ((-state.pointer.y * 0.25) - head.rotation.x) * 0.08;
    for (const e of eyes) { e.rotation.y = state.pointer.x * 0.35; e.rotation.x = -state.pointer.y * 0.3; }

    // piscar
    if (t > state.blinkAt) { state.blinkAt = t + 2.5 + Math.random() * 3; state.blinkStart = t; }
    const bl = state.blinkStart ? Math.max(0, 1 - Math.abs((t - state.blinkStart) - 0.09) / 0.09) : 0;
    for (const l of lids) l.scale.y = 0.02 + bl * 0.98;

    // giro (independente das outras reações)
    if (state.spinT !== undefined) {
      state.spinT += dt; const u = Math.min(state.spinT / 0.9, 1), e = 1 - Math.pow(1 - u, 3);
      state.spinOff = e * Math.PI * 2; owl.position.y += Math.sin(u * Math.PI) * 0.6;
      if (u >= 1) { state.spinOff = 0; state.spinT = undefined; }
    }
    // reações
    if (state.anim) {
      state.animT += dt; const k = state.animT;
      if (state.anim === 'nod') { head.rotation.x += Math.sin(k * 14) * 0.08; if (k > 0.7) state.anim = null; }
      if (state.anim === 'tilt') { head.rotation.z = Math.sin(Math.min(k, 0.9) / 0.9 * Math.PI) * 0.3; if (k > 0.9) { head.rotation.z = 0; state.anim = null; } }
      
      if (state.anim === 'glint') { limeGlass.emissive.setRGB(0.4 * Math.max(0, 1 - k), 0.45 * Math.max(0, 1 - k), 0); if (k > 1) { limeGlass.emissive.set(0x2a2d00); state.anim = null; } }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
  return { react };
}
