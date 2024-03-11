export const randomParams = async (setModifiedParams, patternID) => {
    try {
        const response = await fetch(`http://localhost:3000/initialPatterns/${patternID}`);
        const data = await response.json();
        if (data.result) {
            const updatedParams = data.InitialPattern.params.reduce((acc, param) => {
                const { paramName, paramType, valeurMinMax } = param;
                if (paramType === 'Slider') {
                    acc[paramName] = parseFloat((Math.random() * (valeurMinMax[1] - valeurMinMax[0]) + valeurMinMax[0]).toFixed(2));
                } else if (paramType === 'DoubleSlider') {
                    const min = Math.random() * (valeurMinMax[1] - valeurMinMax[0]) + valeurMinMax[0];
                    const max = Math.random() * (valeurMinMax[1] - min) + min;
                    acc[paramName] = [min, max];
                } else if (paramType === 'Color') {
                    acc[paramName] = {
                        r: Math.floor(Math.random() * 256),
                        g: Math.floor(Math.random() * 256),
                        b: Math.floor(Math.random() * 256),
                        a: 1 // Assumant que l'opacité est toujours à 1 pour la simplification
                    };
                }
                return acc;
            }, {});

            setModifiedParams(updatedParams);
        }
    } catch (error) {
        console.error('Failed to fetch and randomize pattern parameters:', error);
    }
};

