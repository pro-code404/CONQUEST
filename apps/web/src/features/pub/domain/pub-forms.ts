export interface SignUpFormInput {
  displayName: string;
  email: string;
  password: string;
  orgName?: string;
}

export function validateSignUp(input: SignUpFormInput): string | null {
  if (!input.displayName.trim()) return "Full name is required";
  if (!input.email.includes("@")) return "Enter a valid email";
  if (input.password.length < 8) return "Password must be at least 8 characters";
  return null;
}

export interface WorkspaceFormInput {
  workspaceName: string;
  workspaceType: string;
  primaryGoal: string;
}

export function validateWorkspaceForm(input: WorkspaceFormInput): string | null {
  if (!input.workspaceName.trim()) return "Workspace name is required";
  if (!input.workspaceType.trim()) return "Workspace type is required";
  if (!input.primaryGoal.trim()) return "Primary goal is required";
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email.includes("@")) return "Enter a valid email";
  return null;
}

export function validatePasswordPair(password: string, confirm: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password !== confirm) return "Passwords must match";
  return null;
}

export function parseFormData(form: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((key) => [key, String(form.get(key) ?? "").trim()]));
}
