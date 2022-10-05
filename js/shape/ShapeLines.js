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

const lines = [];

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

  if (newLine.start.element.parentNode === newLine.end.element.parentNode)
    return;

  lines.push(newLine);
  updateLines();
};

const removeLine = function (line) {
  const lineIndex = lines.findIndex((el) => el === line);
  lines.splice(lineIndex, 1);

  this.remove();
};

const removeLines = function () {
  // It is used only for remove rendered on screen lines
  // which will be rerender again at moment !
  // After this should be called drawLines
  //
  // To remove permamently line, use removeLine function instead
  const lineNodes = document.querySelectorAll(".line");
  lineNodes.forEach((line) => line.remove());
};

const drawLines = function () {
  const container = document.getElementById("board");

  const linesToRemove = [];
  lines.forEach((line) => {
    const isThere = (el) => document.body.contains(el);
    if (!isThere(line.start.element) || !isThere(line.end.element)) {
      linesToRemove.push(line);
      return;
    }

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

    lineEl.dataset.direction = isReversedOrder ? "right" : "left";

    lineEl.addEventListener("click", removeLine.bind(lineEl, line));

    container.appendChild(lineEl);
  });

  linesToRemove.forEach((line) => {
    const lineIndex = lines.findIndex((el) => el === line);
    lines.splice(lineIndex, 1);
  });
};

export const updateLines = function () {
  removeLines();
  drawLines();
};
