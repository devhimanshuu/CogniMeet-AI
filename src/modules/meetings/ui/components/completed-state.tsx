import Link from "next/link";
import Markdown from "react-markdown";
import {
  SparklesIcon,
  FileTextIcon,
  BookOpenTextIcon,
  FileVideoIcon,
  ClockFadingIcon,
  CheckSquareIcon,
  LightbulbIcon,
  MessagesSquareIcon,
} from "lucide-react";
import { format } from "date-fns";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MeetingGetOne } from "../../types";
import { Badge } from "@/components/ui/badge";
import { formatDuration } from "@/lib/utils";
import { Transcript } from "./transcript";
import { ChatProvider } from "./chat-provider";

interface Props {
  data: MeetingGetOne;
}

export const CompletedState = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4 animate-fade-in">
      <Tabs defaultValue="summary">
        <div className="glass-card px-3 border-border/30">
          <ScrollArea>
             <TabsList className="p-0 bg-transparent justify-start rounded-none h-13">
                <TabsTrigger
                  value="summary"
                  className="text-muted-foreground rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-emerald-400 data-[state=active]:text-emerald-400 h-full hover:text-foreground transition-colors"
                >
                  <BookOpenTextIcon className="size-4" />
                  Summary
                </TabsTrigger>
                <TabsTrigger
                  value="transcript"
                  className="text-muted-foreground rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-cyan-400 data-[state=active]:text-cyan-400 h-full hover:text-foreground transition-colors"
                >
                  <FileTextIcon className="size-4" />
                  Transcript
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="text-muted-foreground rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-amber-400 data-[state=active]:text-amber-400 h-full hover:text-foreground transition-colors"
                >
                  <SparklesIcon className="size-4" />
                  Insights
                </TabsTrigger>
                <TabsTrigger
                  value="recording"
                  className="text-muted-foreground rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-violet-400 data-[state=active]:text-violet-400 h-full hover:text-foreground transition-colors"
                >
                <FileVideoIcon className="size-4" />
                Recording
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-emerald-400 data-[state=active]:text-emerald-400 h-full hover:text-foreground transition-colors"
              >
                <MessagesSquareIcon className="size-4" />
                Ask AI
              </TabsTrigger>
             </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <TabsContent value="chat">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>
        <TabsContent value="insights">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-400">
                <CheckSquareIcon className="size-5" />
                Action Items
              </h3>
              {data.actionItems ? (
                <ul className="space-y-3">
                  {JSON.parse(data.actionItems).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
                      <div className="mt-1 min-w-[16px]">
                        <div className="size-4 rounded-sm border border-muted-foreground/50 bg-background" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No action items extracted.</p>
              )}
            </div>
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-cyan-400">
                <LightbulbIcon className="size-5" />
                Key Decisions
              </h3>
              {data.keyDecisions ? (
                <ul className="space-y-3">
                  {JSON.parse(data.keyDecisions).map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
                      <div className="mt-1 min-w-[16px]">
                        <div className="size-1.5 rounded-full bg-cyan-400 mt-1" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No key decisions extracted.</p>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recording">
          <div className="glass-card p-5">
            <video
              src={data.recordingUrl!}
              className="w-full rounded-lg"
              controls
            />
          </div>
        </TabsContent>
        <TabsContent value="summary">
          <div className="glass-card">
            <div className="px-6 py-6 gap-y-5 flex flex-col">
              <h2 className="text-2xl font-semibold capitalize">{data.name}</h2>
              <div className="flex gap-x-3 items-center flex-wrap">
                <Link
                  href={`/agents/${data.agent.id}`}
                  className="flex items-center gap-x-2 text-emerald-400 hover:text-emerald-300 transition-colors capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>
                <span className="text-muted-foreground">•</span>
                <p className="text-muted-foreground">{data.startedAt ? format(data.startedAt, "PPP") : ""}</p>
              </div>
              <div className="flex gap-x-2 items-center">
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-4 border-border/50 bg-secondary/50"
                >
                  <ClockFadingIcon className="text-cyan-400" />
                  {data.duration ? formatDuration(data.duration) : "No duration"}
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-x-2 [&>svg]:size-4 badge-completed"
                >
                  <SparklesIcon />
                  AI Generated
                </Badge>
              </div>
              <div className="border-t border-border/30 pt-5 mt-2">
                <Markdown
                  components={{
                    h1: (props) => (
                      <h1 className="text-2xl font-semibold mb-6 gradient-text" {...props} />
                    ),
                    h2: (props) => (
                      <h2 className="text-xl font-semibold mb-4 text-foreground" {...props} />
                    ),
                    h3: (props) => (
                      <h3 className="text-lg font-medium mb-3 text-foreground" {...props} />
                    ),
                    h4: (props) => (
                      <h4 className="text-base font-medium mb-3" {...props} />
                    ),
                    p: (props) => (
                      <p className="mb-4 leading-relaxed text-muted-foreground" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc list-inside mb-4 text-muted-foreground" {...props} />
                    ),
                    ol: (props) => (
                      <ol
                        className="list-decimal list-inside mb-4 text-muted-foreground"
                        {...props}
                      />
                    ),
                    li: (props) => <li className="mb-1.5" {...props} />,
                    strong: (props) => (
                      <strong className="font-semibold text-foreground" {...props} />
                    ),
                    code: (props) => (
                      <code
                        className="bg-secondary px-1.5 py-0.5 rounded text-emerald-400 text-sm"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-2 border-emerald-500/30 pl-4 italic my-4 text-muted-foreground"
                        {...props}
                      />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
