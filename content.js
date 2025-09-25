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
      video.playbackRate = speed;
  });
}

// load saved settings
window.addEventListener("load", () => {
  chrome.storage.local.get(["defaultSpeed", "toggleSpeed", "toggleKey", "skipAmount", "skipBack", "skipForward"], (saved) => {
    if (saved.defaultSpeed) settings.defaultSpeed = saved.defaultSpeed;
    if (saved.toggleSpeed) settings.toggleSpeed = saved.toggleSpeed;
    if (saved.toggleKey) settings.toggleKey = saved.toggleKey;
    if (saved.skipAmount) settings.skipAmount = saved.skipAmount;
    if (saved.skipBack) settings.skipBack = saved.skipBack;
    if (saved.skipForward) settings.skipForward = saved.skipForward;
    
    // initialize video speed
    setVideoSpeed(settings.defaultSpeed);
  });
});

// update settings live if settings change from popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (changes.defaultSpeed) {
    settings.defaultSpeed = changes.defaultSpeed.newValue;

    // update speed of videos if currently in default speed
    if (!settings.toggled) {
      setVideoSpeed(settings.defaultSpeed);
    }
  }
  if (changes.toggleSpeed) {
    settings.toggleSpeed = changes.toggleSpeed.newValue;

    // update speed of videos if currently in toggled speed
    if (settings.toggled) {
      setVideoSpeed(settings.toggleSpeed);
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
    if (settings.toggled) setVideoSpeed(settings.defaultSpeed);
    else setVideoSpeed(settings.toggleSpeed);
    settings.toggled = !settings.toggled;
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


// watch for url change to apply default speed since some websites like YouTube don't reload the DOM
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;;
    const videos = document.querySelectorAll("video");
    settings.toggled = false;
    setTimeout(() => setVideoSpeed(settings.defaultSpeed), 500);
  }
}).observe(document, {subtree: true, childList: true});