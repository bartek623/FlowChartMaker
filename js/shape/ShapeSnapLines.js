const SNAP_MARGIN = 10;

export const showSnapLines = function (shapeToSkip, shapes, container) {
  const containerOffset = container.getBoundingClientRect().top;

  shapes.forEach((shape) => {
    if (shape === shapeToSkip) return;

    const shapeDim = shape.getBoundingClientRect();
    const { left, right, top, bottom } = shapeDim;

    const createSnapLine = function (x, y) {
      const snapLineEl = document.createElement("div");
      snapLineEl.classList.add("snap-line");

      snapLineEl.style.left = x + "px";
      snapLineEl.style.top = y - containerOffset + "px";

      if (y > 0) snapLineEl.style.width = 100 + "%";
      if (x > 0) snapLineEl.style.height = 100 + "%";

      container.appendChild(snapLineEl);
    };

    createSnapLine(left, 0);
    createSnapLine(right, 0);
    createSnapLine(0, top);
    createSnapLine(0, bottom);
  });
};

export const removeSnapLines = function () {
  const snapLinesEls = document.querySelectorAll(".snap-line");
  snapLinesEls.forEach((el) => el.remove());
};

export const snapToLine = function (element, shapes, container) {
  const containerOffset = container.getBoundingClientRect().top;

  const snapLines = shapes.map((shape) => {
    if (shape === element)
      return {
        left: -SNAP_MARGIN,
        right: -SNAP_MARGIN,
        top: -SNAP_MARGIN,
        bottom: -SNAP_MARGIN,
      };
    const shapeDim = shape.getBoundingClientRect();
    const { left, right, top, bottom } = shapeDim;
    return { left, right, top, bottom };
  });

  const elementDim = element.getBoundingClientRect();

  const isCloseEnough = function (el1, el2) {
    return Math.abs(el1 - el2) < SNAP_MARGIN;
  };

  snapLines.forEach((lines) => {
    if (isCloseEnough(lines.left, elementDim.left)) {
      element.style.left = lines.left + "px";
    }
    if (isCloseEnough(lines.right, elementDim.left)) {
      element.style.left = lines.right + "px";
    }
    if (isCloseEnough(lines.left, elementDim.right)) {
      element.style.left = lines.left - elementDim.width + "px";
    }
    if (isCloseEnough(lines.top, elementDim.top)) {
      element.style.top = lines.top - containerOffset + "px";
    }
    if (isCloseEnough(lines.bottom, elementDim.top)) {
      element.style.top = lines.bottom - containerOffset + "px";
    }
    if (isCloseEnough(lines.top, elementDim.bottom)) {
      element.style.top =
        lines.top - containerOffset - elementDim.height + "px";
    }
  });
};
