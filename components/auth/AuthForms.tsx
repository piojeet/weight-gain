"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiArrowLeft, FiCheck, FiEye, FiEyeOff, FiLock, FiMail, FiPhone, FiShield, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z.string().trim().email("Enter a valid email address."),
    phone: z.string().regex(/^[+]?[0-9 ()-]{10,16}$/, "Enter a valid phone number."),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[A-Z]/, "Include one uppercase letter.")
      .regex(/[a-z]/, "Include one lowercase letter.")
      .regex(/[0-9]/, "Include one number.")
      .regex(/[^A-Za-z0-9]/, "Include one special character."),
    confirmPassword: z.string(),
    terms: z.boolean().refine(Boolean, "Accept the Terms of Service and Privacy Policy."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
const forgotSchema = z.object({ email: z.string().trim().email("Enter a valid email address.") });
type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

type FieldProps = React.ComponentProps<typeof Input> & { label: string; icon: typeof FiMail; error?: string };
function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-left text-[9px] text-red-500">{message}</p> : null;
}
function Field({ label, icon: Icon, error, ...props }: FieldProps) {
  return (
    <label className="mt-3 grid gap-1 text-left text-[9px] font-bold text-navy">
      <span>{label}</span>
      <span className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-soft" size={14} />
        <Input {...props} className="h-10 pl-9 text-xs" aria-invalid={Boolean(error)} />
      </span>
      <ErrorText message={error} />
    </label>
  );
}
function Divider() {
  return (
    <div className="my-4 flex items-center gap-3 text-[9px] text-slate-soft">
      <span className="h-px flex-1 bg-line" />
      or continue with
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
function SocialButtons() {
  return (
    <div className="flex items-center justify-center">
      <Button type="button" variant="outline" size="sm">
        <FcGoogle /> Google
      </Button>
    </div>
  );
}
function PasswordField({ label, error, ...props }: React.ComponentProps<typeof Input> & { label: string; error?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="mt-3 grid gap-1 text-left text-[9px] font-bold text-navy">
      <span>{label}</span>
      <span className="relative">
        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-soft" size={14} />
        <Input {...props} type={visible ? "text" : "password"} className="h-10 px-9 text-xs" aria-invalid={Boolean(error)} />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((value) => !value)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-soft"
        >
          {visible ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      </span>
      <ErrorText message={error} />
    </label>
  );
}

function mapAuthError(error: unknown) {
  if (error instanceof ApiError) return error;
  if (error instanceof Error) return new ApiError(0, "CLIENT_ERROR", error.message);
  return new ApiError(0, "CLIENT_ERROR", "An unexpected error occurred.");
}

function describeAuthError(error: ApiError) {
  if (!error.status) return error.message;
  return `${error.message} (HTTP ${error.status}, ${error.code})`;
}

export function LoginForm() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(true);
  const [totpRequired, setTotpRequired] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const submit = async (values: LoginValues) => {
    setServerError(null);
    setInfo(null);
    try {
      await authApi.login({
        email: values.email,
        password: values.password,
        rememberMe,
        ...(totpRequired ? { totpCode } : {}),
      });
      router.push("/my-account/dashboard");
    } catch (caught) {
      const error = mapAuthError(caught);
      if (error.code === "TWO_FACTOR_REQUIRED") {
        setTotpRequired(true);
        setServerError("Enter the 6-digit code from your authenticator app.");
        return;
      }
      if (error.code === "EMAIL_NOT_VERIFIED") {
        setPendingEmail(values.email);
        setServerError("Verify your email before signing in.");
        return;
      }
      if (error.code === "ACCOUNT_LOCKED") {
        const until = (error.payload as { lockedUntil?: string } | null)?.lockedUntil;
        setServerError(until ? `Account locked until ${new Date(until).toLocaleString()}.` : "Account locked. Try again later.");
        return;
      }
      setServerError(describeAuthError(error));
    }
  };

  return (
    <>
      <h1 className="mt-7 text-xl font-extrabold">Welcome Back!</h1>
      <p className="mt-2 text-[10px] leading-4 text-slate-soft">
        Log in to your account and continue your
        <br />
        wellness journey.
      </p>
      <form onSubmit={handleSubmit(submit)} className="mt-5">
        <Field label="Email Address" icon={FiMail} placeholder="Enter your email address" {...register("email")} error={errors.email?.message} />
        <PasswordField label="Password" placeholder="Enter your password" {...register("password")} error={errors.password?.message} />
        {totpRequired && (
          <Field
            label="Authenticator code"
            icon={FiShield}
            placeholder="123456"
            value={totpCode}
            onChange={(event) => setTotpCode(event.target.value)}
          />
        )}
        <div className="mt-3 flex items-center justify-between text-[8px]">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="accent-green-600" /> Remember me
          </label>
          <Link href="/forgot-password" className="font-bold text-green-600">
            Forgot Password?
          </Link>
        </div>
        {serverError && <p className="mt-3 text-[9px] font-bold text-red-500">{serverError}</p>}
        {info && <p className="mt-3 text-[9px] font-bold text-green-600">{info}</p>}
        {pendingEmail && (
          <button
            type="button"
            className="mt-2 text-[9px] font-bold text-green-600"
            onClick={async () => {
              await authApi.resendVerification(pendingEmail || getValues("email"));
              setInfo("If an unverified account exists, a new link was sent.");
            }}
          >
            Resend verification email
          </button>
        )}
        <Button className="mt-4 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Log In"}
        </Button>
      </form>
      <Divider />
      <SocialButtons />
      <p className="mt-5 text-[10px] text-slate-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-green-600">
          Sign up
        </Link>
      </p>
    </>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailHint, setEmailHint] = useState<string | null>(null);
  const [phoneHint, setPhoneHint] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema), defaultValues: { terms: false } });
  const email = watch("email");
  const phone = watch("phone");

  useEffect(() => {
    if (!email || !email.includes("@")) return;
    const timer = window.setTimeout(async () => {
      try {
        const result = await authApi.checkAvailability({ email });
        setEmailHint(result.available ? "Email is available." : "This email is already registered.");
      } catch {
        setEmailHint(null);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (!phone || phone.length < 10) return;
    const timer = window.setTimeout(async () => {
      try {
        const result = await authApi.checkAvailability({ phone });
        setPhoneHint(result.available ? "Phone is available." : "This phone is already registered.");
      } catch {
        setPhoneHint(null);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [phone]);

  const submit = async (values: SignupValues) => {
    setServerError(null);
    try {
      await authApi.signup({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setSubmitted(true);
      router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (caught) {
      const error = mapAuthError(caught);
      setServerError(describeAuthError(error));
    }
  };

  return (
    <>
      <h1 className="mt-7 text-xl font-extrabold">Create Your Account</h1>
      <p className="mt-2 text-[10px] leading-4 text-slate-soft">
        Join TheGrowthHealth and start your journey to a
        <br />
        healthier, stronger you.
      </p>
      <form onSubmit={handleSubmit(submit)} className="mt-5">
        <Field label="Full Name" icon={FiUser} placeholder="Enter your full name" {...register("fullName")} error={errors.fullName?.message} />
        <Field label="Email Address" icon={FiMail} placeholder="Enter your email address" {...register("email")} error={errors.email?.message} />
        {emailHint && <p className="text-left text-[8px] text-slate-soft">{emailHint}</p>}
        <Field label="Phone Number" icon={FiPhone} placeholder="Enter your phone number" {...register("phone")} error={errors.phone?.message} />
        {phoneHint && <p className="text-left text-[8px] text-slate-soft">{phoneHint}</p>}
        <PasswordField label="Password" placeholder="Create a password" {...register("password")} error={errors.password?.message} />
        <PasswordField label="Confirm Password" placeholder="Confirm your password" {...register("confirmPassword")} error={errors.confirmPassword?.message} />
        <div className="mt-3 rounded border border-green-100 bg-[#f4fbf5] p-2 text-left text-[8px] leading-4 text-slate-soft">
          <p>
            <FiCheck className="mr-1 inline text-green-600" />
            At least 8 characters long
          </p>
          <p>
            <FiCheck className="mr-1 inline text-green-600" />
            Uppercase, lowercase, number, and special character
          </p>
        </div>
        <label className="mt-3 flex items-start gap-2 text-left text-[8px] text-slate-soft">
          <input type="checkbox" {...register("terms")} className="mt-0.5 accent-green-600" />I agree to the{" "}
          <Link href="/terms-of-service" className="font-bold text-green-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="font-bold text-green-600">
            Privacy Policy
          </Link>
        </label>
        <ErrorText message={errors.terms?.message} />
        {serverError && <p className="mt-3 text-[9px] font-bold text-red-500">{serverError}</p>}
        {submitted && <p role="status" className="mt-3 text-[9px] font-bold text-green-600">Account created. Check your email to verify.</p>}
        <Button className="mt-3 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
        </Button>
      </form>
      <Divider />
      <SocialButtons />
      <p className="mt-5 text-[10px] text-slate-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-green-600">
          Log in
        </Link>
      </p>
    </>
  );
}

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema) });

  return (
    <>
      <div className="mt-7 flex justify-start">
        <Link href="/login" className="flex items-center gap-1 text-[9px] font-bold text-green-600">
          <FiArrowLeft /> Back to Login
        </Link>
      </div>
      <h1 className="mt-7 text-xl font-extrabold">Forgot Password?</h1>
      <p className="mt-2 text-[10px] leading-4 text-slate-soft">
        No worries! Enter your email address and we&apos;ll
        <br />
        send you a link to reset your password.
      </p>
      <form
        onSubmit={handleSubmit(async (values) => {
          setServerError(null);
          try {
            await authApi.forgotPassword(values.email);
            setSubmitted(true);
          } catch (caught) {
            setServerError(describeAuthError(mapAuthError(caught)));
          }
        })}
        className="mt-5"
      >
        <Field label="Email Address" icon={FiMail} placeholder="Enter your email address" {...register("email")} error={errors.email?.message} />
        {submitted && (
          <p role="status" className="mt-3 text-[9px] font-bold text-green-600">
            If an account exists for this email, a reset link has been sent.
          </p>
        )}
        {serverError && <p className="mt-3 text-[9px] font-bold text-red-500">{serverError}</p>}
        <Button className="mt-4 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
      <div className="mt-4 rounded border border-green-100 bg-[#f4fbf5] p-3 text-left">
        <p className="text-[9px] font-extrabold">
          <FiShield className="mr-1 inline text-green-600" />
          Secure Process
        </p>
        <p className="mt-1 text-[8px] leading-3 text-slate-soft">We&apos;ll send a password reset link to your email. Please check your inbox and spam folder.</p>
      </div>
      <Divider />
      <Button type="button" variant="outline" className="w-full">
        <FiPhone /> Reset via Phone Number
      </Button>
      <p className="mt-6 text-[10px] text-slate-soft">
        Remember your password?{" "}
        <Link href="/login" className="font-bold text-green-600">
          Log in
        </Link>
      </p>
    </>
  );
}
