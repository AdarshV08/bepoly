import confetti from "canvas-confetti";

export function celebrate(big = false) {
  const colors = ["#c4654a", "#e8a87c", "#87a878", "#4a6741"];
  const fire = (origin: { x: number; y: number }) =>
    confetti({
      particleCount: big ? 120 : 60,
      spread: 70,
      startVelocity: 45,
      ticks: 200,
      origin,
      colors,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  if (big) {
    fire({ x: 0.2, y: 0.6 });
    fire({ x: 0.5, y: 0.5 });
    fire({ x: 0.8, y: 0.6 });
  } else {
    fire({ x: 0.5, y: 0.6 });
  }
}
