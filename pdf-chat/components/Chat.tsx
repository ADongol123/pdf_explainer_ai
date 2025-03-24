import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bot, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Chat = ({
  pdfUrl,
  messages,
  isAnalyzing,
  suggestedTopics,
  handleTopicClick,
  handleChatSubmit,
  input,
  handleInputChange,
  isLoading
}: any) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row h-screen p-4 gap-4">
        <div className="w-full md:w/2 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
              />
            )}
          </Card>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <Card className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-4">
              {messages?.map((message: any) => (
                <div
                  key={message.id}
                  className={`mb-4 p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground ml-8"
                      : "bg-muted mr-8"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center mb-2">
                      <Bot className="h-5 w-5 mr-2" />
                      <span className="font-medium">AI Assistant</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}

              {messages?.length === 1 && (
                <div className="mb-4 p-4">
                  <p className="font-medium mb-2">Suggested topics:</p>
                  {isAnalyzing ? (
                    <p className="text-sm text-muted-foreground">
                      Analyzing document...
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {suggestedTopics.map(({ topic, index }: any) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2"
                          onClick={() => handleTopicClick(topic)}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-2" />

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question about the PDF..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;
