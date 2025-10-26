// export function useInformeBase() {
//   async function fetchInformeBaseActual() {
//     const res = await fetch("http://localhost:8000/informes-base/actual");
//     // Ajustá la URL a lo que tengas. Puede ser /informes-base/1 si por ahora es fijo.
//     if (!res.ok) throw new Error("No se pudo obtener el informe base");
//     return await res.json(); // { id, titulo, preguntas: [...] }
//   }

//   return { fetchInformeBaseActual };
// }

// export function useInformeBase() {
//   async function fetchInformeBaseActual() {
//     const res = await fetch("http://localhost:8000/informes-base/1"); // <- id fijo por ahora
//     if (!res.ok) {
//       throw new Error("No se pudo obtener el informe base");
//     }
//     return await res.json();
//   }

//   return { fetchInformeBaseActual };
// }

const API_URL = "http://localhost:8000";

export function useInformeBase() {
  async function fetchInformeBaseActual() {
    const res = await fetch(`${API_URL}/informes-base/actual`);
    if (!res.ok) {
      throw new Error("No se pudo obtener el informe base actual");
    }
    return await res.json();
  }
  return { fetchInformeBaseActual };
}
