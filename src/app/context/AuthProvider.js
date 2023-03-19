import { createContext, useState, useEffect, useContext } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import auth from "../Firebase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  async function signup(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
  }

  async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  async function logout() {
    return await signOut(auth)
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
    // await sendPasswordResetEmail(auth, 'user@example.com', actionCodeSettings);
    // // Obtain code from user.
    // await confirmPasswordReset('user@example.com', code);
  }

  function updateEmail(email) {
    return updateEmail(currentUser, email)
  }

  function updatePassword(password) {
    return updatePassword(currentUser, password)
  }

  function verifyEmail(user) {
    return sendEmailVerification(user)
  }

  function deleteSignedInUser(user, password) {
    const credentials = EmailAuthProvider.credential(user.email, password);
    reauthenticateWithCredential(user, credentials)
      .then(async userCreds => {
        await deleteUser(userCreds.user)
        await fetch('/.netlify/functions/UserManager', {
          method: 'DELETE',
          body: JSON.stringify({email: userCreds.user.email})
        })
      })
      .catch(error => { throw new Error(error?.message ?? "Failed to delete account.") })

    return true
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      if (user) {
        let status = user?.emailVerified ?? false
        setEmailVerified(status)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    emailVerified,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    verifyEmail,
    updatePassword,
    deleteSignedInUser
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}