import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { AuthForm } from "@/components/auth/AuthForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const CodeEntry = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      // Verify the project code exists in Supabase
      const { data, error } = await supabase
        .from("projects")
        .select("id")
        .eq("code", code)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid code",
          description: "Please check the code and try again.",
          variant: "destructive",
        });
        return;
      }

      navigate(`/project/${code}`);
    }
  };

  if (!user) {
    return <AuthForm />;
  }

  return (
    <Card className="w-[400px] bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Enter Your Project Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter the code from your contractor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center text-lg tracking-wider"
            autoFocus
          />
          <Button type="submit" className="w-full">
            Continue to Project
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CodeEntry;
