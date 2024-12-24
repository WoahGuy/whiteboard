import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface Project {
  id: string;
  code: string;
  title: string;
  status: string;
  created_at: string;
}

const ContractorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("created_by", user?.id)
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
  };

  const generateProjectCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createProject = async () => {
    if (!newProjectTitle.trim()) return;
    setIsCreating(true);

    try {
      const code = generateProjectCode();
      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title: newProjectTitle,
            code,
            created_by: user?.id,
            status: "active",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Add contractor as project owner
      await supabase.from("project_users").insert([
        {
          project_id: data.id,
          user_id: user?.id,
          role: "contractor",
        },
      ]);

      setNewProjectTitle("");
      loadProjects();
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Project Title"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={createProject}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/project/${project.code}`)}
          >
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Code: {project.code}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Created: {new Date(project.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContractorDashboard;
