/**
 * Generate a random pastel background color and a matching dark text color.
 * @returns {string} - string of classes: "bg-[color] text-[color]"
 */
export function getRandomColor() {
  // Generate random H, S, L values for pastel background
  const hue = Math.floor(Math.random() * 360); // 0 - 359
  const saturation = Math.floor(Math.random() * 40) + 60; // 60 - 100%
  const lightness = Math.floor(Math.random() * 20) + 75; // 75 - 95% (light pastel)

  // Background color in HSL
  const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  // Text color: make it darker for readability
  const textColor = `hsl(${hue}, ${saturation}%, 25%)`;

  // Return inline style string
  return { bgColor, textColor };
}
