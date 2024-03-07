import React, { useEffect, useRef } from 'react';

export default function Pattern2(props) {

    let sphereRadius = 150; // Rayon de la sphère
    let sphereSegments = 100; // Segments de la sphère
    const canvasRef = useRef();

    useEffect(() => {
        const p5 = require('p5');

        const sketch = (p) => {

            let sphereVertices = []; // Vertices de la sphère

            p.setup = () => {
                p.createCanvas(800, 800, p.WEBGL);
                p.noFill();
                p.stroke(255);

                // Générer les vertices de la sphère
                for (let i = 0; i <= sphereSegments; i++) {
                    let lat = p.map(i, 0, sphereSegments, -p.HALF_PI, p.HALF_PI);
                    let r = sphereRadius * p.cos(lat);
                    let y = sphereRadius * p.sin(lat);
                    for (let j = 0; j <= sphereSegments; j++) {
                        let lon = p.map(j, 0, sphereSegments, -p.PI, p.PI);
                        let x = r * p.cos(lon);
                        let z = r * p.sin(lon);
                        sphereVertices.push(p.createVector(x, y, z));
                    }
                }
            };

            p.draw = () => {
                p.background(0);

                // Dessiner la sphère
                p.beginShape(p.TRIANGLE_STRIP);
                for (let i = 0; i < sphereVertices.length; i++) {
                    let v = sphereVertices[i];
                    // Calculer la distance entre le vertex et la souris
                    let d = p.dist(v.x, v.y, v.z, p.mouseX - p.width / 2, p.mouseY - p.height / 2, 0);
                    // Attirer les bords de la sphère vers la souris
                    let newX = v.x + (p.mouseX - p.width / 2 - v.x) / d * 20;
                    let newY = v.y + (p.mouseY - p.height / 2 - v.y) / d * 20;
                    p.vertex(newX, newY, v.z);
                }
                p.endShape();
            };
        };

        const myp5 = new p5(sketch);

        return () => {
            myp5.remove();
        };
    }, []);

    return (

        <div ref={canvasRef}>
        </div>

    )
};

