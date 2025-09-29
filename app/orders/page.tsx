import React from "react";
import { Container, Typography } from "@mui/material";
import OrdersClient from "./OrdersClient";

export default function OrdersPage() {
  return (
    <Container sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        My orders
      </Typography>
      <OrdersClient />
    </Container>
  );
}
