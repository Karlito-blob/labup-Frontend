import React, { useEffect, useRef } from 'react';

export default function Pattern2(props) {

  const canvasRef = useRef();

  useEffect(() => {
    const p5 = require('p5');

    const sketch = (p) => {
      class Star {
        constructor() {
          this.a = p.random(1 * p.TAU);
          this.r = p.random(1000 * 0.5,  1 * 0.10); // Adjust initial sphere size
          this.loc = p.createVector(p.width / 2 + p.sin(this.a) * this.r, p.height / 2 + p.cos(this.a) * this.r);
          this.speed = p.createVector();
          this.speed = p5.Vector.random2D();
          this.bam = p.createVector();
          this.m;
        }

        update() {
          this.bam = p5.Vector.random2D();
          this.bam.mult(0.00005); //Contraction du cercle
          this.speed.add(this.bam);
          this.m = p.constrain(p.map(p.dist(this.loc.x, this.loc.y, p.mouseX, p.mouseY), 0, p.width, 8, 0.05), 0.05, props.vitesse);
          this.speed.normalize().mult(this.m);

          if (p.dist(this.loc.x, this.loc.y, p.width / 2, p.height / 2) > (p.width / 2) * 0.5) { // taille du cercle (entre 0.1 et 1)
            if (this.loc.x < p.width / 2) {
              this.loc.x = p.width - this.loc.x - 4;
            } else if (this.loc.x > p.width / 2) {
              this.loc.x = p.width - this.loc.x + 4;
            }
            if (this.loc.y < p.height / 2) {
              this.loc.y = p.height - this.loc.y - 4;
            } else if (this.loc.y > p.height / 2) {
              this.loc.y = p.height - this.loc.y + 4;
            }
          }
          this.loc = this.loc.add(this.speed);
        }

        display() {
          // Calculate color based on distance for a gradient from blue to pink
          let inter = p.map(p.dist(this.loc.x, this.loc.y, p.width / 2, p.height / 2), 0, p.width / 2, 0, 1);
          let dropColor = p.lerpColor(p.color(0, 102, 255), p.color(255, 0, 255), inter); // Couleur de la goutte
          p.fill(dropColor);
          p.ellipse(this.loc.x, this.loc.y, 10, 10); // Largeur et hauteur des points
        }

      }

      let constellation = [];
      let n;
      let d;

      p.setup = () => {
        p.createCanvas(800, 800);
        p.pixelDensity(3);
        p.frameRate(60);
        n = props.nunberOfPoints; // nombre de points

        for (let i = 0; i <= n; i++) {
          constellation.push(new Star());
        }
      };

      p.draw = () => {
        // Set background color to black
        const { r, g, b, a } = props.backColor;
        p.background(`rgba(${r}, ${g}, ${b}, ${a})`); // Background color + opacité (trainée)

        for (let i = 0; i < constellation.length; i++) {
          constellation[i].update();
          for (let j = 0; j < constellation.length; j++) {
            if (i > j) {
              d = constellation[i].loc.dist(constellation[j].loc);
              if (d <= p.width / 5) {
                // Calculate color based on distance for a gradient from blue to pink
                let inter = p.map(d, 0, p.width / 10, 0, 1);
                let lineColor = p.lerpColor(p.color(0, 102, 255), p.color(255, 0, 0), inter); // couleur de ligne
                p.stroke(lineColor);
                p.strokeWeight(props.linewWidth);
                p.line(constellation[i].loc.x, constellation[i].loc.y, constellation[j].loc.x, constellation[j].loc.y);
              }
            }
          }
          constellation[i].display();
        }
      };
    };

    const myp5 = new p5(sketch);

    return () => {
      myp5.remove();
    };
  }, [props.vitesse, props.n, props.linewWidth]);

  return (

    <div ref={canvasRef}>
    </div>


  )
};

