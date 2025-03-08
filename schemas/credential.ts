import { z } from "zod";

// Schema for credential attributes
export const credentialAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
  type: z.enum(["string", "int", "float", "bool", "date"]).default("string"),
});

// Schema for individual attributes within a schema
export const schemaAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name is required"),
  value: z.string().min(1, "Attribute value is required"),
  type: z.enum(["string", "int", "float", "bool", "date"]).default("string"),
});

// Main schema for SchemaData (this could be tied to schemaId and attributes)
export const schemaDataSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  attributes: z.array(schemaAttributeSchema), // Array of attributes in the schema
});


// Revocation schema
export const revocationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

// Representation schema
export const credentialRepresentationSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  credDefId: z.string().min(1),
  schemaId: z.string().min(1),
  ocaBundleUrl: z.string().url().optional(),
});

// Icon schema inside a credential definition
export const credentialIconSchema = z.object({
  id: z.string().min(1),
  mediaType: z.string().min(1),
  content: z.string().min(1), // Base64 encoded data
  fileName: z.string().min(1),
  description: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

// Main credential definition schema with schema and icon embedded
export const credentialDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Credential name is required"),
  schemaId: z.string().min(1),
  identifierType: z.string().min(1),
  identifier: z.string().min(1),
  version: z.string().optional(),
  type: z.string().optional(),
  representations: z.array(credentialRepresentationSchema),
  revocation: revocationSchema,
  icon: credentialIconSchema,
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

// Main schema for the credential definitions list
export const credentialDefinitionsListSchema = z.object({
  credentialDefinitions: z.array(credentialDefinitionSchema),
});
export type SchemaData = z.infer<typeof schemaDataSchema>;

export type CredentialFormData = z.infer<typeof credentialDefinitionSchema>;
export type CredentialDefinitionsData = z.infer<typeof credentialDefinitionsListSchema>;
