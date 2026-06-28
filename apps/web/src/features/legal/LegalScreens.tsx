import { LegalPageView } from "@conquest/presentation";
import { LEGAL_DOCUMENT_VERSIONS } from "@conquest/contracts";

export function PrivacyPolicyScreen() {
  return (
    <LegalPageView title="Privacy Policy">
      <p>
        This privacy policy describes how Conquest collects, uses, and protects information. Version{" "}
        {LEGAL_DOCUMENT_VERSIONS.privacy}.
      </p>
      <p>We process account data to provide the service, maintain security, and improve product quality.</p>
      <p>GDPR and CCPA rights are honored through settings export and deletion requests.</p>
    </LegalPageView>
  );
}

export function TermsOfServiceScreen() {
  return (
    <LegalPageView title="Terms of Service">
      <p>
        These terms govern use of the Conquest platform (version {LEGAL_DOCUMENT_VERSIONS.terms}). By using Conquest
        you agree to these terms.
      </p>
    </LegalPageView>
  );
}

export function CookiePolicyScreen() {
  return (
    <LegalPageView title="Cookie Policy">
      <p>
        Conquest uses essential session cookies for authentication (policy version {LEGAL_DOCUMENT_VERSIONS.cookies}).
        Analytics cookies are not enabled unless you opt in through future product settings.
      </p>
    </LegalPageView>
  );
}

export function AiTransparencyScreen() {
  return (
    <LegalPageView title="AI Transparency">
      <p>
        Conquest uses AI to assist with analysis and recommendations. Outputs are verified and require human approval
        for consequential actions. Transparency indicators cannot be disabled.
      </p>
    </LegalPageView>
  );
}

export function SecurityPageScreen() {
  return (
    <LegalPageView title="Security">
      <p>
        Conquest employs tenant isolation, encrypted credentials, session management, and audit logging. Report
        security issues through your organization administrator.
      </p>
    </LegalPageView>
  );
}
