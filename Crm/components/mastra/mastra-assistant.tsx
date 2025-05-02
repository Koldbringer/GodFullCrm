"use client";

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  RefreshCw,
  MessageSquare,
  History
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Mastra Assistant Component
 * Provides an interface to interact with the Mastra agent
 */
export function MastraAssistant() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState('chat');

  /**
   * Handle sending a message to the Mastra agent
   */
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a message',
        variant: 'destructive',
      });
      return;
    }

    // Add user message to conversation
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the Mastra API
      const response = await fetch('/api/mastra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Mastra');
      }

      const data = await response.json();
      
      // Add assistant message to conversation
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.result.text,
        timestamp: new Date(),
      };
      
      setConversation(prev => [...prev, assistantMessage]);
      setMessage('');
      
      toast({
        title: 'Message Sent',
        description: 'Mastra has responded to your message',
      });
    } catch (error) {
      console.error('Error sending message to Mastra:', error);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response from Mastra',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clearing the conversation
   */
  const handleClearConversation = () => {
    setConversation([]);
    
    toast({
      title: 'Conversation Cleared',
      description: 'Your conversation has been cleared',
    });
  };

  /**
   * Format the timestamp for display
   */
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Mastra Assistant
        </CardTitle>
        <CardDescription>
          AI-powered assistant using Mastra MCP with OpenAI integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <div className="mb-4 h-[400px] overflow-y-auto border rounded-md p-4 bg-muted/10">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2" />
                  <p>Start a conversation with Mastra Assistant</p>
                  <p className="text-sm">Ask about customers, service orders, or get help with content generation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="mb-1 text-xs opacity-70">
                          {msg.role === 'user' ? 'You' : 'Mastra'} • {formatTimestamp(msg.timestamp)}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Conversation History</h3>
              <p className="text-sm text-muted-foreground mb-4">
                View your conversation history with Mastra Assistant
              </p>
              
              {conversation.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-8 w-8 mx-auto mb-2" />
                  <p>No conversation history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((msg, index) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">
                          {msg.role === 'user' ? 'You' : 'Mastra'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {msg.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleClearConversation}
          disabled={conversation.length === 0 || isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Clear Conversation
        </Button>
        <div className="text-xs text-muted-foreground">
          Powered by Mastra MCP with OpenAI
        </div>
      </CardFooter>
    </Card>
  );
}