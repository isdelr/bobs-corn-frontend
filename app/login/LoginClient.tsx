"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { EmailOutlined as EmailIcon, LockOutlined as LockIcon } from "@mui/icons-material";
import * as z from "zod";
import { useLoginMutation } from "@/app/lib/queries";

const LoginSchema = z.strictObject({
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(6, { error: "Password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof LoginSchema>;

type FieldErrors = Partial<Record<keyof LoginValues, string>>;

type Touched = Partial<Record<keyof LoginValues, boolean>>;

function getFieldErrors(values: LoginValues): FieldErrors {
  const res = LoginSchema.safeParse(values);
  if (res.success) return {};
  const errs: FieldErrors = {};
  for (const issue of res.error.issues) {
    const key = String(issue.path[0]) as keyof LoginValues;
    if (!errs[key]) errs[key] = issue.message;
  }
  return errs;
}

export default function LoginClient({ nextParam }: { nextParam: string }) {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [values, setValues] = React.useState<LoginValues>({ email: "", password: "" });
  const [touched, setTouched] = React.useState<Touched>({});
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const setField = <K extends keyof LoginValues>(key: K, value: LoginValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      setErrors(getFieldErrors({ ...values, [key]: value } as LoginValues));
    }
  };

  const onBlur = <K extends keyof LoginValues>(key: K) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(getFieldErrors(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = getFieldErrors(values);
    if (Object.keys(fieldErrors).length > 0) {
      setTouched({ email: true, password: true });
      setErrors(fieldErrors);
      return;
    }
    setSubmitError(null);
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
      router.push(nextParam || "/");
    } catch (err: any) {
      setSubmitError(err?.message || "Login failed");
    }
  };

  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "100dvh", px: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 2, sm: 3 },
          background: (theme) =>
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, rgba(76,175,80,0.04), rgba(38,198,218,0.04))"
              : "none",
        }}
      >
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Welcome back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Log in to continue shopping farm‑fresh goodies.
            </Typography>
          </Box>

          <FormControl fullWidth required error={Boolean(touched.email && errors.email)}>
            <InputLabel htmlFor="login-email">Email</InputLabel>
            <Input
              id="login-email"
              type="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => onBlur("email")}
              aria-describedby="login-email-helper"
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </InputAdornment>
              }
            />
            <FormHelperText id="login-email-helper">{touched.email && errors.email ? errors.email : " "}</FormHelperText>
          </FormControl>

          <FormControl fullWidth required error={Boolean(touched.password && errors.password)}>
            <InputLabel htmlFor="login-password">Password</InputLabel>
            <Input
              id="login-password"
              type="password"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              onBlur={() => onBlur("password")}
              aria-describedby="login-password-helper"
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </InputAdornment>
              }
            />
            <FormHelperText id="login-password-helper">{touched.password && errors.password ? errors.password : " "}</FormHelperText>
          </FormControl>

          {submitError && (
            <Typography color="error" variant="body2">{submitError}</Typography>
          )}

          <Button type="submit" variant="contained" color="primary" size="large" disabled={loginMutation.isPending}>
            Log in
          </Button>

          <Divider>or</Divider>

          <Button component={Link} href={`/signup?next=${encodeURIComponent(nextParam || "/")}`} variant="outlined" color="secondary">
            Create an account
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
