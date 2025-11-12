'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoginFormValues, loginSchema } from '../validators/auth-validator';

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  async function onSubmit(values: LoginFormValues) {
    await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: '/',
      fetchOptions: {
        onSuccess: () => {
          toast.success('Login successful! Welcome back.');
          router.push('/');
        },
        onError: (ctx) => {
          console.error(ctx.error?.message || 'Unknown error');
          toast.error(
            `Login failed: ${
              ctx.error?.message ||
              'Please check your credentials and try again.'
            }`
          );
        },
      },
    });
  }

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Login to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    disabled={isPending}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Image
                      src="/google.svg"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    <span>Continue with Google</span>
                  </Button>
                  <Button
                    type="button"
                    disabled={isPending}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    {' '}
                    <Image
                      src="/github.svg"
                      alt="Github"
                      width={20}
                      height={20}
                    />
                    <span>Continue with Github</span>
                  </Button>
                </div>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={isPending}
                            placeholder="jhon@exmaple.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            disabled={isPending}
                            placeholder="******"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isPending}
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    {isPending && <Spinner />}
                    <span>Login</span>
                  </Button>
                </div>
                <p className="text-sm text-center">
                  <span className="text-muted-foreground">
                    Don&apos;t have an account?
                  </span>{' '}
                  <Link
                    href="/sign-up"
                    className={cn(
                      'underline underline-offset-4',
                      isPending && 'pointer-events-none cursor-not-allowed'
                    )}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
