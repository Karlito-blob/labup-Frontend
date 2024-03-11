import gifshot from 'gifshot';
import { takeScreenshot } from './screenshotUtils';

export const createGifFromDiv = async (elementRef, setImages, totalFrames = 25, frameInterval = 40) => {
    const frames = [];

    const captureFrames = async (count = totalFrames) => {
        if (count === 0) {
            gifshot.createGIF({
                'images': frames,
                'frameDuration': 1,
                'gifWidth': 800,
                'gifHeight': 800,
            }, function (obj) {
                if (!obj.error) {
                    const image = obj.image;
                    setImages(prevImages => [...prevImages, image]);
                }
            });
            return;
        }

        const frame = await takeScreenshot(elementRef);
        frames.push(frame);

        setTimeout(() => captureFrames(count - 1), frameInterval);
    };

    captureFrames();
};
