'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';

const formSchema = z.object({
  endpoint: z.url({ message: 'Invalid URL' }),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
  body: z.string().optional(),
});

export type FormValuesType = z.infer<typeof formSchema>;

export function HttpRequestDialog({
  open,
  onOpenChange,
  defaultBody = '',
  defaultEndpoint = '',
  defaultMethod = 'GET',
  onSubmit,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (values: FormValuesType) => void;
  defaultEndpoint?: string;
  defaultMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  defaultBody?: string;
}) {
  const form = useForm<FormValuesType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: defaultBody,
      endpoint: defaultEndpoint,
      method: defaultMethod,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        body: defaultBody,
        endpoint: defaultEndpoint,
        method: defaultMethod,
      });
    }
  }, [defaultBody, defaultEndpoint, defaultMethod, form, open]);

  const watchMethod = useWatch({
    control: form.control,
    name: 'method',
  });
  const showBodyField = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    watchMethod
  );

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit?.(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request Trigger</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP Request node.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 mt-4"
          >
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The HTTP method to use for this request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="http://api.example.com/users/{{httpResponse.data.id}}"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{{variables}}'} for dynamic values.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showBodyField && (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[150px] font-mono text-sm"
                        placeholder={
                          `{\n` +
                          `  "userId": "{{httpResponse.data.id}}",\n` +
                          `  "name": "{{httpResponse.data.name}}",\n` +
                          `  "items": "{{json httpResponse.data.items}}"\n` +
                          `}`
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use {'{{variables}}'} or {'{{json variable}}'} for
                      objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className="mt-4">
              <Button type="submit" className="w-full">
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
