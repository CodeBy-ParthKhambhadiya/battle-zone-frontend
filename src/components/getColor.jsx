/**
 * Generate a very light pastel background and matching dark text.
 * @returns {Object} - { bgColor, textColor } for inline styles
 */
export function getRandomColor() {
  const hue = Math.floor(Math.random() * 360); // 0-359
  const saturation = Math.floor(Math.random() * 40) + 50; // 50-90%
  
  // Background: very light pastel
  const bgLightness = Math.floor(Math.random() * 15) + 85; // 85-99% light
  const bgColor = `hsl(${hue}, ${saturation}%, ${bgLightness}%)`;

  // Text: same hue, high saturation, dark enough for contrast
  const textColor = `hsl(${hue}, ${saturation}%, 20%)`;

  return { bgColor, textColor };
}
