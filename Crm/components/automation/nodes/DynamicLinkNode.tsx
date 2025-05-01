'use client';

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Link } from 'lucide-react';
import { DynamicLinkType } from '@/lib/services/dynamic-links';

interface DynamicLinkNodeData {
  linkType: DynamicLinkType;
  title: string;
  description: string;
  expiresInDays: number;
  passwordProtected: boolean;
  password: string;
  resourceIdVariable: string;
  outputLinkVariable: string;
}

interface DynamicLinkNodeProps {
  data: DynamicLinkNodeData;
  isConnectable: boolean;
  selected: boolean;
}

export function DynamicLinkNode({ data, isConnectable, selected }: DynamicLinkNodeProps) {
  const [nodeData, setNodeData] = useState<DynamicLinkNodeData>(data);

  const handleChange = (key: keyof DynamicLinkNodeData, value: any) => {
    setNodeData((prev) => ({
      ...prev,
      [key]: value,
    }));
    
    // Update the node data in the parent component
    if (data.onChange) {
      data.onChange({
        ...data,
        [key]: value,
      });
    }
  };

  return (
    <Card className={`w-[300px] ${selected ? 'border-primary' : ''}`}>
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Link className="h-4 w-4 mr-2" />
          Generator linków dynamicznych
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Typ linku</Label>
            <Select
              value={nodeData.linkType}
              onValueChange={(value) => handleChange('linkType', value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Wybierz typ linku" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offer">Oferta</SelectItem>
                <SelectItem value="contract">Umowa</SelectItem>
                <SelectItem value="report">Raport</SelectItem>
                <SelectItem value="invoice">Faktura</SelectItem>
                <SelectItem value="form">Formularz</SelectItem>
                <SelectItem value="service_order">Zlecenie serwisowe</SelectItem>
                <SelectItem value="customer_portal">Portal klienta</SelectItem>
                <SelectItem value="document">Dokument</SelectItem>
                <SelectItem value="custom">Niestandardowy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Tytuł</Label>
            <Input
              className="h-8 text-xs"
              value={nodeData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Tytuł linku"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Opis</Label>
            <Input
              className="h-8 text-xs"
              value={nodeData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Opis linku"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Ważność (dni)</Label>
            <Input
              className="h-8 text-xs"
              type="number"
              min={1}
              max={365}
              value={nodeData.expiresInDays}
              onChange={(e) => handleChange('expiresInDays', parseInt(e.target.value))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Ochrona hasłem</Label>
            <Switch
              checked={nodeData.passwordProtected}
              onCheckedChange={(checked) => handleChange('passwordProtected', checked)}
            />
          </div>

          {nodeData.passwordProtected && (
            <div className="space-y-1">
              <Label className="text-xs">Hasło</Label>
              <Input
                className="h-8 text-xs"
                type="password"
                value={nodeData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Hasło"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-xs">Zmienna ID zasobu</Label>
            <Input
              className="h-8 text-xs"
              value={nodeData.resourceIdVariable}
              onChange={(e) => handleChange('resourceIdVariable', e.target.value)}
              placeholder="np. $customer.id"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Zmienna wyjściowa (link)</Label>
            <Input
              className="h-8 text-xs"
              value={nodeData.outputLinkVariable}
              onChange={(e) => handleChange('outputLinkVariable', e.target.value)}
              placeholder="np. $dynamicLink"
            />
          </div>
        </div>
      </CardContent>

      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2 h-2 bg-blue-500"
      />
    </Card>
  );
}
