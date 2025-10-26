import { useState, useEffect } from "react";
import type { InformeCurricular } from "../types/models/InformeCurricular";

export function useInformesCurriculares() {
    const [informesCurriculares, setInformesCurriculares] = useState<InformeCurricular[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = "http://localhost:8000/informes-curriculares";

    const fetchInformes = async () => {
    try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Error al obtener los informes");
        }
        const data = await response.json();
        setInformesCurriculares(data);
        setError(null);
        } catch (err: any) {
        setError(err.message);
        }finally {
        setLoading(false);
    }
};

    const fetchInformeById = async (id: number) => {
        try {
        setLoading(true);
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Error al obtener el informe");
        }
        const data = await response.json();
        setInformesCurriculares((prev) => [...prev, data]);
        setError(null);
        return data;
        } catch (err: any) {
        setError(err.message);
        return null;
        } finally {
        setLoading(false);
    }
};

    useEffect(() => {
    fetchInformes();
    }, []);

return {
    informesCurriculares,
    loading,
    error,
    refetch: fetchInformes,
    fetchInformeById,
};
}
