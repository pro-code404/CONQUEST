import { type FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  OrganizationMembersView,
  OrganizationOverviewView,
} from "@conquest/presentation";
import { GisState, GisStateLabels } from "@conquest/gis";
import type { OrganizationMemberView, OrganizationSettingsView, PendingOrgInviteView, UserRole } from "@conquest/contracts";
import * as client from "../../auth/client.js";
import { ROUTES } from "../../shared/config/routes.js";
import { logScreenEvent } from "../../shared/infrastructure/telemetry.js";

function SettingsBackLink() {
  return (
    <p>
      <Link to={ROUTES.settings.home}>← Settings</Link>
    </p>
  );
}

/** SET-17 — Organization overview */
export function OrganizationSettingsScreen() {
  const [org, setOrg] = useState<OrganizationSettingsView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    logScreenEvent("SET-17", "view");
    client
      .fetchOrganizationSettings()
      .then((data) => setOrg(data.organization))
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SettingsBackLink />
      <OrganizationOverviewView
        organization={org}
        loading={loading}
        error={error}
        membersHref={ROUTES.settings.organizationMembers}
      />
    </>
  );
}

/** Organization member directory */
export function OrganizationMembersScreen() {
  const [members, setMembers] = useState<OrganizationMemberView[]>([]);
  const [invites, setInvites] = useState<PendingOrgInviteView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function load() {
    setLoading(true);
    client
      .fetchOrganizationMembers()
      .then((data) => {
        setMembers(data.members);
        setInvites(data.invites);
      })
      .catch((err: Error) => setError(err.message.replace(/^\d+:\s*/, "")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    logScreenEvent("ORG-MEMBERS", "view");
    load();
  }, []);

  async function onInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email"));
    const role = String(data.get("role")) as "admin" | "manager" | "member" | "viewer";
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      await client.inviteOrganizationMember({ email, role });
      setMessage("Invitation sent.");
      event.currentTarget.reset();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
      setLoading(false);
    }
  }

  async function onRoleChange(userId: string, role: UserRole) {
    if (role === "owner") return;
    setError(null);
    setLoading(true);
    try {
      const result = await client.updateOrganizationMemberRole(userId, { role });
      setMembers(result.members);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  async function onRemove(userId: string) {
    setError(null);
    setLoading(true);
    try {
      const result = await client.removeOrganizationMember(userId);
      setMembers(result.members);
      setMessage("Member removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message.replace(/^\d+:\s*/, "") : GisStateLabels[GisState.Error]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p>
        <Link to={ROUTES.settings.organization}>← Organization</Link>
      </p>
      <OrganizationMembersView
        members={members}
        invites={invites}
        loading={loading}
        error={error}
        message={message}
        onInvite={(event) => void onInvite(event)}
        onRoleChange={(userId, role) => void onRoleChange(userId, role)}
        onRemove={(userId) => void onRemove(userId)}
      />
    </>
  );
}
