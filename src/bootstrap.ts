// Update loading percentage
function updateLoadingPercent(percent: number) {
  const loaderText = document.getElementById("initial-loader-text");
  if (loaderText) {
    loaderText.textContent = `loading ${Math.min(100, Math.max(0, Math.round(percent)))}%`;
  }
}

// Simulate loading progress
let progress = 0;
let progressInterval: ReturnType<typeof setInterval> | null = null;

function startProgress() {
  progressInterval = setInterval(() => {
    progress += Math.random() * 15 + 5; // Increment by 5-20%
    if (progress >= 90) {
      progress = 90; // Cap at 90% until app loads
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
    }
    updateLoadingPercent(progress);
  }, 100);
}

function stopProgress() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

// Global fallback: hide loader after maximum 5 seconds no matter what
const maxTimeout = window.setTimeout(() => {
  const loader = document.getElementById("initial-loader");
  if (loader) {
    const loaderText = document.getElementById("initial-loader-text");
    if (loaderText) {
      loaderText.textContent = "loading 100%";
    }
    loader.classList.add("initial-loader--hidden");
    setTimeout(() => {
      if (loader.parentNode) {
        loader.parentNode.removeChild(loader);
      }
    }, 400);
  }
  stopProgress();
}, 5000);

window.addEventListener("DOMContentLoaded", () => {
  updateLoadingPercent(10);
  startProgress();
  
  requestAnimationFrame(() => {
    updateLoadingPercent(30);
    
    // Import main app
    import("./main.tsx")
      .then(() => {
        stopProgress();
        updateLoadingPercent(100);
        window.clearTimeout(maxTimeout); // Clear fallback since app loaded successfully
        // Small delay before hiding loader (handled by App.tsx)
      })
      .catch((err) => {
        console.error("Failed to load main application module:", err);
        stopProgress();
        updateLoadingPercent(100);
        window.clearTimeout(maxTimeout); // Clear fallback
        // Force hide loader on error
        setTimeout(() => {
          const loader = document.getElementById("initial-loader");
          if (loader) {
            loader.classList.add("initial-loader--hidden");
            setTimeout(() => {
              if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
            }, 400);
          }
        }, 500);
      });
  });
});

