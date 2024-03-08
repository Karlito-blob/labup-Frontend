import React, { useEffect, useRef } from 'react';

// Constellation Pattern 

export default function Pattern1(props) {


  const canvasRef = useRef();

  useEffect(() => {

    const p5 = require('p5');

    const sketch = (p) => {
      class Particle {
        constructor() {
          this.x = p.random(0, p.width);
          this.y = p.random(0, p.height);
          this.r = p.random(props.pointMin, props.pointMax); // Taille des points, minimum et maximum 
          this.xSpeed = p.random(-props.hSpeed, props.hSpeed); // Vitesse horizontale
          this.ySpeed = p.random(-props.vSpeed, props.vSpeed); // Vitesse verticale
        }

        createParticle() {
          const { r: contourR, g: contourG, b: contourB, a: contourA } = props.contourColor;
          p.stroke(`rgba(${contourR}, ${contourG}, ${contourB}, ${contourA})`); // Couleur contour de points
          const { r, g, b, a } = props.pointColor;
          p.fill(`rgba(${r}, ${g}, ${b}, ${a})`); // Couleur des points
          p.circle(this.x, this.y, this.r);
          p.circle(this.x, this.y, this.r);
        }

        moveParticle() {
          if (this.x < 0 || this.x > p.width) this.xSpeed *= -1;
          if (this.y < 0 || this.y > p.height) this.ySpeed *= -1;
          this.x += this.xSpeed;
          this.y += this.ySpeed;
        }

        joinParticles(particles) {
          particles.forEach((element) => {
            let dis = p.dist(this.x, this.y, element.x, element.y);
            if (dis < props.distance) { // distance minimum a laquelle les points doivent s'approcher
              const { r, g, b, a } = props.lineColor;
              p.stroke(`rgba(${r}, ${g}, ${b}, ${a})`); // Couleur et opacité des lignes
              p.line(this.x, this.y, element.x, element.y);
            }
          });
        }
      }

      let particles = [];

      p.setup = () => {
        p.createCanvas(800, 800); // Taille de la fenetre du canva
        p.pixelDensity(1); //Densité de  pixel
        p.frameRate(60); //Taux de rafraichissement 

        for (let i = 0; i <= p.width / props.nParticule; i++) { // nombre de particules
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        // Set background color to black
        const { r, g, b, a } = props.backColor;
        p.background(`rgba(${r}, ${g}, ${b}, ${a})`); // Background color + opacité (trainée)

        for (let i = 0; i < particles.length; i++) {
          particles[i].createParticle();
          particles[i].moveParticle();
          particles[i].joinParticles(particles.slice(i));
        }
      };
    };

    const myp5 = new p5(sketch);

    return () => {
      myp5.remove();
    };

  }, [props]);

  return (
    <div ref={canvasRef}></div>
  );
}
