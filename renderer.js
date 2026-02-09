const keyLog = document.getElementById("key-log");
const resetButton = document.getElementById("reset");
const keys = Array.from(document.querySelectorAll(".key"));
const keyMap = new Map(keys.map((key) => [key.dataset.code, key]));
const activeTimers = new Map();

const mediaKeyLookup = new Map([
  ["AudioVolumeUp", { code: "MediaVolumeUp", label: "Vol+" }],
  ["AudioVolumeDown", { code: "MediaVolumeDown", label: "Vol-" }],
  ["AudioVolumeMute", { code: "MediaMute", label: "Mute" }],
  ["MediaTrackNext", { code: "MediaNextTrack", label: "Next" }],
  ["MediaTrackPrevious", { code: "MediaPreviousTrack", label: "Prev" }],
  ["MediaPlayPause", { code: "MediaPlayPause", label: "Play" }],
  ["MediaRewind", { code: "MediaRewind", label: "Rew" }],
  ["MediaFastForward", { code: "MediaFastForward", label: "FF" }]
]);

const resolveMediaKey = (event) => {
  return mediaKeyLookup.get(event.code) || mediaKeyLookup.get(event.key) || null;
};

const formatKey = (event) => {
  const { key, code } = event;

  switch (code) {
    case "Space":
      return "␠";
    case "Enter":
    case "NumpadEnter":
      return "⏎";
    case "Backspace":
      return "⌫";
    case "Tab":
      return "⇥";
    case "Escape":
      return "Esc";
    case "ArrowUp":
      return "↑";
    case "ArrowDown":
      return "↓";
    case "ArrowLeft":
      return "←";
    case "ArrowRight":
      return "→";
    case "CapsLock":
      return "Caps";
    case "ContextMenu":
      return "Menu";
    default:
      if (key === "Meta") return "Win";
      if (key === "Control") return "Ctrl";
      if (key === "Shift") return "Shift";
      if (key === "Alt") return "Alt";
      return key.length === 1 ? key.toUpperCase() : key;
  }
};

const appendLog = (text) => {
  keyLog.value = `${keyLog.value}${keyLog.value ? " " : ""}${text}`;
  keyLog.scrollTop = keyLog.scrollHeight;
};

const setActive = (code, active) => {
  const keyEl = keyMap.get(code);
  if (!keyEl) return;
  keyEl.classList.toggle("active", active);
};

const flashKey = (code, duration = 160) => {
  setActive(code, true);
  if (activeTimers.has(code)) {
    clearTimeout(activeTimers.get(code));
  }
  const timer = setTimeout(() => {
    setActive(code, false);
    activeTimers.delete(code);
  }, duration);
  activeTimers.set(code, timer);
};

const handleKeyDown = (event) => {
  const media = resolveMediaKey(event);
  if (media) {
    appendLog(media.label);
    setActive(media.code, true);
    return;
  }

  if (event.repeat) {
    setActive(event.code, true);
    return;
  }

  appendLog(formatKey(event));
  setActive(event.code, true);
};

const handleKeyUp = (event) => {
  const media = resolveMediaKey(event);
  if (media) {
    setActive(media.code, false);
    return;
  }

  setActive(event.code, false);
};

resetButton.addEventListener("click", () => {
  keyLog.value = "";
});

keyLog.addEventListener("keydown", (event) => {
  event.preventDefault();
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

if (window.keyboardTester?.onMediaKey) {
  window.keyboardTester.onMediaKey(({ code, label }) => {
    appendLog(label);
    flashKey(code);
  });
}
