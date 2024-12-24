import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CodeEntry from "./CodeEntry";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkIfContractor();
    }
  }, [user]);

  const checkIfContractor = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id")
      .eq("created_by", user?.id)
      .limit(1);

    if (data && data.length > 0) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Project Workspace</h1>
        <p className="text-gray-600 max-w-md mx-auto text-lg">
          Collaborate on designs, review costs, and handle payments in one place
        </p>
      </div>

      {user ? (
        <div className="space-y-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="px-8"
          >
            Create New Project
          </Button>
          <p className="text-center text-sm text-gray-500">or</p>
          <CodeEntry />
        </div>
      ) : (
        <CodeEntry />
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Need help? Contact your contractor for the project code</p>
      </div>
    </div>
  );
};

export default LandingPage;
