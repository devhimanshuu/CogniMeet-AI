import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SparklesIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AgentGetOne } from "../../types";
import { agentsInsertSchema } from "../../schemas";
import { useRouter } from "next/navigation";
import { AGENT_PRESETS } from "../../constants/agent-presets";

interface AgentFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: AgentGetOne;
};

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const createAgent = useMutation(
    trpc.agents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(
          trpc.premium.getFreeUsage.queryOptions(),
        );

        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);

        if (error.data?.code === "FORBIDDEN") {
          router.push("/upgrade");
        }
      },
    }),
  );

  const updateAgent = useMutation(
    trpc.agents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.agents.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createAgent.isPending || updateAgent.isPending;

  const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
    if (isEdit) {
      updateAgent.mutate({ ...values, id: initialValues.id });
    } else {
      createAgent.mutate(values);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = AGENT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(presetId);
      form.setValue("name", preset.name);
      form.setValue("instructions", preset.instructions);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Agent Presets */}
        {!isEdit && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-emerald-400" />
              <span className="text-sm font-medium text-muted-foreground">Quick Start with a Preset</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AGENT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${
                    selectedPreset === preset.id
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : "border-border/50 hover:border-border bg-secondary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${preset.color}`}>
                    <preset.icon className="size-3.5" />
                  </div>
                  <span className="truncate text-xs font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <GeneratedAvatar
          seed={form.watch("name")}
          variant="botttsNeutral"
          className="border size-16"
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Math tutor" className="bg-secondary/50 border-border/50" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="You are a helpful math assistant that can answer questions and help with assignments."
                  className="bg-secondary/50 border-border/50 min-h-[120px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button
              variant="ghost"
              disabled={isPending}
              type="button"
              onClick={() => onCancel()}
            >
              Cancel
            </Button>
          )}
          <Button 
            disabled={isPending} 
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
