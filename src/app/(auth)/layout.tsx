import Image from 'next/image';
import Link from 'next/link';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-6 p-6 md:-10 bg-muted">
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image src="/logo.svg" alt="Nodebase" height={30} width={30} />
          <span>Nodebase</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
