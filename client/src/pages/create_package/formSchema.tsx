import { z } from "zod";

export const packageInfoSchema = z.object({
  packageType: z.string().refine(
    (value) => {
      return value === "envelope" || value === "box" || value === "other";
    },
    { message: "Must Select an Option" }
  ),
  packageSize: z.string().refine(
    (value) => {
      return (
        value === "small" ||
        value === "medium" ||
        value === "large" ||
        value === "extra large"
      );
    },
    { message: "Must Select an Option" }
  ),
  packageWeight: z.number().min(0).max(10000),
  price: z.number().min(0).default(0),
});

export const personInfoSchema = z.object({
  firstName: z.string().max(100),
  lastName: z.string().max(100),
  email: z.string(),
  phone: z.string().max(100),
  address: z.string().max(100),
  city: z.string().max(100),
  state: z.string().max(100),
  zip: z.string().max(100),
});

export const createPackageFormSchema = z.object({
  selectedIndex: z.number().min(0).max(3),
  steps: z.object({
    packageInfo: z.object({
      valid: z.boolean(),
      dirty: z.boolean(),
      value: packageInfoSchema,
    }),
    senderInfo: z.object({
      valid: z.boolean(),
      dirty: z.boolean(),
      value: personInfoSchema,
    }),
    receiverInfo: z.object({
      valid: z.boolean(),
      dirty: z.boolean(),
      value: personInfoSchema,
    }),
  }),
});

export type personSchemaType = z.infer<typeof personInfoSchema>;
export type packageSchemaType = z.infer<typeof packageInfoSchema>;
export type formSchemaType = z.infer<typeof createPackageFormSchema>;
