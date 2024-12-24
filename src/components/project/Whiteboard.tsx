import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Palette,
  Undo,
  Redo,
} from "lucide-react";

const Whiteboard = () => {
  const [selectedTool, setSelectedTool] = useState("pencil");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      // Set up context
      const context = canvas.getContext("2d");
      if (!context) return;

      context.strokeStyle = selectedColor;
      context.lineWidth = 2;
      context.lineCap = "round";
      contextRef.current = context;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [selectedColor]);

  const tools = [
    { id: "pencil", icon: Pencil, label: "Pencil" },
    { id: "square", icon: Square, label: "Square" },
    { id: "circle", icon: Circle, label: "Circle" },
    { id: "text", icon: Type, label: "Text" },
    { id: "eraser", icon: Eraser, label: "Eraser" },
  ];

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
    contextRef.current = context;
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (contextRef.current) {
      contextRef.current.closePath();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-white p-2 flex items-center gap-2">
        <div className="flex items-center gap-1 border-r pr-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={selectedTool === tool.id ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setSelectedTool(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              style={{ color: selectedColor }}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="grid grid-cols-5 gap-2">
              {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"].map(
                (color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ),
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-1 ml-auto">
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 p-4 overflow-hidden relative">
        <div className="bg-white w-full h-full rounded-lg shadow-sm border">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
