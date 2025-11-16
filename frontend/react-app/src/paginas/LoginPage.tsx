import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../api/client.ts";

export default function LoginPage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      // 1) LOGIN
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          dni: Number(dni),
          password,
        }),
      });

      if (!res.ok) {
        setErrorMsg("Credenciales incorrectas");
        return;
      }

      const data = await res.json(); // { access_token, token_type, ... }
      const token = data.access_token as string;

      if (!token) {
        setErrorMsg("Respuesta inválida del servidor");
        return;
      }

      // 2) Guardar token en localStorage para el siguiente fetch
      localStorage.setItem("token", token);

      // 3) Pedir permisos/roles
      const permRes = await apiFetch("/seguridad/me/permissions");
      if (!permRes.ok) {
        setErrorMsg("No se pudieron obtener los permisos");
        return;
      }

      const permData = await permRes.json();
      const roles: string[] = permData.roles ?? [];

      // 4) Guardar en AuthContext
      login(token, roles);

      // 5) Redirección según rol
      if (roles.includes("docente")) {
        navigate("/docente");
      } else if (roles.includes("alumno")) {
        navigate("/alumno");
      } else if (roles.includes("departamento")) {
        navigate("/departamento");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocurrió un error al intentar iniciar sesión");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow"
        style={{ width: "380px" }}
      >
        <h2 className="text-center mb-4">Iniciar sesión</h2>

        <div className="mb-3">
          <label>DNI</label>
          <input
            type="text"
            className="form-control"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="text-danger">{errorMsg}</p>}

        <button className="btn btn-primary w-100 mt-3" type="submit">
          Ingresar
        </button>
      </form>
    </div>
  );
}
