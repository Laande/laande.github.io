import { defineCollection, z } from "astro:content";

const buttonSchema = z.object({
  text: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
});

const projects = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    buttons: z.array(buttonSchema).optional()
  }),
});

export const collections = { projects };
