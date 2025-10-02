import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../lib/firebase";

const auth = getAuth(app);

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
