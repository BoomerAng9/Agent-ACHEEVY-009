// frontend/components/deploy-dock/ParticleLazer.tsx
'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function ParticleLazer({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let frame = 0;

    const createParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color: Math.random() > 0.5 ? '#fbbf24' : '#ffffff', // Gold & White
      });
    };

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center Laser Beam
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw active beam
      if (frame % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = `rgba(251, 191, 36, ${0.5 + Math.random() * 0.5})`;
        ctx.lineWidth = 4 + Math.random() * 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fbbf24';
        ctx.stroke();
      }

      // Spawn particles at impact point
      if (frame % 3 === 0) {
        for (let i = 0; i < 5; i++) {
          createParticle(cx, cy);
        }
      }

      // Update and draw particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.splice(index, 1);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    // Resize handler
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen"
    />
  );
}
