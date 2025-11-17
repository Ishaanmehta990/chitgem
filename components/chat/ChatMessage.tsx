"use client"
import { FC, useMemo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Message } from "@/types/message"

interface ChatMessageProps {
    message: Message
    isLast?: boolean
}

export const ChatMessage: FC<ChatMessageProps> = ({ message, isLast }) => {
    const { role, content } = message
    const isAssistant = role === "assistant"

    const markdownContent = useMemo(() => content ?? "", [content])

    return (
        <div className={`flex mx-4 sm:mx-8 md:mx-64 ${isAssistant ? "justify-start" : "justify-end"}`}>
            <div
                className={`max-w-2xl py-3 px-4 my-2 rounded-2xl flex items-start gap-x-3 ${
                    isAssistant ? "bg-zinc-900/70 border border-zinc-800" : "bg-zinc-800"
                }`}
            >
                <div className="flex-grow text-zinc-100 message-text">
                    {markdownContent ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            className="prose prose-invert prose-sm sm:prose-base max-w-none"
                            components={{
                                pre: ({ node, ...props }) => (
                                    <pre
                                        {...props}
                                        className="overflow-x-auto bg-zinc-900/70 border border-zinc-800 rounded-lg p-3 text-sm"
                                    />
                                ),
                                code: ({ node, inline, className, children, ...props }) => (
                                    <code
                                        {...props}
                                        className={
                                            inline
                                                ? "px-1.5 py-0.5 rounded bg-zinc-800/80 text-[0.9em]"
                                                : className
                                        }
                                    >
                                        {children}
                                    </code>
                                ),
                                ul: ({ node, ...props }) => <ul {...props} className="list-disc ml-5 space-y-1" />,
                                ol: ({ node, ...props }) => <ol {...props} className="list-decimal ml-5 space-y-1" />,
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto">
                                        <table {...props} className="min-w-full border border-zinc-700 text-sm" />
                                    </div>
                                ),
                                th: ({ node, ...props }) => (
                                    <th {...props} className="border border-zinc-700 px-3 py-2 bg-zinc-800" />
                                ),
                                td: ({ node, ...props }) => (
                                    <td {...props} className="border border-zinc-700 px-3 py-2" />
                                ),
                            }}
                        >
                            {markdownContent}
                        </ReactMarkdown>
                    ) : (
                        isAssistant &&
                        isLast && <span className="animate-pulse text-zinc-400 tracking-widest">...</span>
                    )}
                </div>
            </div>
        </div>
    )
}
