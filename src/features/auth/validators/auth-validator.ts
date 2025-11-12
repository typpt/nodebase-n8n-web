import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Name must be at least 3 characters long.' })
      .max(50, { message: 'Name must be at most 50 characters long.' })
      .regex(/^[a-zA-Z\s'.-]+$/, {
        message:
          'Name can only contain letters, spaces, and basic punctuation.',
      }),

    email: z
      .email({ message: 'Invalid email format.' })
      .min(1, { message: 'Email is required.' })
      .toLowerCase(),

    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long.' })
      .max(100, { message: 'Password is too long.' })
      // .regex(/[a-z]/, {
      //   message: 'Password must contain at least one lowercase letter.',
      // })
      // .regex(/[A-Z]/, {
      //   message: 'Password must contain at least one uppercase letter.',
      // })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number.',
      }),
    // .regex(/[^a-zA-Z0-9]/, {
    //   message: 'Password must contain at least one special character.',
    // })
    confirmPassword: z.optional(z.string()),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    error: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email({ message: 'Invalid email format.' })
    .min(1, { message: 'Email is required.' })
    .toLowerCase(),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .max(100, { message: 'Password is too long.' })
    // .regex(/[a-z]/, {
    //   message: 'Password must contain at least one lowercase letter.',
    // })
    // .regex(/[A-Z]/, {
    //   message: 'Password must contain at least one uppercase letter.',
    // })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one number.',
    }),
  // .regex(/[^a-zA-Z0-9]/, {
  //   message: 'Password must contain at least one special character.',
  // })
});

export type LoginFormValues = z.infer<typeof loginSchema>;
