import React, { useEffect, useRef } from 'react';

export default function Pattern2(props) {
  const canvasRef = useRef();

  useEffect(() => {

    const p5 = require('p5');

    const phases = [];
    const frequencies = [];
    const amplitudes = [];
    const numLines = props.nbLignes; // Nombre de lignes
    const maxY = props.maxY; // L'amplitude maximale de l'oscillation

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 800);
        p.pixelDensity(3); //Densité de  pixel
        p.frameRate(60); //Taux de rafraichissement 
        p.noFill();
        // Générer des propriétés aléatoires pour chaque ligne
        for (let i = 0; i < numLines; i++) {
          phases.push(p.random(0, p.TWO_PI));
          frequencies.push(p.random(0, props.frequency)); // Fréquence aléatoire pour la variation de la phase
          amplitudes.push(p.random(0, props.amplitude)); // Amplitude aléatoire
        }
      };

      p.draw = () => {
        p.background(0, props.blur); // Fond semi-transparent pour un effet de trainée
        const { r, g, b, a } = props.lineColor;
        p.stroke(`rgba(${r}, ${g}, ${b}, ${a})`);
        p.translate(0, p.height / 2); // Déplacer le point d'origine au centre du canvas

        for (let i = 0; i < numLines; i++) {
          const freq = frequencies[i];
          const amp = amplitudes[i] * maxY;
          p.beginShape();
          for (let x = 0; x < p.width; x++) {
            let angle = (x / p.width) * p.TWO_PI;
            let y = p.sin(angle * freq + phases[i]) * amp;
            p.vertex(x, y);
          }
          p.endShape();
          phases[i] += props.phase; // Fait varier la phase au fil du temps
        }
      };
    };

    let myp5 = new p5(sketch, canvasRef.current);

    return () => {
      myp5.remove();
    };
  }, [props]);

  return <div ref={canvasRef}></div>;
}
