import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Paper,
  Divider,
  Rating,
  TextField,
} from "@mui/material";
import {
  Agriculture as AgricultureIcon,
  CardGiftcard as GiftIcon,
  DinnerDining as SeasoningIcon,
  Storefront as MerchIcon,
  Spa as NaturalIcon,
  LocalMall as KernelsIcon,
  Whatshot as GourmetIcon,
  LocalOffer as DealIcon,
} from "@mui/icons-material";

export default function Home() {
  const categories: { title: string; subtitle: string; Icon: React.ElementType; color: "primary"|"secondary"|"success"|"warning"|"info" }[] = [
    { title: "Popcorn Kernels", subtitle: "Classic & heirloom", Icon: KernelsIcon, color: "primary" },
    { title: "Seasonings", subtitle: "Sweet & savory", Icon: SeasoningIcon, color: "secondary" },
    { title: "Gourmet Flavors", subtitle: "Small‑batch treats", Icon: GourmetIcon, color: "warning" },
    { title: "Gifts & Bundles", subtitle: "Share the joy", Icon: GiftIcon, color: "success" },
    { title: "Merch", subtitle: "Tees, hats & more", Icon: MerchIcon, color: "info" },
    { title: "Farm Experiences", subtitle: "Tours & events", Icon: AgricultureIcon, color: "primary" },
    { title: "Natural & Organic", subtitle: "Simple ingredients", Icon: NaturalIcon, color: "success" },
    { title: "Deals", subtitle: "Today’s savings", Icon: DealIcon, color: "secondary" },
  ];

  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: [
      "Farm‑fresh Yellow Kernels",
      "White Butterfly Popcorn",
      "Caramel Drizzle Pack",
      "Sea Salt & Butter Duo",
      "Smoky BBQ Seasoning",
      "Sweet Kettle Corn Kit",
      "Cheddar Blast Mix",
      "Holiday Gift Box",
    ][i],
    price: [5.99, 6.49, 12.99, 9.99, 7.49, 11.99, 8.99, 24.99][i],
    rating: 4 + ((i % 3) * 0.5),
    tag: ["Best Seller", "New", "Limited", "Popular"][i % 4],
  }));

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

      {/* Categories */}
      <Box sx={{ mt: { xs: 3, md: 5 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Shop by category</Typography>
          <Button size="small" variant="text">View all</Button>
        </Stack>
        <Grid container spacing={2}>
          {categories.map(({ title, subtitle, Icon, color }, idx) => (
            <Grid key={title} size={{ xs: 6, sm: 4, md: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  height: 120,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                  cursor: "pointer",
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  },
                }}
              >
                <Box>
                  <Icon color={color as any} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>{title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {subtitle}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Trending */}
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5" fontWeight={700}>Trending now</Typography>
          <Button size="small" variant="text">See more</Button>
        </Stack>
        <Grid container spacing={2}>
          {products.map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    height: 160,
                    background:
                      "linear-gradient(135deg, rgba(76,175,80,0.15), rgba(38,198,218,0.15))",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip size="small" label={p.tag} color="primary" variant="outlined" />
                      <Rating size="small" precision={0.5} value={p.rating} readOnly />
                    </Stack>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      1 lb bag
                    </Typography>
                    <Typography variant="h6">${p.price.toFixed(2)}</Typography>
                  </Stack>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button fullWidth variant="contained">Add to cart</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
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
