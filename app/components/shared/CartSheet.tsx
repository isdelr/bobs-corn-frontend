"use client";
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCartItems, useCartTotal, useCart } from "@/app/store/cart";
import { usePurchaseMutation } from "@/app/lib/queries";
import { useAuth } from "@/app/store/auth";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/app/components/shared/ToastProvider";

export default function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const items = useCartItems();
  const total = useCartTotal();
  const clear = useCart((s) => s.clear);
  const removeItem = useCart((s) => s.removeItem);
  const token = useAuth((s) => s.token);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const purchaseMutation = usePurchaseMutation();

  const handleCheckout = async () => {
    if (!items.length) return;
    if (!token) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    try {
      await purchaseMutation.mutateAsync({
        items: items.map((it) => ({ productId: it.id, quantity: it.qty })),
      });
      toast("Order placed successfully!", { severity: "success" });
      clear();
      onClose();
      router.push("/orders");
    } catch (err) {
      toast((err as any)?.message || "Failed to place order.", { severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Cart
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {items.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Your cart is empty.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            <List disablePadding>
              {items.map((it) => (
                <ListItem
                  key={it.key}
                  sx={{ px: 0 }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label={`Remove ${it.title}`}
                      onClick={() => removeItem(it.key)}
                      size="small"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={it.image || undefined} alt={it.title}>
                      {it.title?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight={600} noWrap title={it.title}>
                        {it.title}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Qty {it.qty} · ${it.subtotal.toFixed(2)}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                ${total.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">Close</Button>
        <Button
          variant="contained"
          onClick={handleCheckout}
          disabled={!items.length || purchaseMutation.isPending}
        >
          {purchaseMutation.isPending ? "Processing…" : "Checkout"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
