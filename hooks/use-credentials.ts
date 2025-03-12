import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
	CredentialFormData,
	credentialSchema,
	SchemaData,
	IssuerData,
	Asset,
} from "@/schemas/credential";
import apiClient from "@/lib/apiService"; // API client

type Mode = "create" | "import" | "view";

interface State {
	selectedCredential: CredentialFormData | null;
	selectedSchema: SchemaData | null;
	issuers: IssuerData[];
	assets: Asset[];
	mode: Mode;
	isCreating: boolean;
	loadingIssuers: boolean;
	loadingAssets: boolean;
	isSubmitting: boolean; // Track submission state
	isDeleting: boolean;
}

interface Actions {
	fetchIssuers: () => Promise<void>;
	fetchAssets: () => Promise<void>;
	createAsset: (assetData: {
		mediaType: string;
		content: string;
		fileName: string;
		description: string;
	}) => Promise<void>;

	assignAssetToCredential: (assetId: string) => void;
	setSelectedCredential: (credential: CredentialFormData | null) => void;
	setSelectedSchema: (schema: SchemaData | null) => void;
	setIssuer: (issuer: IssuerData) => void;
	startCreating: () => Promise<string>;
	startImporting: () => void;
	viewCredential: (credential: CredentialFormData) => void;
	cancel: () => void;
	reset: () => void;

	// Add submission state actions
	startSubmitting: () => void; // Set submitting state to true
	stopSubmitting: () => void; // Set submitting state to false
	deleteCredential: (credentialId: string) => void;
}

export const useCredentials = create<State & Actions>()(
	immer((set, get) => ({
		selectedCredential: null,
		selectedSchema: null,
		issuers: [],
		mode: "create",
		assets: [],
		isCreating: false,
		loadingIssuers: false,
		loadingAssets: false,
		isSubmitting: false, // Initialize isSubmitting to false
		isDeleting: false,
		// Implement the missing setIssuer function
		setIssuer: (issuer) =>
			set((state) => {
				state.issuers = [...state.issuers, issuer]; // Adds the issuer to the list of issuers
			}),

		fetchIssuers: async () => {
			set((state) => {
				state.loadingIssuers = true;
			});
			try {
				const response = await apiClient.get<{ issuers: IssuerData[] }>(
					"/roles/issuers"
				);

				if (!response || !response.issuers) {
					throw new Error("Invalid API response");
				}

				set((state) => {
					state.issuers = response.issuers;
					state.loadingIssuers = false;
				});
			} catch (error) {
				console.error("Error fetching issuers:", error);
				set((state) => {
					state.loadingIssuers = false;
				});
			}
		},
 deleteCredential: async (credentialId: string) => {
	  set((state) => { 
				state.isDeleting = true; // Set isDeleting to true
			});
			try {
				// Send DELETE request to delete the credential
				await apiClient.delete(`/credentials/${credentialId}`);
				set((state) => {
					// Remove the deleted credential from the list
					state.selectedCredential = null;
					state.isCreating = false;
					state.isDeleting = false; // Set isDeleting back to false
				});
			} catch (error) {
				console.error("Error deleting credential:", error);
				set((state) => {
					state.isDeleting = false; // Set isDeleting back to false
				});
			}
		},	

		fetchAssets: async () => {
			set((state) => {
				state.loadingAssets = true;
			});
			try {
				const response = await apiClient.get<{ assets: Asset[] }>("/assets");
				if (!response || !response.assets) {
					throw new Error("Invalid API response");
				}

				set((state) => {
					state.assets = response.assets; // Store fetched assets in state
					state.loadingAssets = false;
				});
			} catch (error) {
				console.error("Error fetching assets:", error);
				set((state) => {
					state.loadingAssets = false;
				});
			}
		},

    fetchAssetsById: async (assetId: string) => {
      set((state) => {
        state.loadingAssets = true;
      });
  
      try {
        // Fetch asset based on the asset ID
        const response = await apiClient.get<Asset>(`/assets/${assetId}`);
        
        if (response) {
          // Check if the asset is already in the store before adding it
          set((state) => {
            const existingAsset = state.assets.find((a) => a.id === response.id);
            if (!existingAsset) {
              state.assets.push(response); // Add the new asset
            }
          });
        }
      } catch (error) {
        console.error("Error fetching asset:", error);
      } finally {
        set((state) => {
          state.loadingAssets = false;
        });
      }
    },

    createAsset: async (assetData: {
      mediaType: string;
      content: string;
      fileName: string;
      description: string;
    }) => {
      try {
        // Send POST request to create the asset
        const response = await apiClient.post<{ data: Asset }>("/assets", assetData);
    
        if (response && response.data) {
          // If the asset was created successfully, add it to the assets state
          set((state) => {
            state.assets = [...state.assets, response.data]; // Assuming response contains the new asset object
          });
          console.log("Asset created successfully:", response.data);
        }
      } catch (error) {
        console.error("Error creating asset:", error);
      }
    },
	assignAssetToCredential: (assetId: string) => {
      const asset = get().assets.find((a) => a.id === assetId);
      if (asset && get().selectedCredential) {
        set((state) => {
          // Ensure assets is an array before adding to it
          const updatedAssets = state.selectedCredential!.assets || [];
          state.selectedCredential!.assets = [...updatedAssets, asset]; // Adds asset to the credential
        });
      }
    },
    
		setSelectedCredential: (credential) =>
			set((state) => {
				state.selectedCredential = credential;
			}),

		setSelectedSchema: (schema) =>
			set((state) => {
				try {
					const validatedSchema = credentialSchema.parse(schema);
					state.selectedSchema = validatedSchema;
				} catch (error) {
					console.error("Invalid schema data", error);
				}
			}),

		startCreating: async () => {
			// Reset state before creating a new credential
			set((state) => {
				state.selectedCredential = null; // Reset the selectedCredential
				state.selectedSchema = null; // Reset the selectedSchema
				state.isCreating = true; // Set to creating mode
				state.mode = "create"; // Ensure the mode is 'create'
			});

			const newId = Date.now().toString();
			set((state) => {
				state.selectedCredential = { id: newId } as CredentialFormData; // Create new credential
			});

			// Refetch issuers when starting to create a new credential
			await get().fetchIssuers();

			return newId;
		},

		startImporting: () =>
			set((state) => {
				state.mode = "import";
				state.isCreating = false;
				state.selectedCredential = null;
				state.selectedSchema = null;
			}),

		viewCredential: (credential) => {
			set((state) => {
				state.selectedCredential = credential; // Set the selected credential
				state.mode = "view"; // Set the mode to view
				state.isCreating = false; // Set isCreating to false since you're not creating
			});
		},

		// After viewing, ensure a full reset for creating:
		cancel: () => {
			set((state) => {
				state.selectedCredential = null; // Reset the selectedCredential
				state.selectedSchema = null; // Reset the selectedSchema
				state.isCreating = false; // Stop creating mode
				state.mode = "create"; // Switch back to create mode
			});
		},

		// New actions for handling submission state
		startSubmitting: () =>
			set((state) => {
				state.isSubmitting = true; // Set submitting state to true
			}),

		stopSubmitting: () =>
			set((state) => {
				state.isSubmitting = false; // Set submitting state back to false
			}),

		reset: () =>
			set((state) => {
				state.selectedCredential = null;
				state.selectedSchema = null;
				state.mode = "create";
				state.isCreating = false;
			}),
	}))
);
