import { createContext, useState, useEffect, useContext } from "react";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
 } from 'firebase/auth';
import auth from "../Firebase";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={ value }>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}