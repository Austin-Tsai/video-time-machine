const settings = {
  defaultSpeed : 1.0,
  toggleSpeed : 1.5,
  toggleKey : "s",
  skipAmount : 5.0,
  skipBack : "a",
  skipForward : "d",
  toggled : false,
}

setVideoSpeed = (speed) => {
document.querySelectorAll("video").forEach(video => {
    if (video.playbackRate == settings.defaultSpeed) video.playbackRate = settings.toggleSpeed;
    else video.playbackRate = settings.defaultSpeed;
    settings.toggled = !settings.toggled;
});
}

// load saved settings
chrome.storage.local.get(["defaultSpeed", "toggleSpeed", "toggleKey", "skipAmount", "skipBack", "skipForward"], (saved) => {
  if (saved.defaultSpeed) settings.defaultSpeed = saved.defaultSpeed;
  if (saved.toggleSpeed) settings.toggleSpeed = saved.toggleSpeed;
  if (saved.toggleKey) settings.toggleKey = saved.toggleKey;
  if (saved.skipAmount) settings.skipAmount = saved.skipAmount;
  if (saved.skipBack) settings.skipBack = saved.skipBack;
  if (saved.skipForward) settings.skipForward = saved.skipForward;
  
  // initialize video speed
  setVideoSpeed(defaultSpeed);
});

// update settings live if settings change from popup
chrome.storage.onChanged.addListener((changes, area) => {
if (area === "local")
  if (changes.defaultSpeed) {
    settings.defaultSpeed = changes.defaultSpeed.newValue;

    // update speed of videos if currently in default speed
    if (!settings.toggled) {
      document.querySelectorAll("video").forEach(video => {
        video.playbackRate = settings.defaultSpeed;
      });
    }
  }
  if (changes.toggleSpeed) {
    settings.toggleSpeed = changes.toggleSpeed.newValue;

    // update speed of videos if currently in toggled speed
    if (settings.toggled) {
      document.querySelectorAll("video").forEach(video => {
        video.playbackRate = settings.toggleSpeed;
      });
    }
  }
  if (changes.toggleKey) settings.toggleKey = changes.toggleKey.newValue;
  if (changes.skipAmount) settings.skipAmount = changes.skipAmount.newValue;
  if (changes.skipBack) settings.skipBack = changes.skipBack.newValue;
  if (changes.skipForward) settings.skipForward = changes.skipForward.newValue;
});

document.addEventListener("keydown", (e) => {
  // if typing, don't mess with videos
  if (
    e.target.tagName === "INPUT" ||
    e.target.tagName === "TEXTAREA" ||
    e.target.isContentEditable
  ) {
    return;
  }

  if (e.key === settings.toggleKey) {
    setVideoSpeed();
  }
  else if (e.key === settings.skipBack) {
    document.querySelectorAll("video").forEach(video => {
      video.currentTime -= settings.skipAmount;
    });
  }
  else if (e.key === settings.skipForward) {
    document.querySelectorAll("video").forEach(video => {
      video.currentTime += settings.skipAmount;
    });
  }
});