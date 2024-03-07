import Pattern1 from './P5JS/Pattern1'
import Pattern2 from './P5JS/Pattern2'
import Pattern3 from './P5JS/Pattern3'



export default function VisualizationPattern({ initialParams, modifiedParams, pattern }) {


  if (pattern === 'Pattern1') {
    return (
      <main>
        <Pattern1
          pointMin={modifiedParams ? modifiedParams.TaillePoints[0] : initialParams.TaillePoints[0]}
          pointMax={modifiedParams ? modifiedParams.TaillePoints[1] : initialParams.TaillePoints[1]}
          pointColor={modifiedParams?.CouleurPoints || initialParams.CouleurPoints}
          contourColor={modifiedParams?.CouleurContourPoints || initialParams.CouleurPoints}
          lineColor={modifiedParams?.CouleurLigne || initialParams.CouleurLigne}
          backColor={modifiedParams?.CouleurBackground || initialParams.CouleurBackground}
          vSpeed={modifiedParams?.VitesseVerticale || initialParams.VitesseVerticale}
          hSpeed={modifiedParams?.VitesseHorizontale || initialParams.VitesseHorizontale}
          nParticule={modifiedParams?.NombreParticules || initialParams.NombreParticules}
          distance={modifiedParams?.DistanceMinPoints || initialParams.DistanceMinPoints}
        />

      </main>
    )
  } else if (pattern === 'Pattern2') {
    return (
      <main>
        <Pattern2
          vitesse={0.2} nunberOfPoints={300} linewWidth={0.1} backColor={{ r: 255, g: 255, b: 255, a: 0.5 }}
        />

      </main>
    )

  } else if (pattern === 'Pattern3') {
    return (
      <main>
        <Pattern3 />
      </main>
    )
  }

}
