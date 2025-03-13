import { object, string } from "zod";

export const resourceSchema = object({
    id: string(),
    name: string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .max(32, "Max name is 32 char length")
})