document.addEventListener("DOMContentLoaded", () => {
  const defaultSpeed = document.querySelector(".default-speed");
  const toggledSpeed = document.querySelector(".toggle-speed");
  const toggleKey = document.querySelector(".toggle-key");
  const skipAmount = document.querySelector(".skip-amount");
  const skipBack = document.querySelector(".skip-back");
  const skipForward = document.querySelector(".skip-forward");
  const saveButton = document.querySelector(".save-button");

  chrome.storage.local.get(["defaultSpeed", "toggleSpeed", "toggleKey", "skipAmount", "skipBack", "skipForward"], (saved) => {
    if (saved.defaultSpeed) defaultSpeed.value = saved.defaultSpeed;
    if (saved.toggleSpeed) toggledSpeed.value = saved.toggleSpeed;
    if (saved.toggleKey) toggleKey.value = saved.toggleKey;
    if (saved.skipAmount) skipAmount.value = saved.skipAmount;
    if (saved.skipBack) skipBack.value = saved.skipBack;
    if (saved.skipForward) skipForward.value = saved.skipForward;
  });
  
  saveButton.addEventListener("click", () => {
    if (skipAmount.value == skipForward.value || skipAmount.value == skipBack.value || skipForward.value == skipBack.value) {
      alert("Keys must be different!");
      return;
    }

    if (parseFloat(defaultSpeed.value) <= 0 || parseFloat(toggledSpeed.value) <= 0) {
      alert("Speeds must be positive!");
      return;
    }

    const settings = {
      defaultSpeed: parseFloat(defaultSpeed.value),
      toggleSpeed: parseFloat(toggledSpeed.value),
      toggleKey: toggleKey.value,
      skipAmount: parseFloat(skipAmount.value),
      skipBack: skipBack.value,
      skipForward: skipForward.value
    };

    chrome.storage.local.set(settings, () => {
      saveButton.textContent = "Saved!";
      setTimeout(() => saveButton.textContent = "Save Settings", 1000);
    });
  });
});

