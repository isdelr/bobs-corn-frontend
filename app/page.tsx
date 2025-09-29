import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Grid, Button, Stack, Paper, Divider, Chip } from "@mui/material";
import CategoriesStrip from "@/app/components/home/CategoriesStrip";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";

export default function Home() {
  return (
    <Container sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Hero */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
          background:
            "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(38,198,218,0.08))",
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={2}>
              <Chip
                color="success"
                label="Farm‑fresh goodness"
                sx={{ alignSelf: "flex-start" }}
              />
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                Popcorn, perfected.
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640 }}>
                Shop kernels, gourmet flavors, and gift‑worthy bundles—all crafted
                with quality ingredients. Clean design, fast checkout.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" size="large">Shop best sellers</Button>
                <Button variant="outlined" size="large">Explore categories</Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              aria-hidden
              sx={{
                height: 240,
                borderRadius: 2,
                background:
                  "radial-gradient(1000px 200px at 20% 0%, rgba(38,198,218,0.25), transparent), radial-gradient(800px 300px at 100% 100%, rgba(76,175,80,0.25), transparent)",
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Categories (from backend) */}
      <Box sx={{ mt: { xs: 3, md: 5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Shop by category</Typography>
          <Button size="small" variant="text">View all</Button>
        </Stack>
        <CategoriesStrip />
      </Box>

      {/* Featured products (from backend) */}
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Trending now</Typography>
          <Button size="small" variant="text">See more</Button>
        </Stack>
        <FeaturedProducts />
      </Box>

      {/* Promo banner */}
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>From our farm to your bowl</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Ethically sourced corn, carefully processed, and shipped with care. Taste the difference of small‑batch quality.
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="outlined">Learn more</Button>
            <Button variant="contained">Shop kernels</Button>
          </Stack>
        </Paper>
      </Box>

      <Divider sx={{ my: { xs: 3, md: 5 } }} />

      {/* Footer note */}
      <Box sx={{ pb: 2, color: "text.secondary" }}>
        <Typography variant="body2">© {new Date().getFullYear()} Bob's Corn. All rights reserved.</Typography>
      </Box>
    </Container>
  );
}
