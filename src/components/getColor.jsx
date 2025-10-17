let lastHue = -1; // store the last hue to avoid repeats

/**
 * Generate a slightly darker pastel background and matching dark text.
 * Always tries to avoid repeating the same hue consecutively.
 * @returns {Object} - { bgColor, textColor } for inline styles
 */
export function getRandomColor() {
  let hue;
  do {
    hue = Math.floor(Math.random() * 360);
  } while (Math.abs(hue - lastHue) < 30); // ensure hue differs by at least 30 degrees
  lastHue = hue;

  const saturation = Math.floor(Math.random() * 40) + 50; // 50-90%
  let bgLightness = Math.floor(Math.random() * 15) + 85; // 85-99%
  bgLightness = Math.max(bgLightness - 10, 50); // decrease by 10%, minimum 50%

  const bgColor = `hsl(${hue}, ${saturation}%, ${bgLightness}%)`;
  const textColor = `hsl(${hue}, ${saturation}%, 20%)`;

  return { bgColor, textColor };
}
