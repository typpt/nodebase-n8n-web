'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CopyIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { generateGoogleFormScript } from './utils';

export function GoogleFormTriggerDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const params = useParams();
  const workflowId = params.workflowId as string;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success('Webhook URL copied to clipboard.');
    } catch {
      toast.error('Failed to copy URL.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form&apos;s Apps Script to
            trigger this workflow when a form submitted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                type="url"
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup Intructions:</h4>
            <ol className="text-muted-foregroun text-xs list-decimal list-inside space-y-1">
              <li>Open your Google Form</li>
              <li>Click the there dots menu &#10140; Script editor</li>
              <li>Copy and paste the script below</li>
              <li>Replace WEBHOOK_URL with your webhook URL above</li>
              <li>Save and click &quot;Triggers&quot; &#10140; Add Trigger</li>
              <li>Choose: from form &#10140; on from submit &#10140; save</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium">Google Apps Script:</h4>
            <Button
              type="button"
              onClick={async () => {
                const script = generateGoogleFormScript(webhookUrl);

                try {
                  await navigator.clipboard.writeText(script);
                  toast.success('Script copied to clipboard.');
                } catch {
                  toast.error('Failed to copy Script.');
                }
              }}
              variant="outline"
              size="default"
            >
              <CopyIcon className="size-4" />
              <span className="text-sm">Copy Google Apps Script</span>
            </Button>
            <p className="text-xs text-muted-foreground">
              This script includes your webhook URL and handles form submissions
            </p>
          </div>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium">Available Variables</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>
                <code className="rounded px-1 py-0.5 bg-background">
                  {'{{googleForm.respondentEmail}}'}
                </code>
                - Response&apos;s email
              </li>
              <li>
                <code className="rounded px-1 py-0.5 bg-background">
                  {'{{googleForm.responses["Question Name"]}}'}
                </code>
                - Specific answer
              </li>
              <li>
                <code className="rounded px-1 py-0.5 bg-background">
                  {'{{googleForm.responses}}'}
                </code>
                - All response as JSON
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
