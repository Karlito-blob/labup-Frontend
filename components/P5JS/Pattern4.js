import React, { useEffect, useRef } from 'react';

export default function Pattern2(props) {
  const canvasRef = useRef();

  useEffect(() => {
    const p5 = require('p5');

    const sketch = (p) => {
      let r;
      // Définir des valeurs fixes pour theta et phy
      const thetaFixedValue = props.theta;
      const phyFixedValue = props.phy;

      p.setup = () => {
        p.createCanvas(800, 800, p.WEBGL);
        p.angleMode(p.DEGREES);
        p.colorMode(p.HSB);
        p.stroke(0, 0, 0);
        p.strokeWeight(props.taillePoints); // Augmenter le poids du trait pour des points plus grands
        p.fill(255, 0, 0);

        r = p.width / 4;

        p.pixelDensity(2);
      };

      p.draw = () => {
        p.clear();
        p.orbitControl(4, 4);

        // Faire osciller bumpiness entre -1.5 et 1.5
        let bumpiness;

        if (props.oscillation) {
           bumpiness = props.bumpiness * p.sin(p.millis() * 0.03);
        } else {
           bumpiness = props.bumpiness; 
        }

        p.rotateX(65);
        p.beginShape(p.POINTS);
        for (let theta = 0; theta < 180; theta += 2) {
          for (let phy = 0; phy < 360; phy += 2) {
            let x = r * (1 + bumpiness * p.sin(thetaFixedValue * theta) * p.sin(phyFixedValue * phy)) * p.sin(theta) * p.cos(phy);
            let y = r * (1 + bumpiness * p.sin(thetaFixedValue * theta) * p.sin(phyFixedValue * phy)) * p.sin(theta) * p.sin(phy);
            let z = r * (1 + bumpiness * p.sin(thetaFixedValue * theta) * p.sin(phyFixedValue * phy)) * p.cos(theta);
            p.vertex(x, y, z);
          }
        }
        p.endShape();
      };
    };

    const myp5 = new p5(sketch, canvasRef.current);

    return () => {
      myp5.remove();
    };
  }, [props]);

  return <div ref={canvasRef}></div>;
}
