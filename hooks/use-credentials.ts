import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { CredentialFormData } from '@/schemas/credential';
import { schemaDataSchema, SchemaData } from '@/schemas/credential';

type Mode = 'create' | 'import' | 'view';

interface State {
  selectedCredential: CredentialFormData | null;
  selectedSchema: SchemaData | null;
  mode: Mode;
  isCreating: boolean;
}

interface Actions {
  setSelectedCredential: (credential: CredentialFormData | null) => void;
  setSelectedSchema: (schema: SchemaData | null) => void;
  setIssuer: (issuer: { id: string; name: string; type: string; description?: string; organization?: string; logo?: string }) => void;
  updateCredentialImage: (imageData: { mediaType: string; content: string; description?: string; fileName?: string }) => void;
  
  startCreating: () => string;
  startImporting: () => void;
  viewCredential: (credential: CredentialFormData) => void;

  cancel: () => void;
  reset: () => void;
}

export const useCredentials = create<State & Actions>()(
  immer((set, get) => ({
    selectedCredential: null,
    selectedSchema: null, 
    mode: 'create',
    isCreating: false,

    setSelectedCredential: (credential) =>
      set((state) => {
        state.selectedCredential = credential;
      }),

    setSelectedSchema: (schema) =>
      set((state) => {
        try {
          const validatedSchema = schemaDataSchema.parse(schema);
          state.selectedSchema = validatedSchema;
        } catch (error) {
          console.error("Invalid schema data", error);
        }
      }),

    setIssuer: (issuer) =>
      set((state) => {
        if (state.selectedCredential) {
          state.selectedCredential.issuer = { ...state.selectedCredential.issuer, ...issuer };
        }
      }),

    updateCredentialImage: (imageData) =>
      set((state) => {
        if (state.selectedCredential) {
          state.selectedCredential.icon = { ...state.selectedCredential.icon, ...imageData };
        }
      }),

    startCreating: () => {
      const newId = Date.now().toString();  // Create a new ID for the credential

      set((state) => {
        state.selectedCredential = {
          revocation: {
            id: '',
            title: '',
            description: '',
            createdAt: '',
            updatedAt: '',
          },
          id: newId,
          name: '',
          schemaId: '',
          identifierType: '',
          identifier: '',
          representations: [],
          createdAt: '',
          updatedAt: '',
          version: '',
          issuer: {
            id: '',
            name: '',
            type: '',
            description: '',
            organization: '',
            logo: ''
          },
          icon: {
            id: '',
            createdAt: '',
            updatedAt: '',
            description: '',
            mediaType: '',
            content: '',
            fileName: ''
          },
          schema: {
            id: '',
            name: '',
            attributes: []
          },
        };

        state.mode = 'create';
        state.isCreating = true;
        state.selectedSchema = null;
      });

      // Access current state using `get()`
      const currentState = get(); // This should work now!
      console.log("State after startCreating", currentState);

      return newId;
    },

    startImporting: () =>
      set((state) => {
        state.mode = 'import';
        state.isCreating = false;
        state.selectedCredential = null;
        state.selectedSchema = null;
      }),

    viewCredential: (credential) =>
      set((state) => {
        state.selectedCredential = credential;
        state.mode = 'view';
        state.isCreating = false;
        state.selectedSchema = credential.schema ?? null;
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
