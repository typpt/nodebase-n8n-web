import { SidebarTrigger } from '@/components/ui/sidebar';
import { EditorBreadcrumbs } from './editor-breadcrumbs';
import { EditorSaveButton } from './editor-save-button';

export default function EditorHeader({ workflowId }: { workflowId: string }) {
  return (
    <header className="flex items-center h-14 gap-2 shrink-0 bg-background border-b px-4">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between gap-x-4 w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
}
