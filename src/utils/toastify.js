import Toastify from 'toastify-js';

export function toast(message) {
  Toastify({
    node: createToastNode(message),
    duration: 3000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    close: false,
    style: {
      background: "transparent",
      borderRadius: "0px",
      padding: "0px",
      margin: "0px",
      zIndex: 9999,
    },
    className: "toastify-with-timer",
  }).showToast();
}

function createToastNode(message) {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.backgroundColor = "#e53e3e";
  container.style.color = "white";
  container.style.padding = "12px 16px";
  container.style.fontWeight = "500";
  container.style.borderRadius = "12px";
  container.style.display = "flex";
  container.style.alignItems = "center";
  container.style.gap = "8px";
  container.style.border = "none";
  container.style.outline = "none";
  container.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
  container.style.margin = "2px";

  const text = document.createElement("div");
  text.textContent = message;
  container.appendChild(text);

  return container;
}

