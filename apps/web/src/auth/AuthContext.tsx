import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as client from "./client.js";
import type { SessionUser } from "./types.js";

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  signUp: (body: Parameters<typeof client.signUp>[0]) => Promise<{ user: SessionUser; verificationToken?: string }>;
  login: (body: Parameters<typeof client.login>[0]) => Promise<SessionUser>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<SessionUser>;
  completeOnboarding: (body: {
    workspaceName: string;
    workspaceType: string;
    primaryGoal: string;
  }) => Promise<SessionUser>;
  selectWorkspace: (workspaceId: string) => Promise<SessionUser>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEVICE_KEY = "conquest_device_id";

function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const session = await client.fetchSession();
    setUser(session);
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const signUp = useCallback(async (body: Parameters<typeof client.signUp>[0]) => {
    const result = await client.signUp(body);
    setUser(result.user);
    if (result.verificationToken !== undefined) {
      return { user: result.user, verificationToken: result.verificationToken };
    }
    return { user: result.user };
  }, []);

  const login = useCallback(async (body: Parameters<typeof client.login>[0]) => {
    const result = await client.login({ ...body, deviceId: getDeviceId() });
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await client.logout();
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    const result = await client.verifyEmail(token);
    setUser(result.user);
    return result.user;
  }, []);

  const completeOnboarding = useCallback(async (body: Parameters<typeof client.completeOnboarding>[0]) => {
    const result = await client.completeOnboarding(body);
    setUser(result.user);
    return result.user;
  }, []);

  const selectWorkspace = useCallback(async (workspaceId: string) => {
    const result = await client.selectWorkspace(workspaceId);
    setUser(result.user);
    return result.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      login,
      logout,
      verifyEmail,
      completeOnboarding,
      selectWorkspace,
      refresh,
    }),
    [user, loading, signUp, login, logout, verifyEmail, completeOnboarding, selectWorkspace, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
