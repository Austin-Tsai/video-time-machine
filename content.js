// Utility to set video speed
function setVideoSpeed(speed) {
  document.querySelectorAll("video").forEach(video => {
    video.playbackRate = speed;
  });
}

// Load settings and set up listeners
chrome.storage.local.get(["defaultSpeed", "toggleSpeed", "toggleKey", "skipAmount", "skipBack", "skipForward"], (settings) => {
    const defaultSpeed = settings.defaultSpeed || 1.0;
    const toggleSpeed  = settings.toggleSpeed  || 1.5;
    const toggleKey    = settings.toggleKey || "s"; // fallback key
    const skipAmount = settings.skipAmount || 5.0;
    const skipBack    = settings.skipBack || "a"; // fallback key
    const skipForward    = settings.skipForwards || "d"; // fallback key
    
  // Apply default speed when page loads
  setVideoSpeed(defaultSpeed);

  // Toggle speed when key is pressed
  document.addEventListener("keydown", (e) => {
    if (e.key === toggleKey) {
        document.querySelectorAll("video").forEach(video => {
            if (video.playbackRate == defaultSpeed) video.playbackRate = toggleSpeed;
            else video.playbackRate = defaultSpeed;
        });
    }
    else if (e.key === skipBack) {
        document.querySelectorAll("video").forEach(video => {
            video.currentTime -= skipAmount;
        });
    }
    else if (e.key === skipForward) {
        document.querySelectorAll("video").forEach(video => {
            video.currentTime += skipAmount;
        });
    }
  });
});

// Update video speeds live if settings change from popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.defaultSpeed) {
    setVideoSpeed(parseFloat(changes.defaultSpeed.newValue));
  }
});
