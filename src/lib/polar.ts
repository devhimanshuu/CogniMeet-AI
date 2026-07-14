import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});

type CustomerState = Awaited<ReturnType<typeof polarClient.customers.getStateExternal>>;

/**
 * Fetch a customer's subscription state without letting a missing Polar
 * customer (or a Polar outage) take down unrelated features. Callers must
 * treat `null` as "free tier".
 */
export async function getCustomerStateSafe(
  externalId: string,
): Promise<CustomerState | null> {
  try {
    return await polarClient.customers.getStateExternal({ externalId });
  } catch (error) {
    console.error("[Polar] Failed to fetch customer state, treating as free tier:", error);
    return null;
  }
}

/**
 * Get the Polar customer for checkout/portal flows, creating it on the fly
 * if it doesn't exist yet (e.g. the signup-time creation failed).
 */
export async function getOrCreateCustomer(params: {
  externalId: string;
  email: string;
  name: string;
}) {
  const state = await getCustomerStateSafe(params.externalId);
  if (state) return state;

  await polarClient.customers.create({
    email: params.email,
    name: params.name,
    externalId: params.externalId,
  });

  return polarClient.customers.getStateExternal({
    externalId: params.externalId,
  });
}
