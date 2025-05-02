"use client";

import { ClassicPreset } from "rete";
import { NodeEditor } from "rete";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define a custom control for MCP command input
class MCPCommandControl extends ClassicPreset.Control {
  command: string;
  args: string;
  type: string;

  constructor(
    public readonly key: string,
    public readonly initial: { command: string; args: string; type: string }
  ) {
    super(key);
    this.command = initial.command || "";
    this.args = initial.args || "";
    this.type = initial.type || "openai";
  }

  setValue(command: string, args: string, type: string) {
    this.command = command;
    this.args = args;
    this.type = type;
    this.update();
  }

  // Custom React component for the control
  component() {
    return (
      <div className="space-y-4 p-2">
        <div className="space-y-2">
          <Label>MCP Type</Label>
          <Select
            value={this.type}
            onValueChange={(value) => this.setValue(this.command, this.args, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select MCP type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="mastra">Mastra</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Command</Label>
          <Input
            value={this.command}
            onChange={(e) => this.setValue(e.target.value, this.args, this.type)}
            placeholder="Enter MCP command"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Arguments (JSON)</Label>
          <Textarea
            value={this.args}
            onChange={(e) => this.setValue(this.command, e.target.value, this.type)}
            placeholder="Enter arguments in JSON format"
            className="min-h-[100px]"
          />
        </div>
      </div>
    );
  }
}

// Define the MCP Command Node
export class MCPCommandNode extends ClassicPreset.Node {
  width = 240;
  height = 300;

  constructor(
    public readonly nodeType = "MCPCommand",
    public readonly socket = new ClassicPreset.Socket("socket")
  ) {
    super(nodeType);

    // Add input for flow control
    this.addInput("exec", new ClassicPreset.Input(socket, "Execute", true));
    
    // Add control for command configuration
    this.addControl(
      "command",
      new MCPCommandControl("command", {
        command: "",
        args: "{}",
        type: "openai"
      })
    );
    
    // Add output for flow control
    this.addOutput("exec", new ClassicPreset.Output(socket, "Continue", true));
    
    // Add output for command result
    this.addOutput("result", new ClassicPreset.Output(socket, "Result"));
  }

  data() {
    const control = this.controls.get("command") as MCPCommandControl;
    
    return {
      command: control.command,
      args: control.args,
      type: control.type
    };
  }

  // Factory method for creating new instances
  static createNode() {
    return new MCPCommandNode();
  }
}

// Add factory method to the class
MCPCommandNode.createNode = () => new MCPCommandNode();