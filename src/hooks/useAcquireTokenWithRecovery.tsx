import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import type {
  AuthenticationResult,
  RedirectRequest,
  SilentRequest,
} from "@azure/msal-browser";

function isMsalError(e: unknown): e is { errorCode: string } {
  if (typeof e === "object" &&  e !== null &&  "errorCode" in e) 
  {
    const record = e as Record<string, unknown>;
    return typeof record.errorCode === "string";
  }
  return false;
}

/*
      acquireTokenRedirect is meant for:
        - getting additional scopes
        - after the user is already signed in
        - using an existing valid account

      But after a "timed_out":

        - the user is not signed in anymore
        - the account is stale
        - the session cookie is gone
        - MSAL cannot complete the redirect flow cleanly
      
        So acquireTokenRedirect is the wrong tool for the job.

        //A "timed_out" error means the account is stale, acquireTokenRedirect will not work and a fresh login is needed
        //Microsoft’s guidance is: if silent SSO times out, treat the account as invalid and force a clean login.
*/

export function useAcquireTokenWithRecovery() {
  const { instance } = useMsal();

  // 2. Wrap the entire function in useCallback
  const acquireTokenWithRecovery = useCallback(async (
    request: SilentRequest & RedirectRequest
  ): Promise<AuthenticationResult | void> => {

    const accounts = instance.getAllAccounts();

    if (accounts.length === 0) {
      return instance.loginRedirect({
        ...request,
        prompt: "login",
      });
    }

    const account = accounts[0];

    try {
      return await instance.acquireTokenSilent({
        ...request,
        account,
      });
    } catch (e: unknown) {
      if (isMsalError(e)) {
        if (e.errorCode === "timed_out") {
          return instance.loginRedirect({
            ...request,
            prompt: "login",
          });
        }

        if (e.errorCode === "interaction_required") {
          return instance.loginRedirect(request);
        }
      }
      throw e;
    }
    // 3. Dependency on 'instance' ensures the function is stable
  }, [instance]); 

  return acquireTokenWithRecovery;
}
