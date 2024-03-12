import React, { useEffect, useRef } from 'react';

export default function Pattern5() {
  const canvasRef = useRef();

  useEffect(() => {
    const p5 = require('p5');

    const sketch = (p) => {
      let points = [];
      let vortexCenter;
      const maxPoints = 1000;
      const vortexStrength = 3;

      // Fonction pour ajouter un point à une position aléatoire sur le bord du canvas
      const addPoint = () => {
        let edge = p.floor(p.random(4));
        let x, y;
        switch (edge) {
          case 0: // haut
            x = p.random(p.width);
            y = 0;
            break;
          case 1: // droite
            x = p.width;
            y = p.random(p.height);
            break;
          case 2: // bas
            x = p.random(p.width);
            y = p.height;
            break;
          case 3: // gauche
            x = 0;
            y = p.random(p.height);
            break;
        }
        points.push(p.createVector(x, y));
      };

      p.setup = () => {
        p.createCanvas(800, 800);
        vortexCenter = p.createVector(p.width / 2, p.height / 2); // Définir le centre après la création du canvas
        p.background(255);

        // Initialiser avec un certain nombre de points
        for (let i = 0; i < maxPoints / 10; i++) {
          addPoint();
        }
      };

      p.draw = () => {
        p.background(255);

        // Ajouter continuellement de nouveaux points
        if (points.length < maxPoints) {
          addPoint();
        }

        for (let i = points.length - 1; i >= 0; i--) {
          let point = points[i];
          let direction = p5.Vector.sub(vortexCenter, point);
          direction.setMag(vortexStrength);
          point.add(direction);

          // Choisir une couleur aléatoire pour chaque point
          const r = p.random(255);
          const g = p.random(255);
          const b = p.random(255);
          p.stroke(r, g, b);
          p.strokeWeight(10); // Vous pouvez ajuster la taille des points ici

          p.point(point.x, point.y);

          // Supprimer les points s'ils sont trop proches du centre
          if (p.dist(point.x, point.y, vortexCenter.x, vortexCenter.y) < 5) {
            points.splice(i, 1);
          }
        }
      };

    };

    const myp5 = new p5(sketch, canvasRef.current);

    return () => {
      myp5.remove();
    };
  }, []);

  return <div ref={canvasRef} ></div>;
}
