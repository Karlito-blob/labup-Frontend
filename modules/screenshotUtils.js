import html2canvas from 'html2canvas';

export const takeScreenshot = async (elementRef) => {
    const canvas = await html2canvas(elementRef.current);
    return canvas.toDataURL('image/png');
};