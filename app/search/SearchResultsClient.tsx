"use client";
import React from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Stack,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import type { Product } from "@/app/lib/products";
import { useSearchProductsQuery } from "@/app/lib/queries";
import ProductCard from "@/app/components/product/ProductCard";
import { useToast } from "@/app/components/shared/ToastProvider";

export type SearchResultsClientProps = {
  initialQuery?: string;
};

function normalize(text: string) {
  return text.toLowerCase();
}

function scoreMatch(p: Product, q: string): number {
  if (!q) return 1; // neutral score if no query
  const n = normalize(q);
  const hay = normalize(
    `${p.title} ${p.subtitle ?? ""} ${p.description ?? ""} ${(p.tags ?? []).join(" ")}`
  );
  let score = 0;
  if (hay.includes(n)) score += 3;
  // small bonus per matched term
  const terms = n.split(/\s+/).filter(Boolean);
  for (const t of terms) {
    if (hay.includes(t)) score += 1;
  }
  return score;
}

export default function SearchResultsClient({ initialQuery = "" }: SearchResultsClientProps) {
  const { data, isLoading, isError } = useSearchProductsQuery(initialQuery);
  const { toast } = useToast();
  React.useEffect(() => {
    if (isError) toast("Failed to search products.", { severity: "error" });
  }, [isError, toast]);
  const all: Product[] = data ?? [];
  const priceMin = React.useMemo(() => (all.length ? Math.min(...all.map((p) => p.price)) : 0), [all]);
  const priceMax = React.useMemo(() => (all.length ? Math.max(...all.map((p) => p.price)) : 0), [all]);
  const allTags = React.useMemo(() => Array.from(new Set(all.flatMap((p) => p.tags ?? []))).sort(), [all]);

  // State
  const [query, setQuery] = React.useState(initialQuery);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    Math.floor(priceMin),
    Math.ceil(priceMax),
  ]);
  const [minRating, setMinRating] = React.useState<number>(0);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState<
    "relevance" | "price-asc" | "price-desc" | "rating-desc"
  >("relevance");
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  React.useEffect(() => {
    // when initial query changes (from server), sync once
    setQuery(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    if (all.length) {
      setPriceRange([Math.floor(priceMin), Math.ceil(priceMax)]);
    }
  }, [all, priceMin, priceMax]);

  const filtered = React.useMemo(() => {
    const q = query.trim();
    const result = all
      .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
      .filter((p) => p.rating >= minRating)
      .filter((p) =>
        selectedTags.length ? (p.tags ?? []).some((t) => selectedTags.includes(t)) : true
      )
      .filter((p) => {
        if (!q) return true;
        const hay = normalize(
          `${p.title} ${p.subtitle ?? ""} ${p.description ?? ""} ${(p.tags ?? []).join(" ")}`
        );
        return q
          .split(/\s+/)
          .filter(Boolean)
          .every((term) => hay.includes(term.toLowerCase()));
      })
      .map((p) => ({ p, s: scoreMatch(p, q) }));

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.p.price - b.p.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.p.price - a.p.price);
        break;
      case "rating-desc":
        result.sort((a, b) => b.p.rating - a.p.rating);
        break;
      case "relevance":
      default:
        result.sort((a, b) => b.s - a.s || a.p.price - b.p.price);
        break;
    }

    return result.map((r) => r.p);
  }, [all, minRating, priceRange, query, selectedTags, sortBy]);

  const clearAll = () => {
    setQuery(initialQuery ?? "");
    setPriceRange([Math.floor(priceMin), Math.ceil(priceMax)]);
    setMinRating(0);
    setSelectedTags([]);
    setSortBy("relevance");
  };

  const FiltersPanel = (
    <Paper
      elevation={0}
      sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
    >
      <Stack spacing={2}
        sx={{ position: { md: "sticky" }, top: { md: 16 }, maxHeight: { md: "calc(100dvh - 32px)" }, overflow: { md: "auto" } }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>Filters</Typography>
          <Button size="small" onClick={clearAll}>Clear</Button>
        </Stack>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Price</Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              type="number"
              size="small"
              label="Min"
              value={priceRange[0]}
              onChange={(e) =>
                setPriceRange(([_, max]) => [Number(e.target.value || 0), max])
              }
              inputProps={{ min: Math.floor(priceMin), max: priceRange[1], step: 0.5 }}
            />
            <TextField
              type="number"
              size="small"
              label="Max"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange(([min, _]) => [min, Number(e.target.value || 0)])
              }
              inputProps={{ min: priceRange[0], max: Math.ceil(priceMax), step: 0.5 }}
            />
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Rating</Typography>
          <RadioGroup
            value={String(minRating)}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {[0, 3, 4, 4.5].map((r) => (
              <FormControlLabel
                key={r}
                value={String(r)}
                control={<Radio size="small" />}
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating size="small" readOnly value={r} precision={0.5} />
                    <Typography variant="body2">& up</Typography>
                  </Stack>
                }
              />
            ))}
          </RadioGroup>
        </Box>

        {allTags.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Tags</Typography>
            <FormControl component="fieldset" variant="standard" sx={{ width: "100%" }}>
              <FormGroup>
                {allTags.map((t) => (
                  <FormControlLabel
                    key={t}
                    control={
                      <Checkbox
                        checked={selectedTags.includes(t)}
                        onChange={() =>
                          setSelectedTags((prev) =>
                            prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                          )
                        }
                      />
                    }
                    label={t}
                  />
                ))}
              </FormGroup>
            </FormControl>
            <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {selectedTags.map((t) => (
                <Chip key={t} size="small" label={t} onDelete={() => setSelectedTags((prev) => prev.filter((x) => x !== t))} />
              ))}
            </Box>
          </Box>
        )}
      </Stack>
    </Paper>
  );

  return (
    <Container sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          {initialQuery ? `Results for “${initialQuery}”` : "Browse products"}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <FormControl size="small">
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating-desc">Rating</MenuItem>
            </Select>
          </FormControl>
          <IconButton
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            onClick={() => setFiltersOpen((v) => !v)}
            aria-label="toggle filters"
          >
            <FilterListIcon />
          </IconButton>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        {/* Filters column */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: "none", md: "block" } }}>
          {FiltersPanel}
        </Grid>

        {/* Results */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Mobile filters bar */}
          <Paper elevation={0} sx={{ p: 1, mb: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, display: { xs: "flex", md: "none" }, alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterListIcon />
              <Typography variant="body2">Filters</Typography>
            </Stack>
            <IconButton size="small" onClick={() => setFiltersOpen(true)} aria-label="open filters">
              <FilterListIcon />
            </IconButton>
          </Paper>

          {/* Results meta */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`}
          </Typography>

          <Grid container spacing={2}>
            {(isLoading ? [] : filtered).map((p) => (
              <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>

          {!isLoading && filtered.length === 0 && (
            <Paper elevation={0} sx={{ mt: 2, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>No results</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting filters or use broader search terms.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={clearAll}>Clear all filters</Button>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Simple inline mobile filters panel */}
      {filtersOpen && (
        <Paper elevation={24} sx={{
          position: "fixed", inset: 0, zIndex: (t) => t.zIndex.modal,
          p: 2, borderRadius: 0, bgcolor: "background.default", overflow: "auto"
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle1" fontWeight={700}>Filters</Typography>
            <IconButton onClick={() => setFiltersOpen(false)} aria-label="close filters">
              <CloseIcon />
            </IconButton>
          </Stack>
          {FiltersPanel}
          <Box sx={{ position: "sticky", bottom: 0, mt: 2, py: 1, bgcolor: "background.default" }}>
            <Button fullWidth variant="contained" onClick={() => setFiltersOpen(false)}>Show results</Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
}
