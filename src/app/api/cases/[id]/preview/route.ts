import { getDb } from "../../../../server/get-db";
import { createPreview } from "../../../../../application/create-preview";
import { errMessage, redirectToCase } from "../_shared";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  try {
    await createPreview(await getDb(), id);
    return redirectToCase(id);
  } catch (err) {
    return redirectToCase(id, errMessage(err));
  }
}
