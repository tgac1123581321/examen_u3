"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!correo.trim() || !contrasena.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const userCredential = await autenticarUsuario(correo, contrasena);
      setUsuario({ email: userCredential.user.email || "" });
    } catch (err: any) {
      setError("Credenciales incorrectas o error de conexión.");
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    try {
      await cerrarSesionUsuario();
      setUsuario(null);
      setCorreo("");
      setContrasena("");
    } catch (err) {
      setError("Hubo un problema al cerrar la sesión.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12">
      <section className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Acceso escolar</h1>
          <p className="text-gray-500 mt-2">Completa la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="correo" className="block text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                disabled={cargando}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  cargando ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-600"
                }`}
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contrasena" className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                disabled={cargando}
                className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
                  cargando ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-600"
                }`}
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="recordarme"
                type="checkbox"
                disabled={cargando}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded-lg cursor-pointer disabled:cursor-not-allowed"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
              />
              <label htmlFor="recordarme" className="text-sm font-medium text-gray-600 cursor-pointer select-none">
                Recordarme
              </label>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={cargando} 
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transform active:scale-95 transition-all
                ${cargando ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}`}
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-8">
            <div className="bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
              <span className="inline-block p-2 bg-emerald-100 rounded-full mb-3">
                <p className="text-emerald-700 font-bold italic text-xs uppercase tracking-widest">Éxito</p>
              </span>
              <p className="text-emerald-800 font-medium">Inicio de sesión correcto</p>
              <h2 className="text-2xl font-black text-gray-900 mt-2">Bienvenido,</h2>
              <p className="text-lg text-emerald-900 font-semibold truncate">{usuario.email}</p>
            </div>

            <button 
              type="button" 
              onClick={salir} 
              className="w-full py-3.5 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
