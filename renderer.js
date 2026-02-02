const keyLog = document.getElementById("key-log");
const resetButton = document.getElementById("reset");
const keys = Array.from(document.querySelectorAll(".key"));
const keyMap = new Map(keys.map((key) => [key.dataset.code, key]));

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

const handleKeyDown = (event) => {
  if (event.repeat) {
    setActive(event.code, true);
    return;
  }

  appendLog(formatKey(event));
  setActive(event.code, true);
};

const handleKeyUp = (event) => {
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
