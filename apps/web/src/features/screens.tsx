import { type FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GisState, GisStateLabels } from "@conquest/gis";
import {
  AuthFormView,
  LandingPageView,
  PublicAuthLayout,
  authLinkStyle,
} from "@conquest/presentation";
import { useAuth } from "../auth/AuthContext.js";
import { readReturnTo, resolveAuthenticatedPath } from "../auth/routing.js";
import { ROUTES } from "../shared/config/routes.js";
import { logScreenEvent } from "../shared/infrastructure/telemetry.js";
import { parseFormData, validateEmail, validatePasswordPair, validateSignUp, validateWorkspaceForm } from "./pub/domain/pub-forms.js";
import type { OnboardingStage } from "@conquest/auth";
import * as client from "../auth/client.js";
import { OnboardingStepView } from "@conquest/presentation";
import { spacing, typography, color } from "@conquest/gis";
import { authButtonStyle } from "@conquest/presentation";

const ONB01_BEATS = [
  "Command Center is your daily intelligence cockpit.",
  "Your workspace scopes everything you see and do.",
  "Connect data to activate intelligence — Conquest works in the background.",
  "You decide — recommendations require your approval.",
] as const;

/** PUB-01 */
export function LandingScreen() {
  logScreenEvent("PUB-01", "view");
  return <LandingPageView signUpHref={ROUTES.signup} loginHref={ROUTES.login} />;
}

/** PUB-02 */
export function SignUpScreen() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = parseFormData(new FormData(event.currentTarget), [
      "displayName",
      "email",
      "password",
      "orgName",
    ]);
    const validation = validateSignUp({
      displayName: data.displayName!,
      email: data.email!,
      password: data.password!,
      ...(data.orgName ? { orgName: data.orgName } : {}),
    });
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { user, verificationToken } = await signUp({
        email: data.email!,
        password: data.password!,
        displayName: data.displayName!,
        ...(data.orgName ? { orgName: data.orgName } : {}),
      });
      logScreenEvent("PUB-02", "success");
      navigate(
        verificationToken
          ? `${ROUTES.verifyEmail}?token=${encodeURIComponent(verificationToken)}`
          : resolveAuthenticatedPath(user),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout
      title="Create your account"
      subtitle="Start with your Intelligence Command Center"
      footer={
        <p>
          Already have an account?{" "}
          <Link to={ROUTES.login} style={authLinkStyle}>
            Sign in
          </Link>
        </p>
      }
    >
      <AuthFormView
        fields={[
          { id: "displayName", name: "displayName", label: "Full name", required: true },
          { id: "email", name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
          {
            id: "password",
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "new-password",
            required: true,
            minLength: 8,
          },
          { id: "orgName", name: "orgName", label: "Organization (optional)" },
        ]}
        submitLabel="Create account"
        loadingLabel={GisStateLabels[GisState.Load]}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />
    </PublicAuthLayout>
  );
}

/** PUB-03 */
export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const data = parseFormData(new FormData(event.currentTarget), ["email", "password"]);
    try {
      const user = await login({ email: data.email!, password: data.password! });
      logScreenEvent("PUB-03", "success");
      navigate(readReturnTo(`?${params.toString()}`) ?? resolveAuthenticatedPath(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout
      title="Sign in to Conquest"
      subtitle="Access your Intelligence Command Center"
      footer={
        <p>
          <Link to={ROUTES.forgotPassword} style={authLinkStyle}>
            Forgot password?
          </Link>
          {" · "}
          New to Conquest?{" "}
          <Link to={ROUTES.signup} style={authLinkStyle}>
            Create an account
          </Link>
        </p>
      }
    >
      <AuthFormView
        fields={[
          { id: "email", name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
          {
            id: "password",
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "current-password",
            required: true,
          },
        ]}
        submitLabel="Sign in"
        loadingLabel={GisStateLabels[GisState.Load]}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />
    </PublicAuthLayout>
  );
}

/** PUB-04 */
export function VerifyEmailScreen() {
  const { user, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [token, setToken] = useState(params.get("token") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const verified = await verifyEmail(token.trim());
      logScreenEvent("PUB-04", "verified");
      navigate(resolveAuthenticatedPath(verified));
    } catch (err) {
      setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout title="Verify your email" subtitle="Check your inbox or enter your verification code.">
      <form onSubmit={onSubmit} aria-busy={loading}>
        <label htmlFor="token">Verification token</label>
        <input id="token" name="token" value={token} onChange={(e) => setToken(e.target.value)} required />
        {error ? <p role="alert">{error}</p> : null}
        {user && !user.emailVerified ? (
          <p role="status" style={{ color: color.textSecondary }}>
            {GisStateLabels[GisState.Empty]} — awaiting verification.
          </p>
        ) : null}
        <button
          type="button"
          onClick={async () => {
            setResendMessage(null);
            setError(null);
            try {
              const result = await client.resendVerificationEmail();
              setResendMessage(
                result.verificationToken
                  ? `Verification email sent. Dev token: ${result.verificationToken}`
                  : "If eligible, a new verification email will be sent.",
              );
              logScreenEvent("PUB-04", "resend");
            } catch (err) {
              setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
            }
          }}
        >
          Resend email
        </button>
        {resendMessage ? <p role="status">{resendMessage}</p> : null}
        <button type="submit" disabled={loading}>
          {loading ? GisStateLabels[GisState.Load] : "Verify email"}
        </button>
      </form>
    </PublicAuthLayout>
  );
}

/** PUB-05 */
export function ForgotPasswordScreen() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = parseFormData(new FormData(event.currentTarget), ["email"]);
    const validation = validateEmail(data.email!);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await client.requestPasswordReset(data.email!);
      setMessage(result.message);
      logScreenEvent("PUB-05", "submitted");
    } catch (err) {
      setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout
      title="Reset your password"
      subtitle="Enter your email and we will send a reset link if an account exists."
      footer={
        <Link to={ROUTES.login} style={authLinkStyle}>
          Back to login
        </Link>
      }
    >
      {message ? (
        <p role="status">{message}</p>
      ) : (
        <AuthFormView
          fields={[{ id: "email", name: "email", label: "Email", type: "email", required: true }]}
          submitLabel="Send reset link"
          loadingLabel={GisStateLabels[GisState.Load]}
          loading={loading}
          error={error}
          onSubmit={onSubmit}
        />
      )}
    </PublicAuthLayout>
  );
}

/** PUB-06 */
export function ResetPasswordScreen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = parseFormData(new FormData(event.currentTarget), ["password", "confirmPassword"]);
    const validation = validatePasswordPair(data.password!, data.confirmPassword!);
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      await client.resetPassword(token, data.password!);
      logScreenEvent("PUB-06", "success");
      navigate(ROUTES.login);
    } catch (err) {
      setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout title="Choose a new password" subtitle="Enter a strong password for your account.">
      <AuthFormView
        fields={[
          { id: "password", name: "password", label: "New password", type: "password", required: true, minLength: 8 },
          {
            id: "confirmPassword",
            name: "confirmPassword",
            label: "Confirm password",
            type: "password",
            required: true,
            minLength: 8,
          },
        ]}
        submitLabel="Update password"
        loadingLabel={GisStateLabels[GisState.Load]}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />
    </PublicAuthLayout>
  );
}

/** PUB-07 */
export function InviteAcceptScreen() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [preview, setPreview] = useState<{ workspaceName: string; role: string; inviterName: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    client
      .fetchInvitePreview(token)
      .then(setPreview)
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")));
  }, [token]);

  async function accept() {
    if (!user) {
      navigate(ROUTES.login);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await client.acceptInvite(token);
      await refresh();
      logScreenEvent("PUB-07", "accepted");
      navigate(ROUTES.app.home);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout title="Workspace invitation" subtitle="Join your team on Conquest.">
      {error ? <p role="alert">{error}</p> : null}
      {preview ? (
        <>
          <p>
            {preview.inviterName} invited you to <strong>{preview.workspaceName}</strong> as {preview.role}.
          </p>
          {user ? (
            <button type="button" style={authButtonStyle} disabled={loading} onClick={() => void accept()}>
              {loading ? GisStateLabels[GisState.Load] : "Accept invitation"}
            </button>
          ) : (
            <>
              <button type="button" style={authButtonStyle} onClick={() => navigate(ROUTES.signup)}>
                Create account
              </button>
              <button type="button" style={authButtonStyle} onClick={() => navigate(ROUTES.login)}>
                Sign in
              </button>
            </>
          )}
        </>
      ) : (
        <p role="status">{GisStateLabels[GisState.Load]}</p>
      )}
    </PublicAuthLayout>
  );
}

async function setStage(stage: OnboardingStage) {
  return client.setOnboardingStage(stage);
}

/** ONB-01 */
export function OnboardingWelcomeScreen() {
  const navigate = useNavigate();
  return (
    <OnboardingStepView
      title="Welcome to Conquest"
      subtitle="Conquest is your Intelligence Command Center."
      primaryAction={{
        label: "Continue",
        onClick: () => {
          void setStage("orientation").then(() => navigate(ROUTES.onboarding.orientation));
        },
      }}
    >
      <ul style={{ paddingLeft: spacing.lg }}>
        {ONB01_BEATS.map((beat) => (
          <li key={beat} style={{ marginBottom: spacing.sm, lineHeight: typography.lineHeightNormal }}>
            {beat}
          </li>
        ))}
      </ul>
    </OnboardingStepView>
  );
}

/** ONB-02 */
export function OnboardingOrientationScreen() {
  const navigate = useNavigate();
  return (
    <OnboardingStepView
      title="How Conquest works"
      subtitle="Intelligence runs in the background. You stay in control."
      primaryAction={{
        label: "Create your workspace",
        onClick: () => {
          void setStage("workspace").then(() => navigate(ROUTES.onboarding.workspace));
        },
      }}
    >
      <p>
        Conquest observes, understands, and recommends — but never acts on major decisions without your approval.
      </p>
    </OnboardingStepView>
  );
}

/** ONB-03 */
export function OnboardingWorkspaceScreen() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = parseFormData(new FormData(event.currentTarget), [
      "workspaceName",
      "workspaceType",
      "primaryGoal",
    ]);
    const validation = validateWorkspaceForm({
      workspaceName: data.workspaceName!,
      workspaceType: data.workspaceType!,
      primaryGoal: data.primaryGoal!,
    });
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    try {
      await completeOnboarding({
        workspaceName: data.workspaceName!,
        workspaceType: data.workspaceType!,
        primaryGoal: data.primaryGoal!,
      });
      logScreenEvent("ONB-03", "workspace_created");
      navigate(ROUTES.onboarding.connect);
    } catch (err) {
      setError(err instanceof Error ? err.message : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicAuthLayout title="Create your workspace" subtitle="Define the context for your intelligence.">
      <AuthFormView
        fields={[
          { id: "workspaceName", name: "workspaceName", label: "Workspace name", required: true },
          { id: "workspaceType", name: "workspaceType", label: "Workspace type", required: true },
          { id: "primaryGoal", name: "primaryGoal", label: "Primary goal", required: true },
        ]}
        submitLabel="Create workspace"
        loadingLabel={GisStateLabels[GisState.Load]}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />
    </PublicAuthLayout>
  );
}

/** ONB-04 */
export function OnboardingConnectScreen() {
  const navigate = useNavigate();
  return (
    <OnboardingStepView
      title="Connect your first data source"
      subtitle="Intelligence activates when Conquest can observe your workspace."
      primaryAction={{
        label: "Connect a source",
        onClick: () => {
          void setStage("initializing").then(() => navigate(ROUTES.onboarding.initializing));
        },
      }}
      secondaryAction={{
        label: "Skip for now (Command Center stays dormant)",
        onClick: () => {
          void client.finishOnboarding().then(() => navigate(ROUTES.app.home));
        },
      }}
    >
      <p>Recommended: CRM, analytics, or knowledge base for your workspace type.</p>
    </OnboardingStepView>
  );
}

/** ONB-05 */
export function OnboardingInitializingScreen() {
  const navigate = useNavigate();
  return (
    <OnboardingStepView
      title="Initializing intelligence"
      subtitle="Conquest is preparing your first insights."
      primaryAction={{
        label: "Continue",
        onClick: () => {
          void setStage("complete").then(() => navigate(ROUTES.onboarding.complete));
        },
      }}
    >
      <p role="status" aria-busy="true">
        {GisStateLabels[GisState.Load]} — analyzing connected sources…
      </p>
    </OnboardingStepView>
  );
}

/** ONB-06 */
export function OnboardingCompleteScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function goToCommandCenter() {
    await client.finishOnboarding();
    if (user?.activeWorkspaceId) {
      navigate(ROUTES.app.commandCenter(user.activeWorkspaceId));
    } else {
      navigate(ROUTES.app.home);
    }
  }

  return (
    <OnboardingStepView
      title="You're ready"
      subtitle="Your workspace is set up. Conquest will surface recommendations as intelligence arrives."
      primaryAction={{ label: "Go to Command Center", onClick: () => void goToCommandCenter() }}
    >
      <p>Next: review recommendations, connect more sources, or generate your first report.</p>
    </OnboardingStepView>
  );
}
