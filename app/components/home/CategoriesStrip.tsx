"use client";
import React from "react";
import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useCategoriesQuery, type Category } from "@/app/lib/queries";
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

const iconMap: Record<string, React.ElementType> = {
  kernels: KernelsIcon,
  seasonings: SeasoningIcon,
  gourmet: GourmetIcon,
  gifts: GiftIcon,
  merch: MerchIcon,
  farm: AgricultureIcon,
  natural: NaturalIcon,
  deals: DealIcon,
};

import { useToast } from "@/app/components/shared/ToastProvider";

export default function CategoriesStrip() {
  const { data, isLoading, isError } = useCategoriesQuery();
  const categories: Category[] = data ?? [];
  const { toast } = useToast();

  React.useEffect(() => {
    if (isError) toast("Failed to load categories.", { severity: "error" });
  }, [isError, toast]);

  return (
    <Grid container spacing={2}>
      {(
        isLoading
          ? (Array.from({ length: 6 }).map(() => null) as (Category | null)[])
          : (categories as (Category | null)[])
      ).map((c, idx) => {
        const Icon = iconMap[(c?.key as string) ?? ""] ?? KernelsIcon;
        return (
          <Grid key={c ? c.key : idx} size={{ xs: 6, sm: 4, md: 3 }}>
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
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
              }}
            >
              <Box>
                <Icon color={"primary" as any} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {c ? c.title : " "}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {c?.subtitle ?? " "}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
