"use client";
import React from 'react';
import { Box, Button, Chip, Divider, Stack, Typography, Rating, ToggleButton, ToggleButtonGroup, TextField, Tooltip } from '@mui/material';
import type { Product, ProductOption } from '@/app/lib/products';
import { useCart } from '@/app/store/cart';
import { LocalShippingOutlined as ShippingIcon, VerifiedOutlined as VerifiedIcon, ReplayOutlined as ReturnIcon } from '@mui/icons-material';

function OptionPicker({ option, value, onChange }: { option: ProductOption; value?: string; onChange: (val: string) => void }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>{option.name}</Typography>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={value ?? ''}
        onChange={(_, val) => val && onChange(val)}
        aria-label={option.name}
        sx={{ flexWrap: 'wrap', gap: 1 }}
     >
        {option.values.map(v => (
          <ToggleButton key={v.id} value={v.id} aria-label={v.label} sx={{ px: 1.5, py: 0.75, borderRadius: 1 }}>
            {v.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

function QuantityPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const clamp = (n: number) => Math.max(1, Math.min(99, n));
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button variant="outlined" onClick={() => onChange(clamp(value - 1))} aria-label="Decrease quantity" sx={{ minWidth: 40 }}>−</Button>
      <TextField
        size="small"
        type="number"
        inputProps={{ min: 1, max: 99, 'aria-label': 'Quantity' }}
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value || '1', 10)))}
        sx={{ width: 88 }}
      />
      <Button variant="outlined" onClick={() => onChange(clamp(value + 1))} aria-label="Increase quantity" sx={{ minWidth: 40 }}>+</Button>
    </Stack>
  );
}

export default function PurchasePanel({ product }: { product: Product }) {
  const add = useCart(s => s.addItem);
  const [qty, setQty] = React.useState(1);
  const [selections, setSelections] = React.useState<Record<string, string>>({});

  const allOptionsSelected = (product.options?.every(o => selections[o.id])) ?? true;
  const optionsKey = product.options?.map(o => `${o.id}=${selections[o.id] || ''}`).join(';');

  const handleAdd = () => {
    add(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0],
        optionsKey,
      },
      qty,
    );
  };

  return (
    <Stack spacing={2} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {product.tags?.[0] && <Chip label={product.tags[0]} color="primary" size="small" />}
          <Rating size="small" precision={0.5} value={product.rating} readOnly />
          <Typography variant="body2" color="text.secondary">({product.ratingCount})</Typography>
        </Stack>
        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1.1 }}>{product.title}</Typography>
        {product.subtitle && (
          <Typography variant="subtitle1" color="text.secondary">{product.subtitle}</Typography>
        )}
      </Stack>

      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography variant="h5" fontWeight={700}>${product.price.toFixed(2)}</Typography>
        {product.originalPrice && (
          <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
            ${product.originalPrice.toFixed(2)}
          </Typography>
        )}
      </Stack>

      {product.badges && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {product.badges.map(b => (
            <Chip key={b} size="small" variant="outlined" label={b} />
          ))}
        </Stack>
      )}

      {product.options?.map((opt) => (
        <OptionPicker
          key={opt.id}
          option={opt}
          value={selections[opt.id]}
          onChange={(val) => setSelections((s) => ({ ...s, [opt.id]: val }))}
        />
      ))}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <QuantityPicker value={qty} onChange={setQty} />
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleAdd}
          disabled={!allOptionsSelected}
          sx={{ flex: 1, py: 1.2 }}
        >
          Add to cart
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ color: 'text.secondary' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ShippingIcon fontSize="small" />
          <Typography variant="body2">Ships in 24–48 hrs</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <ReturnIcon fontSize="small" />
          <Typography variant="body2">30‑day returns</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <VerifiedIcon fontSize="small" />
          <Typography variant="body2">Secure checkout</Typography>
        </Stack>
      </Stack>

      <Divider />
      <Typography variant="body1" color="text.secondary">{product.description}</Typography>
    </Stack>
  );
}
