import * as THREE from "three";
import { experiences } from "./experiences";
import { projects } from "./projects";

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
export const ITEM_SPACING = 15; // z distance between experience items
export const EXPERIENCE_X = 3; // horizontal zig-zag amplitude
export const CAMERA_TRAIL = 13; // how far the camera stays behind the line tip in the experience phase
export const CAMERA_FOV = 55;

export const CARD = { width: 14, height: 9.2, radius: 0.5 };
export const CARD_VIEW_DISTANCE = 12; // camera distance in front of a card
export const CARD_GAP = 34; // z distance between consecutive cards

const STRAIGHTEN_LENGTH = 22; // after the last experience the line curves back to x=0
const APPROACH_LENGTH = 26; // straight run before the first card
const TAIL_LENGTH = 0; // optional run after the last card (0 = journey ends when the last border is complete)
const STEP = 0.15; // sampling step (world units) for straight/arc segments

// Position of an experience item on the timeline
export const experiencePosition = (i) =>
  new THREE.Vector3(
    i % 2 === 0 ? -EXPERIENCE_X : EXPERIENCE_X,
    0,
    -i * ITEM_SPACING
  );

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------
const sampleLine = (a, b, step) => {
  const pts = [];
  const n = Math.max(1, Math.ceil(a.distanceTo(b) / step));
  for (let i = 1; i <= n; i++) {
    pts.push(new THREE.Vector3().lerpVectors(a, b, i / n));
  }
  return pts;
};

/**
 * Rounded-rectangle perimeter that starts (and ends) at the bottom-center of
 * the card, travelling right -> up -> left -> down -> back to the start.
 * Coordinates are in the XY plane, bottom edge at y = 0.
 */
export const cardPerimeter = (z = 0, step = STEP) => {
  const { width: W, height: H, radius: R } = CARD;
  const hw = W / 2;
  const pts = [];
  let cursor = new THREE.Vector3(0, 0, z);

  const lineTo = (x, y) => {
    const target = new THREE.Vector3(x, y, z);
    pts.push(...sampleLine(cursor, target, step));
    cursor = target;
  };
  const arc = (cx, cy, a0, a1) => {
    const n = Math.max(6, Math.ceil((R * Math.abs(a1 - a0)) / (step * 0.5)));
    for (let i = 1; i <= n; i++) {
      const a = a0 + ((a1 - a0) * i) / n;
      cursor = new THREE.Vector3(
        cx + R * Math.cos(a),
        cy + R * Math.sin(a),
        z
      );
      pts.push(cursor);
    }
  };

  lineTo(hw - R, 0);
  arc(hw - R, R, -Math.PI / 2, 0);
  lineTo(hw, H - R);
  arc(hw - R, H - R, 0, Math.PI / 2);
  lineTo(-hw + R, H);
  arc(-hw + R, H - R, Math.PI / 2, Math.PI);
  lineTo(-hw, R);
  arc(-hw + R, R, Math.PI, Math.PI * 1.5);
  lineTo(0, 0);
  return pts;
};

// Closed outline (local card coordinates) used for the faint card border
export const cardOutlinePoints = (() => {
  const pts = cardPerimeter(0, 0.4);
  return [new THREE.Vector3(0, 0, 0), ...pts];
})();

const smoothstep = (t) => {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

// ---------------------------------------------------------------------------
// Journey: one continuous polyline through experiences and project cards,
// parameterised by arc length `s`.
// ---------------------------------------------------------------------------
function buildJourney() {
  const points = [];
  const cumulative = [];
  const phases = [];
  let length = 0;

  const push = (p) => {
    if (points.length) {
      const d = p.distanceTo(points[points.length - 1]);
      if (d < 1e-6) return; // skip duplicates
      length += d;
    }
    points.push(p);
    cumulative.push(length);
  };
  const pushMany = (arr) => arr.forEach(push);

  // --- Phase 1: zig-zag through the experiences, then straighten to x = 0
  const control = [new THREE.Vector3(0, 0, 15)];
  experiences.forEach((_, i) => control.push(experiencePosition(i)));
  const lastItem = control[control.length - 1].clone();
  control.push(
    new THREE.Vector3(lastItem.x * 0.45, 0, lastItem.z - STRAIGHTEN_LENGTH * 0.4)
  );
  control.push(new THREE.Vector3(0, 0, lastItem.z - STRAIGHTEN_LENGTH * 0.78));
  control.push(new THREE.Vector3(0, 0, lastItem.z - STRAIGHTEN_LENGTH));

  const curve = new THREE.CatmullRomCurve3(control, false, "catmullrom", 0.3);
  pushMany(curve.getSpacedPoints(Math.ceil(curve.getLength() / STEP)));
  phases.push({ type: "experience", s0: 0, s1: length });

  // arc-length position of every experience item (closest sample)
  const closestS = (target) => {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < points.length; i++) {
      const d = points[i].distanceToSquared(target);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return cumulative[best];
  };
  const experienceS = experiences.map((_, i) => closestS(experiencePosition(i)));
  const lastExperienceS = experienceS[experienceS.length - 1];
  const straightStartZ = lastItem.z - STRAIGHTEN_LENGTH;

  // --- Phase 2..n: approach + perimeter for every project card
  const cards = [];
  let cardZ = straightStartZ - APPROACH_LENGTH;
  projects.forEach((_, k) => {
    const from = points[points.length - 1];
    const approachStart = length;
    pushMany(sampleLine(from, new THREE.Vector3(0, 0, cardZ), STEP));
    phases.push({ type: "approach", s0: approachStart, s1: length, cardIndex: k });

    const entryS = length;
    pushMany(cardPerimeter(cardZ, STEP));
    phases.push({ type: "card", s0: entryS, s1: length, cardIndex: k });

    cards.push({
      index: k,
      z: cardZ,
      center: new THREE.Vector3(0, CARD.height / 2, cardZ),
      entryS,
      exitS: length,
    });
    cardZ -= CARD_GAP;
  });

  // --- Optional tail after the last card
  if (TAIL_LENGTH > 0) {
    const tailStart = length;
    const from = points[points.length - 1];
    pushMany(
      sampleLine(from, new THREE.Vector3(0, 0, from.z - TAIL_LENGTH), STEP)
    );
    phases.push({ type: "tail", s0: tailStart, s1: length });
  }

  const totalLength = length;
  const endZ = points[points.length - 1].z;

  // "PORTFOLIO" label floats above the straight run before the first card
  const portfolioLabel = {
    z: cards[0].z + 15,
    position: new THREE.Vector3(0, 6.8, cards[0].z + 15),
  };

  // ------------------------------------------------------------------
  // Queries
  // ------------------------------------------------------------------
  const clampS = (s) => THREE.MathUtils.clamp(s, 0, totalLength);

  // index i such that cumulative[i] <= s < cumulative[i + 1]
  const indexAt = (s) => {
    let lo = 0;
    let hi = cumulative.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (cumulative[mid] <= s) lo = mid;
      else hi = mid - 1;
    }
    return Math.min(lo, points.length - 2);
  };

  const pointAt = (s, out = new THREE.Vector3()) => {
    const cs = clampS(s);
    const i = indexAt(cs);
    const segLen = cumulative[i + 1] - cumulative[i];
    const t = segLen > 0 ? (cs - cumulative[i]) / segLen : 0;
    return out.lerpVectors(points[i], points[i + 1], t);
  };

  // number of fully drawn segments up to s (used for geometry.instanceCount)
  const segmentCountAt = (s) => {
    const cs = clampS(s);
    if (cs >= totalLength) return points.length - 1;
    return indexAt(cs);
  };

  const phaseAt = (s) => {
    const cs = clampS(s);
    for (let i = 0; i < phases.length; i++) {
      if (cs <= phases[i].s1) return phases[i];
    }
    return phases[phases.length - 1];
  };

  // scroll speed multiplier per phase (slower while painting a card border)
  const speedFactorAt = (s) => {
    const phase = phaseAt(s);
    switch (phase.type) {
      case "card":
        return 0.55;
      case "approach":
        return 1.25;
      default:
        return 1;
    }
  };

  // ------------------------------------------------------------------
  // Camera
  // ------------------------------------------------------------------
  const _tip = new THREE.Vector3();
  const _a = { position: new THREE.Vector3(), target: new THREE.Vector3() };
  const _b = { position: new THREE.Vector3(), target: new THREE.Vector3() };

  const viewDistanceFor = (aspect) => {
    const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV / 2);
    const needed = (CARD.width / 2 + 1.2) / (aspect * Math.tan(halfFov));
    return Math.max(CARD_VIEW_DISTANCE, needed);
  };

  // Camera trailing the line tip through the zig-zag (original behaviour)
  const maxSegmentIndex = (20 - lastItem.z) / ITEM_SPACING;
  const experiencePose = (s, pose) => {
    pointAt(s, _tip);
    const camZ = _tip.z + CAMERA_TRAIL;
    const segmentIndex = THREE.MathUtils.clamp(
      (20 - camZ) / ITEM_SPACING,
      0,
      maxSegmentIndex
    );
    const swayX = Math.sin(segmentIndex * Math.PI * 0.5) * 0.8;

    const itemIndex = Math.floor(segmentIndex);
    const within = segmentIndex - itemIndex;
    const currentSide = itemIndex % 2 === 0 ? -1 : 1;
    const nextSide = (itemIndex + 1) % 2 === 0 ? -1 : 1;
    const lookX = THREE.MathUtils.lerp(currentSide, nextSide, within) * 1.2;

    pose.position.set(swayX, 1.5, camZ);
    pose.target.set(lookX, -0.5, camZ - 15);
    return pose;
  };

  // Camera parked in front of a card, with a subtle parallax that follows the tip
  const cardPose = (k, s, aspect, pose) => {
    const card = cards[k];
    pointAt(s, _tip);
    pose.position.set(
      _tip.x * 0.06,
      card.center.y + (_tip.y - card.center.y) * 0.06,
      card.z + viewDistanceFor(aspect)
    );
    pose.target.copy(card.center);
    return pose;
  };

  const blend = (a, b, t, out) => {
    out.position.lerpVectors(a.position, b.position, t);
    out.target.lerpVectors(a.target, b.target, t);
    return out;
  };

  // While travelling between two poses the camera keeps trailing the tip in z
  // (otherwise it would rush ahead and leave the drawn line behind it)
  const travellingPose = (from, to, t, s, trailFrom, trailTo, out) => {
    blend(from, to, t, out);
    pointAt(s, _tip);
    out.position.z = _tip.z + THREE.MathUtils.lerp(trailFrom, trailTo, t);
    return out;
  };

  /**
   * Fills `out.position` / `out.target` with the desired camera pose for `s`.
   */
  const getCameraPose = (s, aspect, out) => {
    const cs = clampS(s);
    const phase = phaseAt(cs);
    const firstEntry = cards[0].entryS;
    const viewDist = viewDistanceFor(aspect);

    if (
      phase.type === "experience" ||
      (phase.type === "approach" && phase.cardIndex === 0)
    ) {
      if (cs <= lastExperienceS) return experiencePose(cs, out);
      const t = smoothstep(
        (cs - lastExperienceS) / (firstEntry - lastExperienceS)
      );
      return travellingPose(
        experiencePose(cs, _a),
        cardPose(0, cs, aspect, _b),
        t,
        cs,
        CAMERA_TRAIL,
        viewDist,
        out
      );
    }

    if (phase.type === "approach") {
      const t = smoothstep((cs - phase.s0) / (phase.s1 - phase.s0));
      return travellingPose(
        cardPose(phase.cardIndex - 1, cs, aspect, _a),
        cardPose(phase.cardIndex, cs, aspect, _b),
        t,
        cs,
        viewDist,
        viewDist,
        out
      );
    }

    if (phase.type === "card") return cardPose(phase.cardIndex, cs, aspect, out);

    // tail
    return cardPose(cards.length - 1, cs, aspect, out);
  };

  return {
    points,
    cumulative,
    phases,
    cards,
    totalLength,
    endZ,
    experienceS,
    lastExperienceS,
    portfolioLabel,
    pointAt,
    segmentCountAt,
    phaseAt,
    speedFactorAt,
    getCameraPose,
  };
}

export const journey = buildJourney();
