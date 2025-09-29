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
import { PersonOutline as PersonIcon, EmailOutlined as EmailIcon, LockOutlined as LockIcon } from "@mui/icons-material";
import * as z from "zod";
import { useSignupMutation } from "@/app/lib/queries";

const SignupSchema = z.strictObject({
  name: z.string().min(2, { error: "Please enter your name (min 2 characters)" }),
  email: z.email({ error: "Please enter a valid email address" }),
  password: z.string().min(6, { error: "Password must be at least 6 characters" }),
});

type SignupValues = z.infer<typeof SignupSchema>;

type FieldErrors = Partial<Record<keyof SignupValues, string>>;

type Touched = Partial<Record<keyof SignupValues, boolean>>;

function getFieldErrors(values: SignupValues): FieldErrors {
  const res = SignupSchema.safeParse(values);
  if (res.success) return {};
  const errs: FieldErrors = {};
  for (const issue of res.error.issues) {
    const key = String(issue.path[0]) as keyof SignupValues;
    if (!errs[key]) errs[key] = issue.message;
  }
  return errs;
}

export default function SignupClient({ nextParam }: { nextParam: string }) {
  const router = useRouter();
  const signupMutation = useSignupMutation();
  const [values, setValues] = React.useState<SignupValues>({ name: "", email: "", password: "" });
  const [touched, setTouched] = React.useState<Touched>({});
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const setField = <K extends keyof SignupValues>(key: K, value: SignupValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (touched[key]) {
      setErrors(getFieldErrors({ ...values, [key]: value } as SignupValues));
    }
  };

  const onBlur = <K extends keyof SignupValues>(key: K) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(getFieldErrors(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = getFieldErrors(values);
    if (Object.keys(fieldErrors).length > 0) {
      setTouched({ name: true, email: true, password: true });
      setErrors(fieldErrors);
      return;
    }
    setSubmitError(null);
    try {
      await signupMutation.mutateAsync({ name: values.name, email: values.email, password: values.password });
      router.push(nextParam || "/");
    } catch (err: any) {
      setSubmitError(err?.message || "Signup failed");
    }
  };

  return (
    <Box sx={{ display: "grid", placeItems: "center", minHeight: "100dvh", px: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
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
              Create your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Bob&apos;s Corn for faster checkout and order history.
            </Typography>
          </Box>

          <FormControl fullWidth error={Boolean(touched.name && errors.name)}>
            <InputLabel htmlFor="signup-name">Full name</InputLabel>
            <Input
              id="signup-name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => onBlur("name")}
              aria-describedby="signup-name-helper"
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </InputAdornment>
              }
            />
            <FormHelperText id="signup-name-helper">{touched.name && errors.name ? errors.name : " "}</FormHelperText>
          </FormControl>

          <FormControl fullWidth required error={Boolean(touched.email && errors.email)}>
            <InputLabel htmlFor="signup-email">Email</InputLabel>
            <Input
              id="signup-email"
              type="email"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => onBlur("email")}
              aria-describedby="signup-email-helper"
              startAdornment={
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </InputAdornment>
              }
            />
            <FormHelperText id="signup-email-helper">{touched.email && errors.email ? errors.email : " "}</FormHelperText>
          </FormControl>

          <FormControl fullWidth required error={Boolean(touched.password && errors.password)}>
            <InputLabel htmlFor="signup-password">Password</InputLabel>
            <Input
              id="signup-password"
              type="password"
              value={values.password}
              onChange={(e) => setField("password", e.target.value)}
              onBlur={() => onBlur("password")}
              aria-describedby="signup-password-helper"
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon sx={{ fontSize: 20, opacity: 0.8 }} />
                </InputAdornment>
              }
            />
            <FormHelperText id="signup-password-helper">{touched.password && errors.password ? errors.password : " "}</FormHelperText>
          </FormControl>

          {submitError && (
            <Typography color="error" variant="body2">{submitError}</Typography>
          )}

          <Button type="submit" variant="contained" color="primary" size="large" disabled={signupMutation.isPending}>
            Sign up
          </Button>

          <Divider>or</Divider>

          <Button component={Link} href="/login" variant="outlined" color="secondary">
            I already have an account
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
