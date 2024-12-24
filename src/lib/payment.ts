import { supabase } from "./supabase";

export interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  client_secret?: string;
}

export interface Subscription {
  id: string;
  status: string;
  current_period_end: string;
  plan_type: string;
}

export const paymentService = {
  // Placeholder for Stripe integration
  async createPaymentIntent(
    amount: number,
    projectId: string,
  ): Promise<PaymentIntent> {
    // This will be replaced with actual Stripe integration
    const { data, error } = await supabase
      .from("payments")
      .insert([
        {
          amount,
          project_id: projectId,
          platform_fee: Math.floor(amount * 0.03),
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createSubscription(
    userId: string,
    planType: string,
  ): Promise<Subscription> {
    // This will be replaced with actual Stripe integration
    const { data, error } = await supabase
      .from("subscriptions")
      .insert([
        {
          user_id: userId,
          plan_type: planType,
          status: "pending",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getPaymentStatus(paymentId: string): Promise<string> {
    const { data, error } = await supabase
      .from("payments")
      .select("status")
      .eq("id", paymentId)
      .single();

    if (error) throw error;
    return data.status;
  },

  async getSubscriptionStatus(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
};
