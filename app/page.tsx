/**
 * Home Page Component
 * 
 * Landing page for Bob's Corn e-commerce platform.
 * Showcases the unique business model and products.
 * 
 * Key Features:
 * - Hero section introducing Bob's fair pricing policy
 * - Featured products with quick purchase options
 * - Category navigation
 * - Clear messaging about the "1 corn per minute" rule
 * 
 * Design Philosophy:
 * - Clean, modern aesthetic inspired by premium e-commerce
 * - Mobile-first responsive design
 * - Fast loading with optimized images
 * - Clear CTAs for conversion optimization
 * 
 * @module app/page
 */

import React from "react";
import {Box, Container, Typography, Grid, Button, Stack, Paper, Divider, Chip} from "@mui/material";
import CategoriesStrip from "@/app/components/home/CategoriesStrip";
import FeaturedProducts from "@/app/components/home/FeaturedProducts";
import Image from "next/image";

/**
 * Home Page Component
 * 
 * The main landing page that introduces customers to Bob's Corn.
 * Emphasizes the unique selling proposition and fair pricing policy.
 * 
 * @returns {JSX.Element} Home page component
 */
export default function Home() {
    return (
        <Container sx={{py: {xs: 2, sm: 3, md: 4}}}>
            {/* Hero Section - Introduces Bob's Corn and the fair pricing policy */}
            <Paper
                elevation={0}
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 3,
                    px: {xs: 3, md: 6},
                    py: {xs: 4, md: 6},
                    background:
                        "linear-gradient(135deg, rgba(76,175,80,0.08), rgba(38,198,218,0.08))",
                }}
            >
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{xs: 12, md: 7}}>
                        <Stack spacing={2}>
                            {/* Trust Badge */}
                            <Chip
                                color="success"
                                label="Farm‑fresh goodness"
                                sx={{alignSelf: "flex-start"}}
                            />
                            
                            {/* Main Headline */}
                            <Typography variant="h3" component="h1" sx={{fontWeight: 700}}>
                                Popcorn, perfected.
                            </Typography>
                            
                            {/* Value Proposition - Subtly mentions the fair pricing */}
                            <Typography variant="h6" color="text.secondary" sx={{maxWidth: 640}}>
                                Shop kernels, gourmet flavors, and gift‑worthy bundles—all crafted
                                with quality ingredients. Fair pricing with Bob's honest policy:
                                <strong> 1 corn per customer per minute.</strong>
                            </Typography>
                            
                            {/* Call-to-Action Buttons */}
                            <Stack direction={{xs: "column", sm: "row"}} spacing={2}>
                                <Button variant="contained" size="large">Shop best sellers</Button>
                                <Button variant="outlined" size="large">Learn about Bob's policy</Button>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid size={{xs: 12, md: 5}}>

                        <div style={{width: "auto", height: "240px", borderRadius: "8px", overflow: "hidden"}}>
                            <Image src="/popcorn.jpg" alt="Popcorn" width={400} height={400} style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                                objectFit: "cover",
                            }}/>
                        </div>

                    </Grid>
                </Grid>
            </Paper>

            {/* Categories Section - Dynamic from backend API */}
            <Box sx={{mt: {xs: 3, md: 5}}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                    <Typography variant="h5" fontWeight={700}>Shop by category</Typography>
                    <Button size="small" variant="text">View all</Button>
                </Stack>
                {/* Categories loaded via React Query from backend */}
                <CategoriesStrip/>
            </Box>

            {/* Featured Products Section - Showcases best sellers */}
            <Box sx={{mt: {xs: 4, md: 6}}}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                    <Typography variant="h5" fontWeight={700}>Trending now</Typography>
                    <Button size="small" variant="text">See more</Button>
                </Stack>
                {/* Products loaded with proper error handling and loading states */}
                <FeaturedProducts/>
            </Box>

            {/* Promotional Banner - Emphasizes quality and fair business practices */}
            <Box sx={{mt: {xs: 4, md: 6}}}>
                <Paper
                    elevation={0}
                    sx={{
                        p: {xs: 2.5, md: 3},
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: {xs: "column", md: "row"},
                        alignItems: "center",
                        gap: 2,
                        // Subtle gradient background for visual interest
                        background: "linear-gradient(to right, rgba(76,175,80,0.02), rgba(255,193,7,0.02))",
                    }}
                >
                    <Box sx={{flex: 1}}>
                        <Typography variant="h6" fontWeight={700}>From our farm to your bowl</Typography>
                        <Typography color="text.secondary" sx={{mt: 0.5}}>
                            Ethically sourced corn, carefully processed, and shipped with care. 
                            Bob believes in fair commerce: <strong>everyone gets their turn, 
                            one purchase per minute</strong>. Taste the difference of
                            small‑batch quality.
                        </Typography>
                    </Box>
                    <Stack direction={{xs: "column", sm: "row"}} spacing={1.5}>
                        <Button variant="outlined">Learn more</Button>
                        <Button variant="contained">Shop kernels</Button>
                    </Stack>
                </Paper>
            </Box>

            <Divider sx={{my: {xs: 3, md: 5}}}/>

            {/* Footer - Copyright and rate limit reminder */}
            <Box sx={{pb: 2, color: "text.secondary"}}>
                <Stack spacing={1}>
                    <Typography variant="body2">
                        © {new Date().getFullYear()} Bob's Corn. All rights reserved.
                    </Typography>
                    <Typography variant="caption">
                        Fair Commerce Policy: Maximum 1 corn purchase per customer per minute. 
                        This ensures everyone gets a fair chance at our premium products.
                    </Typography>
                </Stack>
            </Box>
        </Container>
    );
}
