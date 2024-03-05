import Pattern1 from './P5JS/Pattern1'

export default function VisualizationPattern({ modifiedParams }) {

  return (
    <main>
      <Pattern1
        pointMin={modifiedParams.TaillePoints ? modifiedParams.TaillePoints[0] : 1}
        pointMax={modifiedParams.TaillePoints ? modifiedParams.TaillePoints[1] : 10}
        pointColor={modifiedParams.CouleurPoints || { r: 255, g: 0, b: 0, a: 1 }}
        contourColor={modifiedParams.CouleurContourPoints || { r: 0, g: 0, b: 0, a: 1 }}
        lineColor={modifiedParams.CouleurLigne || { r: 0, g: 0, b: 0, a: 1 }}
        backColor={modifiedParams.CouleurBackground || { r: 255, g: 255, b: 255, a: 1 }}
        vSpeed={modifiedParams.VitesseVerticale || 1}
        hSpeed={modifiedParams.VitesseHorizontale || 1}
        nParticule={modifiedParams.NombreParticules || 5}
        distance={modifiedParams.DistanceMinPoints || 50}
      />
    </main>

  )
}
