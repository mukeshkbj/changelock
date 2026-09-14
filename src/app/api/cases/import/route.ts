import { getDb } from "../../../server/get-db";
import { parseJudgeCaseForm } from "../../../../application/live-input";
import { createJudgeCase } from "../../../../application/create-judge-case";
import { errMessage, redirectTo } from "../[id]/_shared";

// Judge-facing synthetic case import. Replay-only by design: the live-mode
// refusal runs before getDb so a live deployment never touches the database
// on this path, and no CALL-E provider is imported or invoked here. Errors
// redirect back to the inbox with a safe message.
export async function POST(req: Request): Promise<Response> {
  if (process.env.CHANGELOCK_MODE === "live") {
    return redirectTo("/", "Synthetic case creation is unavailable in live mode.");
  }
  const db = await getDb();
  try {
    const input = parseJudgeCaseForm(await req.formData());
    const caseId = await createJudgeCase(db, input);
    return redirectTo(`/cases/${caseId}`);
  } catch (err) {
    return redirectTo("/", errMessage(err));
  }
}
