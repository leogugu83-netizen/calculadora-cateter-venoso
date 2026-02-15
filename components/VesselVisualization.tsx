import React, { useMemo } from 'react';

interface VesselVisualizationProps {
  catheterDiameterMm: number;
  vesselDiameterMm: number;
  riskLevel: 'low' | 'moderate' | 'high';
}

const VesselVisualization: React.FC<VesselVisualizationProps> = ({
  catheterDiameterMm,
  vesselDiameterMm,
  riskLevel
}) => {
  // Determine SVG scaling
  // We want the vessel to stay a relatively fixed size on screen, 
  // and the catheter to scale relative to it.
  const svgSize = 300;
  const center = svgSize / 2;
  const vesselRadius = 100; // Fixed visual radius for the vessel outer wall
  
  // Calculate catheter visual radius relative to the fixed vessel radius
  // Ratio = CatheterActual / VesselActual
  const ratio = vesselDiameterMm > 0 ? catheterDiameterMm / vesselDiameterMm : 0;
  
  // Clamp the catheter size to not exceed the vessel visually (logic handling only)
  // We subtract a little padding to represent wall thickness of the vessel
  const vesselLumenRadius = vesselRadius - 10; 
  let catheterRadius = vesselLumenRadius * ratio;

  // Cap visualization so it doesn't explode out of the circle if input is crazy
  if (catheterRadius > vesselLumenRadius) catheterRadius = vesselLumenRadius;

  // Generate some random blood cells
  const bloodCells = useMemo(() => {
    const cells = [];
    const cellCount = 12;
    for (let i = 0; i < cellCount; i++) {
      // Random angle
      const angle = (i / cellCount) * Math.PI * 2 + Math.random() * 0.5;
      // Random distance from center (but outside catheter and inside wall)
      // We want them in the "free space"
      const minDist = catheterRadius + 8;
      const maxDist = vesselLumenRadius - 8;
      
      if (maxDist > minDist) {
        const dist = Math.random() * (maxDist - minDist) + minDist;
        const x = center + Math.cos(angle) * dist;
        const y = center + Math.sin(angle) * dist;
        cells.push({ x, y, r: 4 + Math.random() * 3, rot: Math.random() * 360 });
      }
    }
    return cells;
  }, [catheterRadius, vesselLumenRadius, center]);

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high': return '#ef4444'; // Red-500
      case 'moderate': return '#eab308'; // Yellow-500
      case 'low': return '#22c55e'; // Green-500
      default: return '#3b82f6';
    }
  };

  return (
    <div className="relative flex justify-center items-center py-6">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="drop-shadow-xl">
        <defs>
          {/* Gradients to make it look organic/3D like the reference image */}
          <radialGradient id="vesselWallGradient" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          
          <radialGradient id="lumenGradient" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#7f1d1d" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#450a0a" stopOpacity="0.8" />
          </radialGradient>

          <linearGradient id="catheterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <filter id="glow">
             <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
             <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* 1. Vessel Outer Body (Pseudo-3D extension) */}
        <path 
          d={`M ${center - vesselRadius} ${center} 
              Q ${center} ${center - 40} ${center + vesselRadius} ${center}
              L ${center + vesselRadius} ${center + 60}
              Q ${center} ${center + 20} ${center - vesselRadius} ${center + 60}
              Z`} 
          fill="#b91c1c"
        />

        {/* 2. Vessel Cross Section (The Cut) */}
        <circle cx={center} cy={center} r={vesselRadius} fill="url(#vesselWallGradient)" stroke="#7f1d1d" strokeWidth="2" />
        
        {/* 3. Lumen (Dark hole) */}
        <circle cx={center} cy={center} r={vesselLumenRadius} fill="#450a0a" />

        {/* 4. Blood (Fluid background inside) */}
        <circle cx={center} cy={center} r={vesselLumenRadius} fill="url(#lumenGradient)" />

        {/* 5. The Catheter */}
        {catheterRadius > 0 && (
          <g filter="url(#glow)">
            {/* Catheter Tube (Inner) */}
            <circle 
              cx={center} 
              cy={center} 
              r={catheterRadius} 
              fill="url(#catheterGradient)" 
              stroke="#64748b" 
              strokeWidth="1"
            />
            {/* Catheter Lumen (Hole inside catheter) */}
            <circle 
              cx={center} 
              cy={center} 
              r={catheterRadius * 0.6} 
              fill="#1e293b" 
              opacity="0.8"
            />
          </g>
        )}

        {/* 6. Blood Cells (Decorative) */}
        {bloodCells.map((cell, idx) => (
           <ellipse 
             key={idx}
             cx={cell.x} 
             cy={cell.y} 
             rx={cell.r} 
             ry={cell.r * 0.8}
             fill="#dc2626"
             opacity="0.9"
             transform={`rotate(${cell.rot} ${cell.x} ${cell.y})`}
           />
        ))}

        {/* 7. Indicator Line (Optional) */}
        {catheterRadius > 0 && (
            <line 
                x1={center} 
                y1={center - catheterRadius} 
                x2={center} 
                y2={center - vesselLumenRadius} 
                stroke={getRiskColor()} 
                strokeWidth="2" 
                strokeDasharray="4 2"
            />
        )}
      </svg>
      
      {/* Percentage Label Overlay */}
      <div className="absolute bottom-0 right-0 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-slate-600">
        Visão Transversal
      </div>
    </div>
  );
};

export default VesselVisualization;
