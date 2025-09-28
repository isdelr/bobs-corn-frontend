"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Box,
  InputBase,
  Toolbar,
  Typography,
  styled,
  Theme,
  alpha,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  Button,
} from "@mui/material";
import { useUser } from "@/app/store/auth";
import { useCartCount } from "@/app/store/cart";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "./ThemeProvider";
import {
  StorefrontSharp as StoreFrontSharpIcon,
  Search as SearchIcon,
  ShoppingCartOutlined as ShoppingCartIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  LocationOnOutlined as LocationOnIcon,
} from "@mui/icons-material";

const Search = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '60ch',
    },
  },
}));

function Navbar() {
  const theme = useTheme();
  const { toggleMode } = useThemeMode();
  const isDark = theme.palette.mode === 'dark';
  const count = useCartCount();
  const user = useUser();
  const router = useRouter();
  const [term, setTerm] = React.useState('');

  const goSearch = React.useCallback(() => {
    const q = term.trim();
    if (q.length === 0) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, term]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar elevation={0} position="static">
        <Toolbar
          sx={{
            minHeight: { xs: 56, sm: 64 },
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr minmax(0, 1fr) 1fr',
              md: '1fr minmax(0, 60ch) 1fr',
            },
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
          {/* Left: Brand + Address */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <StoreFrontSharpIcon sx={{ mr: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
              <Typography
                variant="h6"
                component={Link}
                href="/"
                sx={{
                  mr: 1,
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Bob&apos;s Corn
              </Typography>
              <Button
                color="inherit"
                size="small"
                startIcon={<LocationOnIcon sx={{ fontSize: 18, opacity: 0.9 }} />}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  alignItems: 'center',
                  minWidth: 0,
                  textTransform: 'none',
                  px: 1,
                  ml: { md: 2 },
                  maxWidth: { sm: 160, md: 240 },
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
                title="123 Farm Rd, Fieldville"
              >
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                  }}
                >
                  123 Farm Rd, Fieldville
                </Typography>
              </Button>
            </Box>
          </Box>

          {/* Center: Search */}
          <Box sx={{ gridColumn: '2 / 3', width: '100%' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); goSearch(); } }}
              />
            </Search>
          </Box>

          {/* Right: Actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifySelf: 'end',
              gap: { xs: 0.5, sm: 1 },
            }}
          >
            <Tooltip title="Toggle theme">
              <IconButton
                color="inherit"
                aria-label="toggle theme"
                onClick={toggleMode}
              >
                {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Cart">
              <IconButton color="inherit" aria-label="shopping cart">
                <Badge badgeContent={count} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {user ? (
              <Tooltip title="Account">
                <IconButton color="inherit" aria-label="account">
                  <Avatar sx={{ width: 32, height: 32 }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/login"
                  color="inherit"
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                >
                  Log in
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;