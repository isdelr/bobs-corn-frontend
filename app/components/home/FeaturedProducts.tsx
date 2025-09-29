"use client";
import React from "react";
import { Grid, Paper, Stack, Typography, Skeleton } from "@mui/material";
import ProductCard from "@/app/components/product/ProductCard";
import { useFeaturedProductsQuery } from "@/app/lib/queries";
import { useToast } from "@/app/components/shared/ToastProvider";

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useFeaturedProductsQuery();
  const { toast } = useToast();

  React.useEffect(() => {
    if (isError) toast("Failed to load featured products.", { severity: "error" });
  }, [isError, toast]);

  if (isError) {
    return (
      <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Typography color="error">Failed to load featured products.</Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={0}
                sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
              >
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 1.5 }} />
                <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                  <Skeleton width="80%" />
                  <Skeleton width="60%" />
                  <Skeleton width="40%" />
                </Stack>
              </Paper>
            </Grid>
          ))
        : (data ?? []).map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <ProductCard product={p} />
            </Grid>
          ))}
    </Grid>
  );
}
