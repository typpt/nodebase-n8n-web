import { PlusIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Input } from './ui/input';

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

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function EntitySearch({
  onChange,
  value,
  placeholder = 'Search',
}: EntitySearchProps) {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="max-w-[200px] w-full border-border bg-background pl-8 shadow-none"
      />
    </div>
  );
}

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export function EntityPagination({
  onPageChange,
  page,
  totalPages,
  disabled,
}: EntityPaginationProps) {
  return (
    <div className="flex items-center justify-between gap-x-2 w-full">
      <p className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </p>
      <div className="flex items-center justify-end gap-x-2 py-4">
        <Button
          type="button"
          disabled={disabled || page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          variant="outline"
          size="default"
        >
          Previous
        </Button>
        <Button
          type="button"
          disabled={disabled || page === totalPages || totalPages === 0}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          variant="outline"
          size="default"
        >
          Next
        </Button>
      </div>
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
