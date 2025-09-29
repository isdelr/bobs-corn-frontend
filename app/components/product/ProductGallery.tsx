"use client";
import React from "react";
import { Box, Stack, Paper } from "@mui/material";

export type ProductGalleryProps = {
  images?: string[];
  title?: string;
};

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const all = (images && images.length > 0 ? images : ["/popcorn.jpg"]).slice(0, 8);
  const [active, setActive] = React.useState(0);
  const [hovering, setHovering] = React.useState(false);
  const [origin, setOrigin] = React.useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const scale = 2.2;

  const onMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <Paper
      elevation={0}
      sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}
    >
      <Box
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={onMove}
        sx={{
          position: "relative",
          aspectRatio: "1 / 1",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          cursor: hovering ? "zoom-out" : "zoom-in",
        }}
      >
        {/* Main image */}
        {/* Using native img to support remote URLs without Next/Image domain config */}
        <Box
          component="img"
          src={all[active]}
          alt={title ? `${title} image ${active + 1}` : `Product image ${active + 1}`}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transformOrigin: `${origin.x}% ${origin.y}%`,
            transform: hovering ? `scale(${scale})` : "scale(1)",
            transition: hovering ? "transform 0.03s linear" : "transform 0.2s ease-out",
            willChange: "transform",
          }}
        />
      </Box>
    </Paper>
  );
}
