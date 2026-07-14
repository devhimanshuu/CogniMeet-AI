"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon, SparklesIcon, VideoIcon, LoaderIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SearchView = () => {
  const trpc = useTRPC();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { data, isFetching } = useQuery({
    ...trpc.search.transcripts.queryOptions({ query: submittedQuery }),
    enabled: submittedQuery.length >= 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length >= 3) {
      setSubmittedQuery(trimmed);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 gradient-bg-mesh">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card p-6 glow-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <SparklesIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Semantic Search</h1>
              <p className="text-sm text-muted-foreground">
                Ask across everything said in your meetings — by meaning, not just keywords.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='e.g. "when did we decide on the pricing experiment?"'
                className="pl-9 bg-secondary/50 border-border/50 h-10"
              />
            </div>
            <Button
              type="submit"
              disabled={query.trim().length < 3 || isFetching}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              {isFetching ? <LoaderIcon className="size-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        </div>

        {submittedQuery && !isFetching && data && (
          <>
            {!data.available ? (
              <div className="glass-card p-6 text-sm text-muted-foreground">
                Semantic search requires <code className="text-emerald-400">OPENAI_API_KEY</code> to
                be configured for embeddings.
              </div>
            ) : data.results.length === 0 ? (
              <div className="glass-card p-6 text-sm text-muted-foreground">
                No matching moments found. Transcripts are indexed when a
                meeting finishes processing — older meetings may not be
                searchable yet.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground px-1">
                  {data.results.length} relevant {data.results.length === 1 ? "moment" : "moments"} found
                </p>
                {data.results.map((result) => (
                  <Link
                    key={result.chunkId}
                    href={`/meetings/${result.meetingId}`}
                    className="glass-card p-5 block hover:border-emerald-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
                        <VideoIcon className="size-3.5" />
                      </div>
                      <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">
                        {result.meetingName}
                      </span>
                      {result.meetingDate && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(result.meetingDate), "MMM d, yyyy")}
                        </span>
                      )}
                      <span className="ml-auto text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                        {Math.round(result.similarity * 100)}% match
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                      {result.content}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
