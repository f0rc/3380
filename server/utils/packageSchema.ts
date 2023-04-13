import { z } from "zod";

export const packageInfoSchema = z.object({
  packageType: z
    .string()
    .refine((value) => {
      return value === "envelope" || value === "box" || value === "other";
    }, "Must be either Envelope or Box")
    .default("envelope"),
  packageSize: z
    .string()
    .refine((value) => {
      return (
        value === "small" ||
        value === "medium" ||
        value === "large" ||
        value === "extra large"
      );
    })
    .default("small"),
  packageWeight: z.number().min(0).max(1000).default(0),
  price: z.number().min(0).default(0),
});

export const personInfoSchema = z.object({
  firstName: z.string().max(100).default(""),
  lastName: z.string().max(100).default(""),
  email: z.string().default(""),
  phone: z.string().max(100).default(""),
  address: z.string().max(100).default(""),
  city: z.string().max(100).default(""),
  state: z.string().max(100).default(""),
  zip: z.string().max(100).default(""),
});

export const createPackageFormSchema = z
  .object({
    selectedIndex: z.number().min(0).max(3).default(0),
    steps: z
      .object({
        packageInfo: z
          .object({
            valid: z.boolean().default(false),
            dirty: z.boolean().default(false),
            value: packageInfoSchema.default({}),
          })
          .default({}),
        senderInfo: z
          .object({
            valid: z.boolean().default(false),
            dirty: z.boolean().default(false),
            value: personInfoSchema.default({}),
          })
          .default({}),
        receiverInfo: z
          .object({
            valid: z.boolean().default(false),
            dirty: z.boolean().default(false),
            value: personInfoSchema.default({}),
          })
          .default({}),
      })
      .default({}),
  })
  .default({});

export type personSchemaType = z.infer<typeof personInfoSchema>;
export type packageSchemaType = z.infer<typeof packageInfoSchema>;
export type formSchemaType = z.infer<typeof createPackageFormSchema>;

// const fixedDefault = createPackageFormSchema.parse({});
// fixedDefault.steps.receiverInfo.value.email = "";
// fixedDefault.steps.senderInfo.value.email = "";
export const defaultFormState = createPackageFormSchema.parse({});
