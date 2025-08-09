import { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function Editor({ imageUrl, onExport }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    const c = new fabric.Canvas('thumb-canvas', { preserveObjectStacking: true });
    fabricRef.current = c;
    c.setWidth(1280);
    c.setHeight(720);
    c.setBackgroundColor('#222', c.renderAll.bind(c));
    return () => c.dispose();
  }, []);

  useEffect(() => {
    if (!fabricRef.current || !imageUrl) return;
    fabric.Image.fromURL(imageUrl, img => {
      const c = fabricRef.current;
      // scale image to cover canvas
      const scale = Math.max(1280 / img.width, 720 / img.height);
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: false });
      c.clear();
      c.setBackgroundImage(img, c.renderAll.bind(c));
      // add default title
      const text = new fabric.Textbox('YOUR TITLE HERE', {
        left: 48, top: 420, width: 1184, fontSize: 72, fill: '#fff', fontWeight: 'bold'
      });
      c.add(text);
      c.setActiveObject(text);
    }, { crossOrigin: 'anonymous' });
  }, [imageUrl]);

  async function exportPNG() {
    const c = fabricRef.current;
    const dataUrl = c.toDataURL({ format: 'png', multiplier: 1 });
    if (onExport) onExport(dataUrl);
  }

  return (
    <div>
      <canvas id="thumb-canvas" ref={canvasRef} />
      <div className="mt-2 space-x-2">
        <button onClick={exportPNG} className="px-3 py-2 bg-green-600 text-white rounded">Export & Upload</button>
      </div>
    </div>
  );
}
