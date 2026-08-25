
import React, { useRef, useEffect } from 'react';

interface LatticeVisualizerProps {
  basis?: number[][];
  witness?: number[];
  noise?: number[];
  isAnimating?: boolean;
}

const LatticeVisualizer: React.FC<LatticeVisualizerProps> = ({ 
  basis = [[20, 0], [10, 20]], 
  witness = [2, 2], 
  noise = [2, -3],
  isAnimating = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = 1.5;

      // Draw Grid (The Lattice Basis)
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      for (let i = -10; i <= 10; i++) {
        for (let j = -10; j <= 10; j++) {
          const x = centerX + (i * basis[0][0] + j * basis[1][0]) * scale;
          const y = centerY + (i * basis[0][1] + j * basis[1][1]) * scale;
          
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Witness Point (Actual Secret)
      const wx = centerX + (witness[0] * basis[0][0] + witness[1] * basis[1][0]) * scale;
      const wy = centerY + (witness[0] * basis[0][1] + witness[1] * basis[1][1]) * scale;

      // Proof Point (Shielded with Noise)
      const animNoiseX = noise[0] + (isAnimating ? Math.sin(t / 200) * 5 : 0);
      const animNoiseY = noise[1] + (isAnimating ? Math.cos(t / 200) * 5 : 0);
      
      const px = wx + animNoiseX * scale;
      const py = wy + animNoiseY * scale;

      // Draw the "Gap" (The difficult mathematical problem)
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(px, py);
      ctx.stroke();
      ctx.setLineDash([]);

      // Proof Point UI
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Shadow / Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f97316';
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isAnimating) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    animationFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrame);
  }, [basis, witness, noise, isAnimating]);

  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={200} 
      className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100"
    />
  );
};

export default LatticeVisualizer;
