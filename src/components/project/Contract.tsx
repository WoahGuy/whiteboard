import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface Template {
  id: string;
  title: string;
  content: string;
}

const Contract = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const { data } = await supabase
      .from("contract_templates")
      .select("*")
      .or(`created_by.eq.${user?.id},is_default.eq.true`);

    if (data) {
      setTemplates(data);
      setSelectedTemplate(data[0]);
    }
  };

  const saveTemplate = async () => {
    if (!selectedTemplate) return;

    await supabase.from("contract_templates").insert([
      {
        title: `${selectedTemplate.title} (Copy)`,
        content: selectedTemplate.content,
        created_by: user?.id,
        is_default: false,
      },
    ]);

    loadTemplates();
  };

  if (!selectedTemplate) return null;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Project Agreement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Select
            onValueChange={(value) => {
              const template = templates.find((t) => t.id === value);
              if (template) setSelectedTemplate(template);
            }}
            value={selectedTemplate.id}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={saveTemplate}>
            Save as Template
          </Button>
        </div>

        <ScrollArea className="h-[500px] w-full rounded-md border p-4">
          <div
            className="space-y-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
          />
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="agree" className="text-sm text-gray-600">
            I have read and agree to the terms
          </label>
        </div>
        <Button disabled={!agreed}>Sign Agreement</Button>
      </CardFooter>
    </Card>
  );
};

export default Contract;
