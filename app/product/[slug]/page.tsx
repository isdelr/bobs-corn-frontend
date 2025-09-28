import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Box, Grid, Stack, Typography, Paper, Chip, Divider, Accordion, AccordionSummary, AccordionDetails, Button, Rating } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getAllProducts, getProductBySlug } from '@/app/lib/products';
import PurchasePanel from '../../components/product/PurchasePanel';

export async function generateStaticParams() {
  // prebuild popular products
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <Container sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Breadcrumbs placeholder */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, color: 'text.secondary' }}>
        <Typography component={Link} href="/" color="inherit" sx={{ textDecoration: 'none' }}>Home</Typography>
        <Typography>›</Typography>
        <Typography>{product.title}</Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Media gallery */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                aspectRatio: '1 / 1',
                borderRadius: 2,
                background:
                  'linear-gradient(135deg, rgba(76,175,80,0.15), rgba(38,198,218,0.15))',
                border: '1px dashed',
                borderColor: 'divider',
              }}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {product.images?.slice(0, 4).map((_, idx) => (
                <Box key={idx} sx={{ flex: 1, height: 64, borderRadius: 1, border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, rgba(38,198,218,0.12), rgba(76,175,80,0.12))' }} />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Summary + purchase */}
        <Grid size={{ xs: 12, md: 6 }}>
          <PurchasePanel product={product} />
        </Grid>
      </Grid>

      {/* Details */}
      <Grid container spacing={3} sx={{ mt: { xs: 3, md: 4 } }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            {(product.details ?? []).map((d, i) => (
              <Accordion key={i} elevation={0} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>{d.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{d.content}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            {!product.details?.length && (
              <Box sx={{ p: 2 }}>
                <Typography color="text.secondary">More details coming soon.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>Why you’ll love it</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {(product.badges ?? ['Farm‑fresh', 'Small‑batch', 'Made with care']).map((b) => (
                <Chip key={b} size="small" label={b} variant="outlined" />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Related items */}
      <Box sx={{ mt: { xs: 4, md: 6 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>You may also like</Typography>
        </Stack>
        <Grid container spacing={2}>
          {getAllProducts().filter(p => p.slug !== product.slug).slice(0, 4).map((p) => (
            <Grid key={p.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{borderRadius: 2, textDecoration: 'none' }} component={Link} href={`/product/${p.slug}`}>
                <Box sx={{ height: 120, borderRadius: 1, border: '1px solid', borderColor: 'divider', background: 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(38,198,218,0.12))' }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 1 }}>{p.title}</Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating size="small" readOnly value={p.rating} precision={0.5} />
                  <Typography variant="body2" color="text.secondary">${p.price.toFixed(2)}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
