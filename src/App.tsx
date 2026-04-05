import { useEffect, useState, useCallback} from "react";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { PageLayout } from "./components/PageLayout";
import { SearchBox } from "./components/SearchBox";
import { SearchResultsView } from "./components/SearchResultsView";
import Divider  from '@mui/material/Divider';
import { InteractionType } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { apiRequest } from "./authConfig";
import { useAcquireTokenWithRecovery } from "./hooks/useAcquireTokenWithRecovery";

import "./App.css";


const API_ENDPOINT_ENTRA_AUTH = import.meta.env.VITE_API_URL_ENTRA_AUTH;

const API_SCOPE = import.meta.env.VITE_API_SCOPE;
const isIframe = window.self !== window.top; // Immediate check


function App() {
  const { instance, accounts } = useMsal();

  // Business State
  const [region, setRegion] = useState("");
  const [userName, setUserName] = useState<string |null|undefined>("");
  const [searchResult, setSearchResult] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  

  const acquireTokenWithRecovery = useAcquireTokenWithRecovery();

  /**
   * Fetches the user region from the backend API for standalone app.
   */
  const getUserInfo_Entra = useCallback(async (username:string) => {

    const apiUrl = `${API_ENDPOINT_ENTRA_AUTH}?function_code=get_region_of_user&AgentUserName=${encodeURIComponent(username)}`;

    try 
    {
      setLoading(true);

      const authResult = await acquireTokenWithRecovery({ ...apiRequest });

      // 2. Guard against missing tokens
      if (!authResult?.accessToken) 
      {
        throw new Error("Failed to acquire a valid access token.");
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: 
        {
          Authorization: `Bearer ${authResult.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) 
      {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data?.success && data?.found) 
      {
        setRegion(data.region);
        console.log("User region identified:", data.region);

      }
    } 
    catch (error) 
    {
      console.error("Failed to fetch user region:", error);      
    }
    finally 
    {
      setLoading(false);
    }
    // Include all stable dependencies
  }, [ acquireTokenWithRecovery]);
  
  
  useEffect(() => {
    
    // 1. Standalone logic
    if (accounts.length > 0) 
    {
      console.info("In Standalone logic");
      instance.setActiveAccount(accounts[0]);
      const username = accounts[0].idTokenClaims?.preferred_username;
      setUserName(username ?? "Unknown User");
      if (!username) 
      {
        console.warn("No preferred_username found in claims.");
        return;
      }
      getUserInfo_Entra(username);
    }

   
  }, [accounts, instance, getUserInfo_Entra, , accounts.length]);

  
  // Main UI Fragment to keep code DRY
  const renderMainContent = () => (
    <PageLayout userName={userName ?? "User"}  region={region}>
      {loading ? (
        <p>Loading preferences...</p>
      ) : (
        <>
          <SearchBox region={region} entraAuth={!isIframe}  onSearchResultChange={setSearchResult} />
          <Divider sx={{ my: 0.5, border: "1px solid", borderColor: "primary.dark" }} />
          {searchResult && (<SearchResultsView searchResult={searchResult} userName={userName}  entraAuth={!isIframe}  />)}
        </>
      )}
    </PageLayout>
  );

  return (
    <>
      {isIframe ? ( renderMainContent())
      : (
         <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}
            authenticationRequest={{scopes: ["openid", "profile", `${API_SCOPE}`],}}
            errorComponent={({ error }) => <pre>Error: {error?.errorMessage}</pre>}
            loadingComponent={() => <span>Launching Login redirect...</span>}>
            { accounts.length &&  renderMainContent()}      
        </MsalAuthenticationTemplate>
      )}
      </>
  );
}

export default App;
