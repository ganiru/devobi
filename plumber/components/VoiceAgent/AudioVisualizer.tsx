// @ts-nocheck Transitional conversion: preserve the existing canvas rendering behavior.
import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ state = 'idle', color = '#2FA6FF' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      let amplitude = 6;
      let frequency = 0.04;
      let speed = 0.05;
      let bars = 36;

      if (state === 'speaking') {
        amplitude = 22;
        frequency = 0.08;
        speed = 0.12;
      } else if (state === 'listening') {
        amplitude = 15;
        frequency = 0.06;
        speed = 0.08;
      } else if (state === 'thinking') {
        amplitude = 10;
        frequency = 0.1;
        speed = 0.15;
      } else {
        amplitude = 4;
        frequency = 0.03;
        speed = 0.03;
      }

      // Background wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(47, 166, 255, 0.2)';
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * frequency + phase) * amplitude * 0.7;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Frequency bars
      const barWidth = width / bars;
      for (let i = 0; i < bars; i++) {
        const x = i * barWidth + barWidth / 2;
        const distanceFromCenter = Math.abs(i - bars / 2) / (bars / 2);
        const centerFactor = Math.cos(distanceFromCenter * Math.PI / 2);

        const dynamicH = Math.abs(
          Math.sin(i * 0.4 + phase) * amplitude * centerFactor +
          Math.cos(i * 0.2 - phase * 0.8) * (amplitude * 0.5)
        ) + 4;

        const gradient = ctx.createLinearGradient(0, centerY - dynamicH, 0, centerY + dynamicH);
        gradient.addColorStop(0, 'rgba(150, 220, 255, 0.85)');
        gradient.addColorStop(0.5, color);
        gradient.addColorStop(1, 'rgba(16, 105, 178, 0.85)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        const cornerRadius = 3;
        const topY = centerY - dynamicH;
        const totalHeight = dynamicH * 2;
        ctx.roundRect(x - 2, topY, 4, totalHeight, cornerRadius);
        ctx.fill();
      }

      phase += speed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, color]);

  return (
    <div className="audio-visualizer-wrap">
      <canvas
        ref={canvasRef}
        width={320}
        height={70}
        className="audio-canvas"
      />
    </div>
  );
}