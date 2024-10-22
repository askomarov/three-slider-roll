import "./style.css";
import Sketch from "./three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

console.log("hello js asd");

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // new Sketch("canvas");
    const sketch = new Sketch('canvas');
    window.addEventListener("load", () => {
      //
    });
  },
  true
);
