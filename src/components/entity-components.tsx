import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel?: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { onNew?: never; newButtonHref: string }
  | { onNew?: never; newButtonHref?: never }
);

export function EntityHeader({
  title,
  description,
  disabled,
  isCreating,
  newButtonHref,
  newButtonLabel,
  onNew,
}: EntityHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button
          type="button"
          onClick={onNew}
          disabled={isCreating || disabled}
          variant="default"
          size="sm"
        >
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button
          asChild
          type="button"
          disabled={isCreating || disabled}
          variant="default"
          size="sm"
        >
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

type EntityContainerProps = {
  children: Readonly<React.ReactNode>;
  header?: Readonly<React.ReactNode>;
  search?: Readonly<React.ReactNode>;
  pagination?: Readonly<React.ReactNode>;
};

export function EntityContainer({
  children,
  header,
  pagination,
  search,
}: EntityContainerProps) {
  return (
    <div className="md:px-10 md:py-6 p-4 h-full">
      <div className="flex flex-col max-w-7xl w-full gap-y-8 h-full mx-auto">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
}
