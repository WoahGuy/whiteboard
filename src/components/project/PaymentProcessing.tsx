import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface PaymentProps {
  projectId: string;
  amount: number;
  description: string;
}

const PaymentProcessing = () => {
  const { code } = useParams();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserRole = async () => {
      const { data } = await supabase
        .from("project_users")
        .select("role")
        .eq("project_id", code)
        .eq("user_id", user?.id)
        .single();

      if (data) {
        setUserRole(data.role);
      }
    };

    loadUserRole();
  }, [code, user]);

  const handleClientPayment = async (amount: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          projectId: code,
          type: "client_payment",
        }),
      });

      const { clientSecret } = await response.json();
      // Handle Stripe payment flow
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionPayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          plan: "professional",
        }),
      });

      const { subscriptionUrl } = await response.json();
      window.location.href = subscriptionUrl;
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs
        defaultValue={userRole === "contractor" ? "subscription" : "payment"}
      >
        <TabsList>
          {userRole === "contractor" && (
            <TabsTrigger value="subscription">
              Platform Subscription
            </TabsTrigger>
          )}
          {userRole === "client" && (
            <TabsTrigger value="payment">Project Payment</TabsTrigger>
          )}
        </TabsList>

        {userRole === "contractor" && (
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Professional Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">$29/month</h3>
                  <ul className="space-y-2">
                    <li>✓ Unlimited Projects</li>
                    <li>✓ Real-time Collaboration</li>
                    <li>✓ Payment Processing</li>
                    <li>✓ Priority Support</li>
                  </ul>
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubscriptionPayment}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {userRole === "client" && (
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Project Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Payment Summary</h3>
                  <div className="flex justify-between">
                    <span>Project Total</span>
                    <span>$1,750.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Processing Fee (3%)</span>
                    <span>$52.50</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total Due</span>
                    <span>$1,802.50</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleClientPayment(180250)}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PaymentProcessing;
