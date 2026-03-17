"use client";

import { useState } from "react";
import { SquarePen, Save, Copy } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import updateContact from "@/actions/update-contact";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  location: string;
  title: string;
  initialContent: string;
}

export default function ContactCard({
  location,
  title,
  initialContent,
}: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsLoading(true);
    const result = await updateContact({ location, content });
    setIsLoading(false);

    if (result.success) {
      toast.success("Contato salvo com sucesso!");
      setIsEditing(false);
    } else {
      toast.error(result.error || "Erro ao salvar contato");
    }
  };

  const handleCopy = () => {
    if (!content) {
      toast.info("Nenhum conteúdo para copiar");
      return;
    }
    navigator.clipboard.writeText(content).then(() => {
      toast.success("Copiado para a área de transferência!");
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm font-semibold tracking-wide">
          {title}
        </CardTitle>
        <CardAction className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Copiar"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEditToggle}
            disabled={isLoading}
            className={cn(
              "h-7 w-7",
              isEditing
                ? "text-green-600 hover:text-green-700"
                : "text-muted-foreground hover:text-foreground",
            )}
            title={isEditing ? "Salvar" : "Editar"}
          >
            {isEditing ? (
              <Save className="h-4 w-4" />
            ) : (
              <SquarePen className="h-4 w-4" />
            )}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={!isEditing}
          placeholder="Nenhum contato cadastrado..."
          rows={5}
          className={cn(
            "w-full resize-none transition-all duration-200",
            isEditing
              ? "border-input bg-background"
              : "border-transparent bg-muted/30 cursor-default select-text",
          )}
        />
      </CardContent>
    </Card>
  );
}
