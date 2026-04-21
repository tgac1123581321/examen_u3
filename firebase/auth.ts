import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export async function configurarPersistencia(recordarme: boolean): Promise<void> {
  try {

    const persistencia = recordarme 
      ? browserLocalPersistence 
      : browserSessionPersistence;
      
    await setPersistence(auth, persistencia);
  } catch (error) {
    console.error("Error en persistencia:", error);
    throw error;
  }
}

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  try {
    
    const userCredential = await signInWithEmailAndPassword(auth, correo, contrasena);
    return userCredential;
  } catch (error) {
    
    throw error;
  }
}

export async function cerrarSesionUsuario(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
}
