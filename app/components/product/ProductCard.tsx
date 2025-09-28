"use client";
import React from "react";
import Link from "next/link";
import { Box, Paper, Stack, Typography, Rating, Chip } from "@mui/material";
import type { Product } from "@/app/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
      }}
      component={Link}
      href={`/product/${product.slug}`}
    >
      <Box
        sx={{
          height: 160,
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(135deg, rgba(76,175,80,0.12), rgba(38,198,218,0.12))",
          mb: 1.5,
        }}
      />
      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600} noWrap title={product.title}>
          {product.title}
        </Typography>
        {product.subtitle && (
          <Typography variant="body2" color="text.secondary" noWrap title={product.subtitle}>
            {product.subtitle}
          </Typography>
        )}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Rating size="small" readOnly value={product.rating} precision={0.5} />
          <Typography variant="caption" color="text.secondary">
            ({product.ratingCount})
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: "auto" }}>
          <Typography variant="subtitle1" fontWeight={700}>
            ${product.price.toFixed(2)}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              ${product.originalPrice.toFixed(2)}
            </Typography>
          )}
        </Stack>
        <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {(product.tags ?? []).slice(0, 2).map((t) => (
            <Chip key={t} size="small" label={t} variant="outlined" />
          ))}
        </Box>
      </Stack>
    </Paper>
  );
}
