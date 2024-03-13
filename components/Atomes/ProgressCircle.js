// ProgressBarComponent.js
import * as React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProgressBarComponent = React.memo(({ progress }) => {
    return (
        <CircularProgressbar
            value={progress}
            styles={buildStyles({
                pathColor: `rgba(62, 152, 199, ${progress / 100})`,
                trailColor: '#d6d6d6',
                backgroundColor: '#3e98c7',
            })}
        />
    );
});

export default ProgressBarComponent;