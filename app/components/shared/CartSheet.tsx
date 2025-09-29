"use client";

/**
 * Shopping Cart Sheet Component
 * 
 * This is the main cart interface where users complete their corn purchases.
 * 
 * CRITICAL BUSINESS LOGIC:
 * - Enforces Bob's "1 corn per minute" rate limit via backend
 * - Handles 429 (Too Many Requests) responses gracefully
 * - Requires authentication before checkout
 * 
 * Features:
 * - Real-time cart total calculation
 * - Individual item removal
 * - Authentication redirect for guest users
 * - Success/error toast notifications
 * - Automatic redirect to orders page after purchase
 * 
 * @component
 */

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

/**
 * Cart Sheet Props
 * @interface
 * @property {boolean} open - Controls dialog visibility
 * @property {Function} onClose - Callback when dialog should close
 */
interface CartSheetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Shopping Cart Sheet Component
 * 
 * Renders as a modal dialog for cart review and checkout.
 * Integrates with global cart state and handles the purchase flow.
 * 
 * @param {CartSheetProps} props - Component props
 * @returns {JSX.Element} Cart dialog component
 */
export default function CartSheet({ open, onClose }: CartSheetProps) {
  // Cart state selectors
  const items = useCartItems(); // Array of cart items
  const total = useCartTotal(); // Calculated total price
  const clear = useCart((s) => s.clear); // Clear cart action
  const removeItem = useCart((s) => s.removeItem); // Remove single item action
  
  // Authentication state
  const token = useAuth((s) => s.token);
  
  // Navigation hooks
  const router = useRouter();
  const pathname = usePathname();
  
  // UI feedback
  const { toast } = useToast();
  
  // Purchase mutation hook
  const purchaseMutation = usePurchaseMutation();

  /**
   * Handle checkout process
   * 
   * Business flow:
   * 1. Validate cart has items
   * 2. Check authentication (redirect if needed)
   * 3. Submit purchase request
   * 4. Handle rate limiting (429 responses)
   * 5. Clear cart and redirect on success
   * 
   * RATE LIMITING: The backend enforces "1 corn per minute" rule.
   * A 429 response indicates the customer must wait.
   */
  const handleCheckout = async () => {
    // Validation: Ensure cart has items
    if (!items.length) return;
    
    // Authentication check: Redirect to login if not authenticated
    if (!token) {
      // Preserve current page as return destination
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    
    try {
      // Submit purchase request
      // Note: Only sending productId and quantity, backend handles pricing
      await purchaseMutation.mutateAsync({
        items: items.map((it) => ({ productId: it.id, quantity: it.qty })),
      });
      
      // Success: Show confirmation
      toast("Order placed successfully! 🌽", { severity: "success" });
      
      // Clean up: Clear cart and close dialog
      clear();
      onClose();
      
      // Navigate to orders page to show purchase
      router.push("/orders");
    } catch (err: any) {
      // Error handling with specific rate limit message
      if (err?.status === 429) {
        // Rate limited - show Bob's business rule
        toast(
          "Please wait! Bob's policy: Maximum 1 corn purchase per minute. Try again shortly.",
          { severity: "warning" }
        );
      } else {
        // Other errors
        toast(err?.message || "Failed to place order.", { severity: "error" });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* Dialog Header with close button */}
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
      
      {/* Cart Content */}
      <DialogContent dividers>
        {items.length === 0 ? (
          // Empty cart state
          <Box sx={{ py: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Your cart is empty.
            </Typography>
          </Box>
        ) : (
          // Cart items list
          <Stack spacing={1.5}>
            <List disablePadding>
              {items.map((it) => (
                <ListItem
                  key={it.key}
                  sx={{ px: 0 }}
                  secondaryAction={
                    // Per-item remove button
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
                  {/* Product thumbnail */}
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={it.image || undefined} alt={it.title}>
                      {it.title?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  
                  {/* Product details */}
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
            
            {/* Cart Total */}
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
      
      {/* Action Buttons */}
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
