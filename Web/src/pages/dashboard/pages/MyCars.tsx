import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useAuthContext } from "../../../context/AuthContext";

export interface Car {
    id: number;
    name: string;
    car_brand_id: number;
    model: string;
    year: string;
    type: string;
    plate: string;
    brand_name?: string;
}

export default function MyCarsTable() {
    const { user } = useAuthContext(); // PARA OBTENER client_id

    const [cars, setCars] = useState<Car[]>([]);
    const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCar, setCurrentCar] = useState<Car | null>(null);

    // FORM
    const [name, setName] = useState("");
    const [carBrandId, setCarBrandId] = useState<number>(0);
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [type, setType] = useState("");
    const [plate, setPlate] = useState("");

    useEffect(() => {
        if (!user?.id) return;
        fetchCars();
        fetchBrands();
    }, [user]);

    const fetchCars = async () => {
        if (!user) return;
        try {
            const res = await fetch(`${VITE_API_URL}/api/cars/client/${user.id}`);
            const data = await res.json();
            setCars(data);
        } catch (error) {
            console.error("Error loading cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/car_brands`);
            const data = await res.json();
            setBrands(data);
        } catch (error) {
            console.error("Error loading brands:", error);
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrentCar(null);
        setName("");
        setCarBrandId(0);
        setModel("");
        setYear("");
        setType("");
        setPlate("");
        setOpenModal(true);
    };

    const openEditModal = (car: Car) => {
        setIsEditing(true);
        setCurrentCar(car);
        setName(car.name);
        setCarBrandId(car.car_brand_id);
        setModel(car.model);
        setYear(car.year);
        setType(car.type);
        setPlate(car.plate);
        setOpenModal(true);
    };

    const handleCreate = async () => {
        try {
            await fetch(`${VITE_API_URL}/api/cars`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    car_brand_id: carBrandId,
                    model,
                    year,
                    type,
                    plate,
                    client_id: user?.id
                }),
            });

            setOpenModal(false);
            fetchCars();
        } catch (error) {
            console.error("Error creating car:", error);
        }
    };

    const handleUpdate = async () => {
        if (!currentCar) return;

        try {
            await fetch(`${VITE_API_URL}/api/cars/${currentCar.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    car_brand_id: carBrandId,
                    model,
                    year,
                    type,
                    plate,
                }),
            });

            setOpenModal(false);
            fetchCars();
        } catch (error) {
            console.error("Error updating car:", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este vehículo?")) return;

        try {
            await fetch(`${VITE_API_URL}/api/cars/${id}`, {
                method: "DELETE",
            });

            fetchCars();
        } catch (error) {
            console.error("Error deleting car:", error);
        }
    };

    const filtered = cars.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.plate.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">My Cars</h1>

            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder="Buscar autos..."
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow"
                >
                    Agregar Auto
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">Cargando...</p>
                ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full table-fixed text-left">
                            <thead>
                                <tr className="text-gray-600 border-b">
                                    <th className="pb-3 w-20">ID</th>
                                    <th className="pb-3">Nombre</th>
                                    <th className="pb-3">Marca</th>
                                    <th className="pb-3">Modelo</th>
                                    <th className="pb-3">Año</th>
                                    <th className="pb-3">Placa</th>
                                    <th className="pb-3 text-right w-48 pr-6">Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((car) => (
                                    <tr key={car.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3">{car.id}</td>
                                        <td className="py-3">{car.name}</td>
                                        <td className="py-3">{car.brand_name}</td>
                                        <td className="py-3">{car.model}</td>
                                        <td className="py-3">{car.year}</td>
                                        <td className="py-3">{car.plate}</td>

                                        <td className="py-3 text-right pr-6">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => openEditModal(car)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm"
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(car.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No hay autos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[500px] rounded-2xl p-6 shadow-xl border border-gray-200">

                        <h2 className="text-2xl font-bold mb-4">
                            {isEditing ? "Editar Auto" : "Agregar Auto"}
                        </h2>

                        <div className="space-y-4">
                            <input
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <select
                                className="w-full border px-3 py-2 rounded-lg"
                                value={carBrandId}
                                onChange={(e) => setCarBrandId(Number(e.target.value))}
                            >
                                <option value={0}>Selecciona marca</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Modelo"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                            />

                            <input
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Año"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />

                            <input
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Tipo"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />

                            <input
                                className="w-full border px-3 py-2 rounded-lg"
                                placeholder="Placa"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg"
                                onClick={isEditing ? handleUpdate : handleCreate}
                            >
                                {isEditing ? "Guardar" : "Crear"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
