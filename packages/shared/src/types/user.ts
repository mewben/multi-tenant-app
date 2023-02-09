import { z, type TypeOf } from "zod";

export const verifyUserSchema = z.object({
  id: z.string().uuid(),
  verificationCode: z.string().min(6),
});

export const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const onboardingSchema = z.object({
  firstName: z.string().min(1),
  workspaceTitle: z.string().min(2),
  workspaceDomain: z.string().min(2),
});

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>;
export type SignupInput = TypeOf<typeof signupSchema>;
export type SigninInput = TypeOf<typeof signinSchema>;
export type OnboardingInput = TypeOf<typeof onboardingSchema>;
