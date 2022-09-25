const currentAnchor = {
  element: null,
  getPosition() {
    return this?.element.getBoundingClientRect();
  },
  getX() {
    return this?.getPosition().x + this?.getPosition().width / 2;
  },
  getY() {
    return this?.getPosition().y + this?.getPosition().height / 2;
  },
};

let lines = [];

// Create line
export const createLine = function (anchor) {
  if (!currentAnchor.element) {
    currentAnchor.element = anchor;
    return;
  }

  const newLine = {
    start: { ...currentAnchor },
    end: { ...currentAnchor, element: anchor },
  };

  currentAnchor.element = null;

  if (newLine.start.element === newLine.end.element) return;
  if (newLine.start.element.parentNode === newLine.end.element.parentNode)
    return;

  lines.push(newLine);
  updateLines();
};

const removeLines = function () {
  const lineNodes = document.querySelectorAll(".line");
  lineNodes.forEach((line) => line.remove());
};

const drawLines = function () {
  const container = document.getElementById("board");

  lines.forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.classList.add("line");
    let isReversedOrder = false;

    if (line.start.getX() > line.end.getX()) {
      isReversedOrder = true;
    }

    const leftPos = isReversedOrder ? line.end.getX() : line.start.getX();
    const topPos =
      (isReversedOrder ? line.end.getY() : line.start.getY()) -
      container.getBoundingClientRect().y;

    const width =
      ((line.end.getX() - line.start.getX()) ** 2 +
        (line.end.getY() - line.start.getY()) ** 2) **
      0.5;
    const angleRatio = (line.end.getY() - line.start.getY()) / width;
    const angle = isReversedOrder
      ? -Math.asin(angleRatio)
      : Math.asin(angleRatio);

    lineEl.style.width = width + "px";
    lineEl.style.left = leftPos + "px";
    lineEl.style.top = topPos + "px";
    lineEl.style.rotate = angle + "rad";

    lineEl.addEventListener("click", () => {
      lineEl.remove();
      lines = lines.filter((item) => !Object.is(item, line));
    });

    container.appendChild(lineEl);
  });
};

export const updateLines = function () {
  removeLines();
  drawLines();
};
