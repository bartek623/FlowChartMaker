import { createShape } from "./shape.js";

const main = document.querySelector("main");
const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const addRectBtn = document.querySelector(".add-rect");
const addCircBtn = document.querySelector(".add-circ");

// Canvas setup
// Canvas is basically supposed to do lines and arrows between elements
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

//Add shape
addRectBtn.addEventListener("click", () => {
  createShape("rectangle", main);
});
addCircBtn.addEventListener("click", () => {
  createShape("circle", main);
});
