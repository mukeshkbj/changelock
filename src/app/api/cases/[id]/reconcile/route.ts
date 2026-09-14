import { getDb } from "../../../../server/get-db";
import { getIntentCaseId } from "../../../../../infrastructure/db";
import { parseReconcileFormInput } from "../../../../../application/live-input";
import { reconcileUnknownCall } from "../../../../../application/reconcile-unknown";
import { createLiveCallProvider } from "../../../../../provider/calle-provider";
import { errMessage, redirectToCase } from "../_shared";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  if (process.env.CHANGELOCK_MODE !== "live") {
    return redirectToCase(id, "live mode is not enabled on this server");
  }
  const db = await getDb();
  try {
    const input = parseReconcileFormInput(await req.formData());
    const ownerCaseId = await getIntentCaseId(db, input.intentId);
    if (ownerCaseId && ownerCaseId !== id) {
      return redirectToCase(id, "intent does not belong to this case");
    }
    await reconcileUnknownCall(db, input, createLiveCallProvider());
    return redirectToCase(id);
  } catch (err) {
    return redirectToCase(id, errMessage(err));
  }
}
