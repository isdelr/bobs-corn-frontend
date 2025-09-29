"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
  Skeleton,
} from "@mui/material";
import { useOrdersQuery } from "@/app/lib/queries";
import { useUser } from "@/app/store/auth";
import { useToast } from "@/app/components/shared/ToastProvider";

function formatDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function OrdersClient() {
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { data, isLoading, isError } = useOrdersQuery();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent("/orders")}`);
    }
  }, [user, router]);

  React.useEffect(() => {
    if (isError) toast("Failed to load orders.", { severity: "error" });
  }, [isError, toast]);

  if (!user) return null;

  if (isError) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
        <Typography color="error">Failed to load orders.</Typography>
      </Paper>
    );
  }

  if (isLoading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <Skeleton width="40%" />
            <Skeleton width="30%" />
            <Skeleton variant="rectangular" height={40} sx={{ mt: 1, borderRadius: 1 }} />
          </Paper>
        ))}
      </Stack>
    );
  }

  const orders = data ?? [];

  if (orders.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No orders yet</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Start shopping to place your first order.</Typography>
        <Button component={Link} href="/" variant="outlined">Browse products</Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {orders.map((o) => (
        <Paper key={o.id} elevation={0} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip size="small" label={o.status} color={o.status === "paid" ? "success" : "default"} />
              <Typography variant="subtitle1" fontWeight={700}>Order #{o.id}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="subtitle2" color="text.secondary">{formatDate(o.createdAt)}</Typography>
              <Typography variant="subtitle1" fontWeight={700}>${o.total.toFixed(2)}</Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 1.5 }} />

          <Grid container spacing={1}>
            {o.items.map((it, idx) => (
              <Grid key={`${o.id}-${idx}`} size={{ xs: 12, md: 6 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 40, height: 40, borderRadius: 1, border: "1px solid", borderColor: "divider", background: "linear-gradient(135deg, rgba(76,175,80,0.12), rgba(38,198,218,0.12))" }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap title={it.title}>{it.title}</Typography>
                    <Typography variant="caption" color="text.secondary">Qty {it.quantity} · ${it.price.toFixed(2)}</Typography>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
}
