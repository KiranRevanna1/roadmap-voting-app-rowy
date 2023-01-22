import { useSubmit } from "@remix-run/react";
import { getApp, getApps, initializeApp } from "firebase/app";
import type { UserCredential } from "firebase/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import IconGoogle from "../svg/icon-google";

export const LoginButton = ({ firebaseConfig }: any) => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  // TODO error handling / web-api-key missing
  const auth = getAuth(app);

  const submit = useSubmit();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await signInWithPopup(auth, new GoogleAuthProvider()).then(
      (result: UserCredential) => {
        const user = result.user;
        user.getIdToken(true).then((token: string) => {
          submit({ token }, { action: "/auth/login", method: "post" });
        });
      },
      (error: any) => {
        // TODO error handling / auth domain missing
        throw new Error(error);
      }
    );
  };

  return (
    <button className="btn btn-ghost" onClick={handleLogin} disabled={loading}>
      <span className="flex items-center gap-1">
        <IconGoogle />
        <span className="w-20 sm:w-full overflow-hidden text-ellipsis whitespace-nowrap">
          Sign in with Google
        </span>
      </span>
    </button>
  );
};

export const LogoutButton = ({ firebaseConfig }: any) => {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);

  const submit = useSubmit();

  const handleLogout = async () => {
    await auth.signOut();
    submit(null, { action: "/auth/logout", method: "post" });
  };

  return <button onClick={handleLogout}>Logout</button>;
};
