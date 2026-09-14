import {
  JUDGE_FIELDS_ERROR,
  parseJudgeCaseInput,
  type JudgeCaseInput,
} from "./create-judge-case";

export interface LiveFormInput {
  typedPhrase: string;
  attestedConsentingContact: boolean;
}

export interface ReconcileFormInput {
  intentId: string;
  providerCallId: string;
}

export interface EscalateFormInput {
  intentId: string;
}

const UNEXPECTED_FIELDS = "Unexpected form fields were rejected.";

function requireOnly(form: FormData, allowed: readonly string[]): void {
  const keys = new Set(allowed);
  if ([...form.keys()].some((k) => !keys.has(k))) {
    throw new Error(UNEXPECTED_FIELDS);
  }
}

function requireString(form: FormData, key: string, message: string): string {
  const value = form.get(key);
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(message);
  }
  return value;
}

export function parseLiveFormInput(form: FormData): LiveFormInput {
  requireOnly(form, ["typedPhrase", "attestedConsentingContact"]);
  const typedPhrase = requireString(form, "typedPhrase", "typed phrase is required");
  if (form.get("attestedConsentingContact") !== "on") {
    throw new Error("consenting-contact attestation is required");
  }
  return { typedPhrase, attestedConsentingContact: true };
}

export function parseReconcileFormInput(form: FormData): ReconcileFormInput {
  requireOnly(form, ["intentId", "providerCallId"]);
  return {
    intentId: requireString(form, "intentId", "intent id is required"),
    providerCallId: requireString(form, "providerCallId", "call id is required"),
  };
}

export function parseEscalateFormInput(form: FormData): EscalateFormInput {
  requireOnly(form, ["intentId"]);
  return { intentId: requireString(form, "intentId", "intent id is required") };
}

export function parseResetFormInput(form: FormData): void {
  requireOnly(form, []);
}

export function parseJudgeCaseForm(form: FormData): JudgeCaseInput {
  requireOnly(form, ["vendorCode", "sourceReference", "requestContactName", "lastFour"]);
  return parseJudgeCaseInput({
    vendorCode: requireString(form, "vendorCode", JUDGE_FIELDS_ERROR),
    sourceReference: requireString(form, "sourceReference", JUDGE_FIELDS_ERROR),
    requestContactName: requireString(form, "requestContactName", JUDGE_FIELDS_ERROR),
    lastFour: requireString(form, "lastFour", JUDGE_FIELDS_ERROR),
  });
}
