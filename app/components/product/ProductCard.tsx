"use client";

/**
 * Product Card Component
 * 
 * Displays product information in a card format for listing pages.
 * Used throughout the application for product grids and featured sections.
 * 
 * Design Principles:
 * - Clean, modern card design with hover effects
 * - Image-first approach for visual appeal
 * - Truncated text with titles for long content
 * - Price prominence for e-commerce clarity
 * - Rating display for social proof
 * 
 * Performance Optimizations:
 * - Uses native img tag for external image URLs (per memory)
 * - Lazy loading handled by browser
 * - Link component for client-side navigation
 * 
 * @component
 */

import React from "react";
import Link from "next/link";
import { Box, Paper, Stack, Typography, Rating, Chip } from "@mui/material";
import type { Product } from "@/app/lib/products";

/**
 * Product Card Props
 * @interface
 * @property {Product} product - Product data to display
 */
interface ProductCardProps {
  product: Product;
}

/**
 * Product Card Component
 * 
 * Renders a clickable product card that navigates to product detail page.
 * Displays key product information including image, price, rating, and tags.
 * 
 * @param {ProductCardProps} props - Component props
 * @returns {JSX.Element} Product card component
 */
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%", // Ensures equal height cards in grid
        display: "flex",
        flexDirection: "column",
        textDecoration: "none", // Remove link underline
        transition: "all 0.2s ease", // Smooth hover effect
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: 1,
        },
      }}
      component={Link}
      href={`/product/${product.slug}`}
    >
      {/* Product Image */}
      <Box
        component="img"
        src={product.images?.[0] || "/popcorn.jpg"} // Fallback to default image
        alt={`${product.title} image`}
        sx={{
          height: 160,
          width: "100%",
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          objectFit: "cover", // Maintain aspect ratio
          mb: 1.5,
        }}
      />
      
      {/* Product Details */}
      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        {/* Product Title */}
        <Typography 
          variant="subtitle1" 
          fontWeight={600} 
          noWrap 
          title={product.title} // Full text on hover
        >
          {product.title}
        </Typography>
        
        {/* Product Subtitle (if exists) */}
        {product.subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            noWrap 
            title={product.subtitle}
          >
            {product.subtitle}
          </Typography>
        )}
        
        {/* Rating Section */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Rating 
            size="small" 
            readOnly 
            value={product.rating} 
            precision={0.5} // Allow half stars
          />
          <Typography variant="caption" color="text.secondary">
            ({product.ratingCount})
          </Typography>
        </Stack>
        
        {/* Pricing Section - Pushed to bottom */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: "auto" }}>
          {/* Current Price */}
          <Typography variant="subtitle1" fontWeight={700}>
            ${product.price.toFixed(2)}
          </Typography>
          
          {/* Original Price (if on sale) */}
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ textDecoration: "line-through" }}
            >
              ${product.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Stack>
        
        {/* Product Tags */}
        <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {(product.tags ?? []).slice(0, 2).map((tag) => (
            <Chip 
              key={tag} 
              size="small" 
              label={tag} 
              variant="outlined"
              sx={{ 
                borderColor: tag === "Best Seller" ? "success.main" : 
                             tag === "New" ? "info.main" : 
                             tag === "Limited" ? "warning.main" : "divider" 
              }}
            />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
