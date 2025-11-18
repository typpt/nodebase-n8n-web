import { cn } from '@/lib/utils';
import {
  MoreHorizontalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Activity } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';
import { Input } from './ui/input';
import { Spinner } from './ui/spinner';

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
        <Activity mode={!!description ? 'visible' : 'hidden'}>
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        </Activity>
      </div>
      <Activity mode={!!onNew && !newButtonHref ? 'visible' : 'hidden'}>
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
      </Activity>
      <Activity mode={!!newButtonHref && !onNew ? 'visible' : 'hidden'}>
        <Button
          asChild
          type="button"
          disabled={isCreating || disabled}
          variant="default"
          size="sm"
        >
          <Link href={newButtonHref!} prefetch>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      </Activity>
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

type EntityStateProps = {
  message?: string;
};

export function EntityLoading({ message }: EntityStateProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full gap-y-4">
      <Spinner className="size-6" />
      <Activity mode={!!message ? 'visible' : 'hidden'}>
        <p className="text-sm text-muted-foreground">{message}</p>
      </Activity>
    </div>
  );
}

export function EntityError({ message }: EntityStateProps) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center h-full gap-y-4">
      <TriangleAlertIcon className="size-6 text-primary" />
      <Activity mode={!!message ? 'visible' : 'hidden'}>
        <p className="text-sm text-muted-foreground">{message}</p>
      </Activity>
    </div>
  );
}

type EntityEmptyProps = {
  onNew?: () => void;
  disabled?: boolean;
} & EntityStateProps;

export function EntityEmpty({ disabled, message, onNew }: EntityEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon className="size-6" />
        </EmptyMedia>
        <EmptyTitle>No Items</EmptyTitle>
        <Activity mode={!!message ? 'visible' : 'hidden'}>
          <EmptyDescription>{message}</EmptyDescription>
        </Activity>
      </EmptyHeader>
      <Activity mode={!!onNew ? 'visible' : 'hidden'}>
        <EmptyContent>
          <Button
            type="button"
            onClick={onNew}
            disabled={disabled}
            variant="default"
            size="default"
          >
            Add Item
          </Button>
        </EmptyContent>
      </Activity>
    </Empty>
  );
}

type EntityListProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => Readonly<React.ReactNode>;
  entityEmpty?: Readonly<React.ReactNode>;
  getKey?: (item: T, index: number) => string | number;
  className?: string;
};

export function EntityList<T>({
  items,
  className,
  entityEmpty,
  getKey,
  renderItem,
}: EntityListProps<T>) {
  if (items.length === 0 && entityEmpty) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="max-w-sm mx-auto">{entityEmpty}</div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-y-4', className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

type EntityItemProps = {
  href: string;
  title: string;
  image?: Readonly<React.ReactNode>;
  actions?: Readonly<React.ReactNode>;
  subtitle?: Readonly<React.ReactNode>;
  onRemove?: () => void;
  isRemoving?: boolean;
  className?: string;
};

export function EntityItem({
  href,
  title,
  actions,
  className,
  image,
  isRemoving,
  onRemove,
  subtitle,
}: EntityItemProps) {
  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    if (onRemove) onRemove();
  }

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          'cursor-pointer p-4 shadow-none hover:shadow',
          isRemoving && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              <Activity mode={!!subtitle ? 'visible' : 'hidden'}>
                <CardDescription className="text-sm">
                  {subtitle}
                </CardDescription>
              </Activity>
            </div>
          </div>
          <Activity mode={!!onRemove || !!actions ? 'visible' : 'hidden'}>
            <div className="flex items-center gap-x-4">
              {actions}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    variant="ghost"
                    size="icon"
                  >
                    <MoreHorizontalIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={handleRemove}>
                    <TrashIcon className="size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Activity>
        </CardContent>
      </Card>
    </Link>
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
