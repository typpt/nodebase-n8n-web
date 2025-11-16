'use client';

import { NodeType } from '@/generated/prisma/enums';
import { createId } from '@paralleldrive/cuid2';
import { useReactFlow } from '@xyflow/react';
import { GlobeIcon, MousePointer2Icon } from 'lucide-react';
import Image from 'next/image';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Separator } from './ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

export type NodeTypeOption = {
  label: string;
  description: string;
  type: NodeType;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    description:
      'Run the flow on clicking a button. Good for getting started quickly.',
    icon: MousePointer2Icon,
    label: 'Trigger Manually',
    type: NodeType.MANUAL_TRIGGER,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    description: 'Make an HTTP Request.',
    icon: GlobeIcon,
    label: 'HTTP Request',
    type: NodeType.HTTP_REQUEST,
  },
];

type Props = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  children: Readonly<React.ReactNode>;
};

export function NodeSelector({ children, onOpenChange, open }: Props) {
  const { getNodes, screenToFlowPosition, setNodes } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER
        );

        if (hasManualTrigger) {
          toast.error('Only one manual trigger is allowed per workflow');
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          position: flowPosition,
          data: {},
          type: selection.type,
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });

      onOpenChange(false);
    },

    [getNodes, onOpenChange, screenToFlowPosition, setNodes]
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="sm:max-w-lg overflow-y-auto w-ful">
        <SheetHeader>
          <SheetTitle>What trigger this workflow?</SheetTitle>
          <SheetDescription>
            A trigger this a step that starts your workflow
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((node) => {
            const Icon = node.icon;

            return (
              <div
                onClick={() => handleNodeSelect(node)}
                key={node.label}
                className="w-full hover:bg-gray-50 cursor-pointer py-5 px-4 h-auto border-l-2 border-transparent hover:border-l-primary justify-start rounded-none"
              >
                <div className="flex items-center gap-6 overflow-hidden">
                  {typeof Icon === 'string' ? (
                    <Image
                      src={Icon}
                      alt={node.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-start">
                    <h4 className="text-sm font-medium">{node.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {node.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {executionNodes.map((node) => {
            const Icon = node.icon;

            return (
              <div
                onClick={() => handleNodeSelect(node)}
                key={node.label}
                className="w-full hover:bg-gray-50 cursor-pointer py-5 px-4 h-auto border-l-2 border-transparent hover:border-l-primary justify-start rounded-none"
              >
                <div className="flex items-center gap-6 overflow-hidden">
                  {typeof Icon === 'string' ? (
                    <Image
                      src={Icon}
                      alt={node.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-start">
                    <h4 className="text-sm font-medium">{node.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {node.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
