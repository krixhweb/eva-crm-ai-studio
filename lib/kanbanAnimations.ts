
import { 
  useMotionValue, 
  useTransform, 
  useVelocity, 
  useSpring, 
  animate, 
  type MotionValue 
} from "framer-motion";

/**
 * KWin-style Wobbly Window Physics Hook
 * 
 * Simulates a soft-body object by mapping drag velocity to 
 * skew, scale, and rotation with under-damped springs.
 */
export function useKWinWobble() {
  // 1. Track Position (Framer Motion updates these automatically during drag)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 2. Real-time Velocity Tracking
  const vX = useVelocity(x);
  const vY = useVelocity(y);

  // 3. Physics Constants for "Jelly" feel
  // Low damping = more wobble/oscillation
  // Stiffness = snap back speed
  const springConfig = { 
    damping: 12, 
    stiffness: 250, 
    mass: 0.8 
  };

  // 4. Deformation Physics
  
  // Skew X: Horizontal drag causes vertical edges to shear
  // Map velocity [-1000, 1000] to skew [-15deg, 15deg]
  const skewXRaw = useTransform(vX, [-1500, 1500], [15, -15]);
  const skewX = useSpring(skewXRaw, springConfig);

  // Skew Y: Vertical drag causes horizontal edges to shear
  // Map velocity [-1000, 1000] to skew [-15deg, 15deg]
  const skewYRaw = useTransform(vY, [-1500, 1500], [15, -15]);
  const skewY = useSpring(skewYRaw, springConfig);

  // Rotation: Slight tilt in direction of movement
  const rotateRaw = useTransform(vX, [-1500, 1500], [-8, 8]);
  const rotate = useSpring(rotateRaw, springConfig);

  // Scale: "Stretch" effect based on speed
  // We use a transformer to map velocity magnitude to scale stretch
  // Note: We can't easily combine vX/vY in a single useTransform without a custom motion value updater
  // So we'll approximate stretch using just the dominant axis or map individually
  // Simple stretch: When moving fast, scale up slightly (1.1) to simulate elasticity
  const scaleRaw = useTransform(vX, (v: number) => {
    const speed = Math.abs(v);
    return 1 + Math.min(speed / 3000, 0.15); // Max stretch 1.15
  });
  const scale = useSpring(scaleRaw, { damping: 20, stiffness: 300 });

  // 5. Elevation & Shadow
  const zIndex = useMotionValue(0);
  const boxShadow = useMotionValue("0px 1px 2px rgba(0,0,0,0.1)");

  // 6. Drop Animation (Apple Bounce)
  const onDropBounce = () => {
    // Sequence: Overshoot scale -> Undershoot -> Settle
    // We use 'animate' to fire a one-off animation on the MotionValues
    
    // Reset Z-Index immediately or after small delay
    setTimeout(() => zIndex.set(0), 300);

    // Bounce Scale
    animate(scale, [1.1, 0.95, 1.02, 1.0], {
      duration: 0.5,
      ease: "easeInOut", // or custom spring
      times: [0, 0.4, 0.7, 1]
    });

    // Bounce Rotation (Reset)
    animate(rotate, 0, { 
      type: "spring", 
      stiffness: 200, 
      damping: 10 
    });

    // Reset Shadows
    animate(boxShadow, "0px 1px 2px rgba(0,0,0,0.1)", { duration: 0.3 });
  };

  const onDragStart = () => {
    zIndex.set(9999);
    // Big shadow for "lifted" effect
    animate(boxShadow, "0px 25px 50px -12px rgba(0, 0, 0, 0.35)", { duration: 0.2 });
  };

  return {
    x, y,
    skewX, skewY,
    rotate, scale,
    zIndex, boxShadow,
    onDragStart,
    onDropBounce
  };
}

// Helper to identify drop zones based on pointer coordinates
export const getColumnFromPoint = (x: number, y: number, stageIds: string[]): string | null => {
  if (typeof document === 'undefined') return null;
  const element = document.elementFromPoint(x, y);
  if (!element) return null;
  
  // Look for a parent with data-stage-id
  const columnEl = element.closest('[data-stage-id]');
  if (columnEl) {
    const stageId = columnEl.getAttribute('data-stage-id');
    if (stageId && stageIds.includes(stageId)) {
      return stageId;
    }
  }
  return null;
};
