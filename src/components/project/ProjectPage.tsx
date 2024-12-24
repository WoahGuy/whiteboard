import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import Whiteboard from "./Whiteboard";
import PriceCheck from "./PriceCheck";
import Contract from "./Contract";
import PaymentProcessing from "./PaymentProcessing";

const ProjectPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [project, setProject] = useState(null);
  const { toast } = useToast();
  const { code } = useParams();

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("code", code)
        .single();
      setProject(data);
      setIsLoading(false);
    };
    if (code) loadProject();
  }, [code]);

  const helpContent = {
    whiteboard: "Collaborate on designs in real-time with your client",
    price: "Break down project costs and get client approval",
    contract: "Create and sign project agreements",
    payment: "Handle secure payments and subscriptions",
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      <header className="border-b px-6 py-4 bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-xl font-semibold">
              {project?.title || "Project Workspace"}
            </h1>
            <p className="text-sm text-muted-foreground">Code: #{code}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Need help? Click for documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <Tabs defaultValue="whiteboard" className="h-full">
          <div className="border-b bg-white">
            <TabsList className="w-full justify-start h-12 px-4 gap-4">
              {Object.entries(helpContent).map(([tab, help]) => (
                <TooltipProvider key={tab}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TabsTrigger value={tab} className="relative">
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{help}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </TabsList>
          </div>

          <div className="h-[calc(100%-48px)] overflow-auto">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
              </div>
            ) : (
              <>
                <TabsContent value="whiteboard" className="h-full m-0">
                  <Whiteboard />
                </TabsContent>
                <TabsContent value="price" className="h-full m-0 p-6">
                  <PriceCheck />
                </TabsContent>
                <TabsContent value="contract" className="h-full m-0 p-6">
                  <Contract />
                </TabsContent>
                <TabsContent value="payment" className="h-full m-0 p-6">
                  <PaymentProcessing />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default ProjectPage;
