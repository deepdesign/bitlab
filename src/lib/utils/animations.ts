/**
 * Animation Utilities
 * 
 * Helper functions for visual feedback animations
 */

/**
 * Creates a success animation on an element
 * Adds a brief scale and color flash effect
 */
export function animateSuccess(element: HTMLElement): void {
  if (!element) return;

  const originalTransition = element.style.transition;
  const originalTransform = element.style.transform;
  const originalBackground = element.style.backgroundColor;

  // Add animation classes
  element.style.transition = "transform 0.3s ease, background-color 0.3s ease";
  element.style.transform = "scale(1.1)";
  element.style.backgroundColor = "var(--accent-primary)";

  setTimeout(() => {
    element.style.transform = originalTransform || "scale(1)";
    element.style.backgroundColor = originalBackground || "";

    setTimeout(() => {
      element.style.transition = originalTransition || "";
    }, 300);
  }, 300);
}

/**
 * Creates a pulse animation on an element
 */
export function animatePulse(element: HTMLElement, duration = 600): void {
  if (!element) return;

  const originalTransition = element.style.transition;
  const originalBoxShadow = element.style.boxShadow;

  element.style.transition = `box-shadow ${duration}ms ease`;
  element.style.boxShadow = "0 0 0 0 var(--accent-primary)";

  // Trigger reflow
  void element.offsetWidth;

  element.style.boxShadow = `0 0 0 8px transparent`;

  setTimeout(() => {
    element.style.transition = originalTransition || "";
    element.style.boxShadow = originalBoxShadow || "";
  }, duration);
}

/**
 * Creates a shake animation on an element (for errors)
 */
export function animateShake(element: HTMLElement): void {
  if (!element) return;

  const originalTransition = element.style.transition;
  const originalTransform = element.style.transform;

  element.style.transition = "transform 0.1s ease";
  
  const shake = [
    "translateX(-4px)",
    "translateX(4px)",
    "translateX(-4px)",
    "translateX(4px)",
    "translateX(0)",
  ];

  shake.forEach((transform, index) => {
    setTimeout(() => {
      element.style.transform = transform;
      if (index === shake.length - 1) {
        setTimeout(() => {
          element.style.transition = originalTransition || "";
          element.style.transform = originalTransform || "";
        }, 100);
      }
    }, index * 100);
  });
}

/**
 * Creates a fade-in animation
 */
export function animateFadeIn(element: HTMLElement, duration = 300): void {
  if (!element) return;

  const originalTransition = element.style.transition;
  const originalOpacity = element.style.opacity;

  element.style.opacity = "0";
  element.style.transition = `opacity ${duration}ms ease`;

  // Trigger reflow
  void element.offsetWidth;

  element.style.opacity = originalOpacity || "1";

  setTimeout(() => {
    element.style.transition = originalTransition || "";
  }, duration);
}

