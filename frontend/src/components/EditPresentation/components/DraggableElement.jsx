import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box } from '@mui/material';

export default function DraggableElement ({ key, element, handlePositionUpgrade, containerRef }) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: element.xPosition || 50, y: element.yPosition || 50 });
  const dragItem = useRef(null);
  const dragItemPosition = useRef({ x: 0, y: 0 })
  const commonStyles = {
    position: 'absolute',
    top: `${position.y}` + '%',
    left: `${position.x}` + '%',
    transform: 'translate(-50%, -50%)',
    width: `${element.width}%`,
    height: `${element.height}%`,
  };

  useEffect(() => {
    setPosition({ x: element.x || 50, y: element.y || 50 });
  }, [element]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragItem.current = e.target;
    dragItemPosition.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragItemPosition.current.x;
      const newY = e.clientY - dragItemPosition.current.y;
      const containerBounds = containerRef.current.getBoundingClientRect();
      const elementBounds = dragItem.current.getBoundingClientRect();

      const boundedX = Math.max(
        containerBounds.left,
        Math.min(newX + containerBounds.left, containerBounds.right - elementBounds.width)
      ) - containerBounds.left;

      const boundedY = Math.max(
        containerBounds.top,
        Math.min(newY + containerBounds.top, containerBounds.bottom - elementBounds.height)
      ) - containerBounds.top;
      setPosition({ x: boundedX, y: boundedY });
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false);
    handlePositionUpgrade(key, position);
  }

  return (
    <Box
      ref={containerRef}
      key={key}
      style={commonStyles}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {element.type === 'text' && (
        <Typography
          sx={{
            fontSize: `${element.fontSize}em`,
            color: element.color,
          }}
        >
          {element.content}
        </Typography>
      )}
      {element.type === 'image' && (
        <img src={element.url} alt={element.description} style={commonStyles} />
      )}
      {element.type === 'video' && (
        <video
          key={element.eleID}
          src={element.url}
          autoPlay={element.autoPlay}
          style={commonStyles}
        />
      )}
    </Box>
  )
}
