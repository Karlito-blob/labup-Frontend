import Pattern1 from './P5JS/Pattern1'
import Pattern2 from './P5JS/Pattern2'
import Pattern3 from './P5JS/Pattern3'
import Pattern4 from './P5JS/Pattern4'
import Pattern5 from './P5JS/Pattern5'

export default function VisualizationPattern({ initialParams, modifiedParams, pattern }) {

  if (pattern === 'Pattern1') {
    return (
      <main>
        <Pattern1
          pointMin={modifiedParams ? modifiedParams.TaillePoints[0] : initialParams.TaillePoints[0]}
          pointMax={modifiedParams ? modifiedParams.TaillePoints[1] : initialParams.TaillePoints[1]}
          pointColor={modifiedParams?.CouleurPoints || initialParams.CouleurPoints}
          contourColor={modifiedParams?.CouleurContourPoints || initialParams.CouleurContourPoints}
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
          nbLignes={modifiedParams?.nbLignes || initialParams.nbLignes}
          maxY={modifiedParams?.maxY || initialParams.maxY}
          frequency={modifiedParams?.frequency || initialParams.frequency}
          amplitude={modifiedParams?.amplitude || initialParams.amplitude}
          lineColor={modifiedParams?.lineColor || initialParams.lineColor}
          phase={modifiedParams?.phase || initialParams.phase}
          blur={modifiedParams?.blur || initialParams.blur} />
      </main>
    )

  } else if (pattern === 'Pattern3') {
    return (
      <main>
        <Pattern3 />
      </main>
    )
  } else if (pattern === 'Pattern4') {
    return (
      <main>
        <Pattern4
          oscillation={modifiedParams?.PlayPause || initialParams.PlayPause}
          bumpiness={modifiedParams?.Bumpiness || initialParams.Bumpiness}
          theta={modifiedParams?.Theta || initialParams.Theta}
          phy={modifiedParams?.Phy || initialParams.Phy}
          taillePoints={modifiedParams?.taillePoints || initialParams.taillePoints}
        />
      </main>
    )
  } else if (pattern === 'Pattern5') {
    return (
      <main>
        <Pattern5 />
      </main>
    )
  }  

}
