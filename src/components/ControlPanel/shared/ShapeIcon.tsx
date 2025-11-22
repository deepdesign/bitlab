import type { SpriteMode } from "@/types/generator";
import { useState, useEffect } from "react";

interface ShapeIconProps {
  shape: SpriteMode;
  size?: number;
  svgPath?: string; // Optional SVG path for custom sprite icons
}

/**
 * ShapeIcon Component
 * 
 * Renders SVG icons for different sprite shapes.
 * Used in the sprite selection buttons to provide visual previews.
 */
export function ShapeIcon({ shape, size = 24, svgPath }: ShapeIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [svgError, setSvgError] = useState(false);

  // Load SVG if svgPath is provided
  useEffect(() => {
    if (svgPath) {
      fetch(svgPath)
        .then((res) => res.text())
        .then((text) => setSvgContent(text))
        .catch(() => setSvgError(true));
    }
  }, [svgPath]);

  // If SVG path is provided and loaded, render the SVG directly
  if (svgPath && svgContent && !svgError) {
    // Parse the SVG to extract viewBox and inner content
    const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
    if (!svgMatch) {
      return null;
    }
    
    let innerContent = svgMatch[1];
    // Extract viewBox from original SVG, or use default
    const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/i);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24";
    
    // Parse viewBox to get dimensions
    const viewBoxParts = viewBox.split(/\s+/).map(v => parseFloat(v));
    const viewBoxWidth = viewBoxParts[2] || 24;
    const viewBoxHeight = viewBoxParts[3] || 24;
    
    // Remove background/frame rectangles
    // These are typically full-size rectangles positioned at (0,0) or very close to viewBox size
    // Match both self-closing and paired rect tags
    innerContent = innerContent.replace(/<rect[^>]*\/?\s*>/gi, (match) => {
      const widthMatch = match.match(/width=["']?([0-9.]+)["']?/i);
      const heightMatch = match.match(/height=["']?([0-9.]+)["']?/i);
      const xMatch = match.match(/x=["']?([0-9.-]+)["']?/i);
      const yMatch = match.match(/y=["']?([0-9.-]+)["']?/i);
      
      if (widthMatch && heightMatch) {
        const width = parseFloat(widthMatch[1]);
        const height = parseFloat(heightMatch[1]);
        const x = xMatch ? parseFloat(xMatch[1]) : 0;
        const y = yMatch ? parseFloat(yMatch[1]) : 0;
        
        // Check if this is a full-size background rectangle
        const isFullWidth = Math.abs(width - viewBoxWidth) < 0.5;
        const isFullHeight = Math.abs(height - viewBoxHeight) < 0.5;
        const isAtOrigin = Math.abs(x) < 0.5 && Math.abs(y) < 0.5;
        
        // If it's a full-size rect at origin, remove it (it's likely a frame/background)
        if (isFullWidth && isFullHeight && isAtOrigin) {
          return '';
        }
      }
      
      return match;
    });
    
    // Clean up any orphaned closing tags
    innerContent = innerContent.replace(/<\/rect>/gi, '');
    
    // Replace fill colors with currentColor for theming (white/black based on theme)
    // This makes SVG icons follow the theme like primitive icons do
    let processedContent = innerContent
      .replace(/fill="[^"]*"/g, 'fill="currentColor"')
      .replace(/fill:[^;"]+/g, 'fill:currentColor')
      .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
      .replace(/stroke:[^;"]+/g, 'stroke:currentColor');
    
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        style={{ display: "block", overflow: "visible" }}
        fill="currentColor"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    );
  }

  // Fallback to shape rendering if SVG loading failed or not provided
  if (svgPath && svgError) {
    // Show a placeholder if SVG fails to load
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "currentColor",
          opacity: 0.2,
          borderRadius: "4px",
        }}
      />
    );
  }

  const viewBox = "0 0 24 24";
  const center = 12;
  const radius = 8;

  const renderShape = () => {
    switch (shape) {
      case "circle":
        return (
          <circle cx={center} cy={center} r={radius * 1.2} fill="currentColor" />
        );

      case "square":
        return <rect x={4} y={4} width={16} height={16} fill="currentColor" />;

      case "rounded":
        return (
          <rect
            x={4}
            y={4}
            width={16}
            height={16}
            rx={3}
            ry={3}
            fill="currentColor"
          />
        );

      case "triangle":
        return (
          <polygon
            points={`${center},3 21,21 3,21`}
            fill="currentColor"
          />
        );

      case "hexagon": {
        const hexRadius = radius * 1.2; // Make hexagon bigger
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i - Math.PI / 6;
          const x = center + hexRadius * Math.cos(angle);
          const y = center + hexRadius * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        return <polygon points={points.join(" ")} fill="currentColor" />;
      }

      case "ring":
        return (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          />
        );

      case "diamond": {
        const diamondSize = 9; // Make diamond bigger
        return (
          <polygon
            points={`${center},${center - diamondSize} ${center + diamondSize},${center} ${center},${center + diamondSize} ${center - diamondSize},${center}`}
            fill="currentColor"
          />
        );
      }

      case "star": {
        const outerRadius = radius * 1.45; // Make star bigger
        const innerRadius = radius * 0.6; // Adjust inner radius proportionally
        const points = [];
        for (let i = 0; i < 10; i++) {
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        return <polygon points={points.join(" ")} fill="currentColor" />;
      }

      case "line":
        return <rect x={2} y={10} width={20} height={4} fill="currentColor" />;

      case "pentagon": {
        const points = [];
        for (let i = 0; i < 5; i += 1) {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const pentagonRadius = radius * 1.25;
          const x = center + pentagonRadius * Math.cos(angle);
          const y = center + pentagonRadius * Math.sin(angle);
          points.push(`${x},${y}`);
        }
        return <polygon points={points.join(" ")} fill="currentColor" />;
      }

      case "asterisk":
        return (
          <g stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <line
              x1={center}
              y1={center - radius}
              x2={center}
              y2={center + radius}
            />
            <line
              x1={center - radius}
              y1={center}
              x2={center + radius}
              y2={center}
            />
            <line
              x1={center - radius * 0.8}
              y1={center - radius * 0.8}
              x2={center + radius * 0.8}
              y2={center + radius * 0.8}
            />
            <line
              x1={center - radius * 0.8}
              y1={center + radius * 0.8}
              x2={center + radius * 0.8}
              y2={center - radius * 0.8}
            />
          </g>
        );

      case "cross":
        return (
          <g fill="currentColor">
            <rect x={center - 3} y={center - 10} width={6} height={20} />
            <rect x={center - 10} y={center - 3} width={20} height={6} />
          </g>
        );

      case "pixels": {
        // 3x3 grid of squares with spacing
        const gridSize = 3;
        const squareSize = 4;
        const gap = 1;
        const totalSize = gridSize * squareSize + (gridSize - 1) * gap;
        const startX = center - totalSize / 2;
        const startY = center - totalSize / 2;

        return (
          <g fill="currentColor">
            {Array.from({ length: gridSize * gridSize }, (_, i) => {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;
              const x = startX + col * (squareSize + gap);
              const y = startY + row * (squareSize + gap);
              return (
                <rect key={i} x={x} y={y} width={squareSize} height={squareSize} />
              );
            })}
          </g>
        );
      }

      default:
        return (
          <circle cx={center} cy={center} r={radius} fill="currentColor" />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      style={{ display: "block" }}
      fill="currentColor"
    >
      {renderShape()}
    </svg>
  );
}

