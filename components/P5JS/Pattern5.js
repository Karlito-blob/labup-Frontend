import React, { useEffect, useRef } from 'react';

export default function Pattern5() {
  const canvasRef = useRef();

  useEffect(() => {
    const p5 = require('p5');

    const sketch = (p) => {
      const maxPoints = 1000;
      let angle = 0; // Un angle pour commencer à dessiner le vortex
      const points = []; // On utilise un tableau pour stocker les points

      p.setup = () => {
        p.createCanvas(800, 800);
        p.background(0);
        p.noFill();
        // Initialisation des points
        for (let i = 0; i < maxPoints; i++) {
          const x = p.random(p.width);
          const y = p.random(p.height);
          points.push(p.createVector(x, y));
        }
      };

      p.draw = () => {
        p.background(0, 25); // Fond semi-transparent pour l'effet de trail
        p.stroke(255, 215, 0, 80); // Jaune doré avec transparence
        p.strokeWeight(2); // Épaisseur des points

        // Dessiner un vortex de points
        for (let i = 0; i < points.length; i++) {
          const v = points[i];
          const distance = p.dist(p.width / 2, p.height / 2, v.x, v.y);
          const vAngle = p.atan2(v.y - p.height / 2, v.x - p.width / 2);
          const radius = distance * 0.5 + p.sin(vAngle * 3 + angle) * distance * 0.05;
          const x = p.width / 2 + p.cos(vAngle + angle) * radius;
          const y = p.height / 2 + p.sin(vAngle + angle) * radius;
          p.point(x, y);

          // Graduellement les points seront absorbés par le vortex
          if (radius < 1) {
            points.splice(i, 1); // Supprimer le point lorsqu'il est très proche du centre
          }
        }

        angle += 0.01; // Augmenter l'angle pour faire tourner le vortex
      };
    };

    new p5(sketch, canvasRef.current);
  }, []);

  return <div ref={canvasRef} ></div>;
}
