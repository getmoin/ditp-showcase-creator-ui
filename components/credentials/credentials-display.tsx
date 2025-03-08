import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import ButtonOutline from "../ui/button-outline";
import { useTranslations } from "next-intl";
import { useCredentials } from "@/hooks/use-credentials";
import { CredentialFormData } from "@/schemas/credential";
import apiClient from "@/lib/apiService"; // Import the API client

// Define the structure for CredentialDefinition only
interface CredentialDefinition {
  id: string;
  name: string;
  version: string;
  issuer_name: string;
  icon: string;
  attributes: { name: string }[];
}

export const CredentialsDisplay = () => {
  const { setSelectedCredential, startCreating, viewCredential } = useCredentials();
  const [credentials, setCredentials] = useState<CredentialDefinition[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  // Fetch only credential definitions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch credential definitions
        const definitionResponse = await apiClient.get('/credentials/definitions');
        if (definitionResponse?.credentialDefinitions) {
          setCredentials(definitionResponse.credentialDefinitions);
        } else {
          setError("Credential definitions not found.");
        }
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // No need to depend on schemas anymore

  const handleSelectCredential = (credential: CredentialFormData & { id: string }) => {
    setSelectedCredential(credential);
    viewCredential(credential);
    setOpenId(credential.id);
  };

  const toggleDetails = (id: string) => {
    const credential = credentials.find((cred) => cred.id === id);
    if (openId === id) {
      setOpenId(null);
      setSelectedCredential(null);
    } else {
      setOpenId(id);
      handleSelectCredential(credential as CredentialFormData & { id: string });
    }
  };

  const handleCreate = () => {
    startCreating();
    setOpenId(null);
  };

  return (
    <div className="w-full h-full bg-white dark:bg-dark-bg-secondary dark:border dark:border-dark-bg shadow-lg rounded-lg">
      <div className="p-4 border-b dark:border-dark-border">
        <h2 className="text-lg font-bold">{t("credentials.credential_title")}</h2>
        <p className="text-sm text-gray-400">{t("credentials.credential_subtitle")}</p>
      </div>

      <div className="mx-auto px-4 mb-4 mt-2">
        <div className="relative max-w-[550px] w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
          <Input
            type="text"
            placeholder={t("action.search_label")}
            className="bg-white dark:bg-dark-bg w-full pl-10 pr-3 py-6 border rounded-md text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
        <hr className="border-gray-200 dark:border-dark-border" />
      </div>

      {loading && <p className="text-center py-4">Loading credentials...</p>}
      {error && <p className="text-center text-red-500 py-4">{error}</p>}

	  {!loading && !error && credentials.map((item) => (
  <div key={item.id} className="border-b dark:border-dark-border">
    {openId === item.id ? (
      <div className="p-3 bg-light-bg flex flex-col dark:bg-dark-bg items-center text-center">
        <div className="flex flex-col py-2 w-full items-center">
          {/* Assuming item.icon is an object, render the relevant property */}
          <span className="text-sm font-semibold">
            {typeof item.icon === 'object' ? item.icon.name : item.icon}
          </span>
          <span className="text-lg font-semibold">{item.name}</span>
          <span className="text-sm mt-1 text-black dark:text-gray-400">Version {item.version}</span>
          <span className="text-sm mt-1 text-black dark:text-gray-400">{item.issuer_name}</span>
          <div className="flex flex-row gap-4 justify-center mt-1">
            {Array.isArray(item.attributes) && item.attributes.length > 0 ? (
              item.attributes.map((attr) => (
                <div key={attr.name} className="bg-light-bg dark:bg-dark-border border dark:border-gray-500 rounded-md px-2">
                  <span className="text-sm dark:text-gray-200">{attr.name}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">No attributes available</span>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div
        className="flex justify-between items-center p-3 cursor-pointer"
        onClick={() => toggleDetails(item.id)}
      >
        <div className="flex items-center gap-3">
          {/* Render item.icon correctly if it's an object */}
          <span className="text-xl">
            {typeof item.icon === 'object' ? item.icon.name : item.icon}
          </span>
          <div>
            <p className="font-bold text-black dark:text-gray-200">{item.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.version}</p>
          </div>
        </div>
        <div>
          <p className="text-sm text-black dark:text-gray-200 font-bold">Type</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{item.issuer_name}</p>
        </div>
        <div>
          <p className="text-sm text-black dark:text-gray-200 font-bold">Attributes</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {Array.isArray(item.attributes) ? item.attributes.length : 0}
          </p>
        </div>
      </div>
    )}
  </div>
))}


      <div className="flex flex-col items-center p-4">
        <ButtonOutline
          className="mt-4 border w-full py-2 rounded-md font-bold"
          onClick={handleCreate}
        >
          CREATE CREDENTIAL
        </ButtonOutline>
      </div>
    </div>
  );
};