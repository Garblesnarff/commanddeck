
import React, { useRef, useEffect } from 'react';

const RTSDemo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || 800;
    let height = canvas.height = canvas.parentElement?.clientHeight || 400;

    const units = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      tx: width / 2,
      ty: height / 2,
      speed: 1 + Math.random() * 2,
      id: i,
      color: '#00f3ff',
      shield: Math.random() * 100
    }));

    const bug = {
      x: width / 2,
      y: height / 2,
      health: 100,
      size: 15,
      tx: Math.random() * width,
      ty: Math.random() * height
    };

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Move bug
      const bugDx = bug.tx - bug.x;
      const bugDy = bug.ty - bug.y;
      const bugDist = Math.sqrt(bugDx * bugDx + bugDy * bugDy);
      if (bugDist < 5) {
        bug.tx = Math.random() * width;
        bug.ty = Math.random() * height;
      } else {
        bug.x += (bugDx / bugDist) * 1.5;
        bug.y += (bugDy / bugDist) * 1.5;
      }

      // Draw bug
      ctx.fillStyle = '#ff003c';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff003c';
      ctx.fillRect(bug.x - 7, bug.y - 7, 14, 14);
      ctx.shadowBlur = 0;
      
      // Bug Health Bar
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bug.x - 10, bug.y - 15, 20, 3);
      ctx.fillStyle = '#ff003c';
      ctx.fillRect(bug.x - 10, bug.y - 15, 20 * (bug.health / 100), 3);

      // Units
      units.forEach(u => {
        const dx = bug.x - u.x;
        const dy = bug.y - u.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 80) {
          u.x += (dx / dist) * u.speed;
          u.y += (dy / dist) * u.speed;
        } else {
          // Circle around bug
          const angle = Math.atan2(dy, dx) + 0.02;
          u.x = bug.x - Math.cos(angle) * 80;
          u.y = bug.y - Math.sin(angle) * 80;
          
          // Fire lasers randomly
          if (Math.random() > 0.97) {
            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(u.x, u.y);
            ctx.lineTo(bug.x + (Math.random()-0.5)*10, bug.y + (Math.random()-0.5)*10);
            ctx.stroke();
            bug.health -= 1;
            if (bug.health < 0) bug.health = 100;
          }
        }

        // Draw unit
        ctx.fillStyle = u.color;
        ctx.beginPath();
        ctx.arc(u.x, u.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Unit label
        ctx.fillStyle = '#475569';
        ctx.font = '8px monospace';
        ctx.fillText(`AGENT_0${u.id}`, u.x + 5, u.y - 5);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
        width = canvas.width = canvas.parentElement?.clientWidth || 800;
        height = canvas.height = canvas.parentElement?.clientHeight || 400;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default RTSDemo;
