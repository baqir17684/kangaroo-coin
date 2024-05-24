import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { useDrag } from 'react-dnd';

export default function DraggableElement ({ element }) {
  const [position, setPosition] = useState({ x: element.xPosition || 50, y: element.yPosition || 50 });
  const eleID = element.eleID;
  const [{ isDragging }, drag] = useDrag({
    type: 'Box',
    item: { eleID, x: position.x, y: position.y },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const commonStyles = {
    position: 'absolute',
    top: `${position.y}` + '%',
    left: `${position.x}` + '%',
    transform: 'translate(-50%, -50%)',
    width: `${element.width}%`,
    height: `${element.height}%`,
    zIndex: 10,
    fontSize: 25,
    fontWeight: 'bold',
    cursor: 'move',
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    setPosition({ x: element.xPosition || 50, y: element.yPosition || 50 });
  }, [element]);

  return (
    <Box
      key={eleID}
      id="draggable-element"
      style={commonStyles}
      ref={drag}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {element.type === 'text' && (
        <Typography
          sx={{
            fontSize: `${element.fontSize}em`,
            color: element.color,
            width: '100%',
            height: '100%',
          }}
        >
          {element.content}
        </Typography>
      )}
      {element.type === 'image' && (
        <img src={element.url} alt={element.description} style={{ width: '100%', height: '100%' }} />
      )}
      {element.type === 'video' && element.url.includes('youtube.com') && (
        <iframe
          width="90%"
          height="90%"
          src={`https://www.youtube.com/embed/${element.url.split('v=')[1]}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </Box>
  )
}
