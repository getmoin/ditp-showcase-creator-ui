import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CredentialFormData } from '@/schemas/credential';
import { schemaDataSchema, SchemaData } from '@/schemas/credential'; // Import your schema data schema

type Mode = 'create' | 'import' | 'view';

interface State {
  selectedCredential: CredentialFormData | null;
  selectedSchema: SchemaData | null; // Store schema data validated with Zod
  mode: Mode;
  isCreating: boolean;
}

interface Actions {
  setSelectedCredential: (credential: CredentialFormData | null) => void;
  setSelectedSchema: (schema: SchemaData | null) => void; // Action for schema data
  startCreating: () => string;
  startImporting: () => void;
  viewCredential: (credential: CredentialFormData) => void;
  cancel: () => void;
  reset: () => void;
}

export const useCredentials = create<State & Actions>()(
  immer((set) => ({
    selectedCredential: null,
    selectedSchema: null, // Initialize schema state
    mode: 'create',
    isCreating: false,

    setSelectedCredential: (credential) =>
      set((state) => {
        state.selectedCredential = credential;
      }),

    setSelectedSchema: (schema) =>
      set((state) => {
        try {
          const validatedSchema = schemaDataSchema.parse(schema); // Zod validation
          state.selectedSchema = validatedSchema; // Store validated schema
        } catch (error) {
          console.error("Invalid schema data", error);
        }
      }),

    startCreating: () => {
      const newId = Date.now().toString(); // Unique ID for creating
      set((state) => {
        state.selectedCredential = {
          id: newId,
          name: '',
          version: '',
          icon: {
            id: '',
            createdAt: '',
            updatedAt: '',
            description: '',
            mediaType: '',
            content: '',
            fileName: ''
          },
          attributes: [],
        };
        state.mode = 'create';
        state.isCreating = true;
      });
      return newId;
    },

    startImporting: () =>
      set((state) => {
        state.mode = 'import';
        state.selectedCredential = null;
        state.isCreating = false;
      }),

    viewCredential: (credential) =>
      set((state) => {
        state.selectedCredential = credential;
        state.mode = 'view';
        state.isCreating = false;
      }),

    cancel: () =>
      set((state) => {
        state.selectedCredential = null;
        state.selectedSchema = null;
        state.mode = 'create';
        state.isCreating = false;
      }),

    reset: () =>
      set((state) => {
        state.selectedCredential = null;
        state.selectedSchema = null;
        state.mode = 'create';
        state.isCreating = false;
      }),
  }))
);

