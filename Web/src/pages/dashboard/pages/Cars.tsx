import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useTranslation } from "react-i18next";
import type { Cars } from "../../../types/car";


export default function CarsTable() {
    const { t } = useTranslation();
    const [cars, setCars] = useState<Cars[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<Cars | null>(null);

    const [name, setName] = useState("");
    const [brandId, setBrandId] = useState<number | "">("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [type, setType] = useState("");
    const [plate, setPlate] = useState("");
    const [clientId, setClientId] = useState<number | "">("");

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/cars`);
            const data = await res.json();
            setCars(data);
        } catch (error) {
            console.error("Error fetching cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/api/cars`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    car_brand_id: brandId,
                    model,
                    year,
                    type,
                    plate,
                    client_id: clientId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error creando vehículo");
                return;
            }

            setOpenModal(false);
            fetchCars();
        } catch (error) {
            console.error("Error creating car:", error);
        }
    };

    const handleUpdate = async () => {
        if (!current) return;

        try {
            const res = await fetch(`${VITE_API_URL}/api/cars/${current.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    car_brand_id: brandId,
                    model,
                    year,
                    type,
                    plate,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error actualizando vehículo");
                return;
            }

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

    const openCreateModal = () => {
        setIsEditing(false);
        setCurrent(null);

        setName("");
        setBrandId("");
        setModel("");
        setYear("");
        setType("");
        setPlate("");
        setClientId("");

        setOpenModal(true);
    };

    const openEditModal = (car: Cars) => {
        setIsEditing(true);
        setCurrent(car);

        setName(car.name);
        setBrandId(car.car_brand_id);
        setModel(car.model);
        setYear(car.year);
        setType(car.type);
        setPlate(car.plate);
        setClientId(car.client_id);

        setOpenModal(true);
    };

    const filtered = cars.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.model.toLowerCase().includes(search.toLowerCase()) ||
        c.plate.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6">Cars</h1>

            <div className="mb-6 flex justify-between">
                <input
                    type="text"
                    placeholder="Search cars..."
                    className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
                >
                    Add Car
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                {loading ? (
                    <p className="text-center py-10 text-gray-500">Loading...</p>
                ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full table-fixed text-left">
                            <thead>
                                <tr className="text-gray-600 border-b">
                                    <th className="pb-3 w-20">ID</th>
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Model</th>
                                    <th className="pb-3">Year</th>
                                    <th className="pb-3">Type</th>
                                    <th className="pb-3">Plate</th>
                                    <th className="pb-3 text-right w-48 pr-6">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filtered.map((car) => (
                                    <tr key={car.id} className="border-b hover:bg-gray-50 text-gray-700">
                                        <td className="py-3">{car.id}</td>
                                        <td className="py-3 truncate">{car.name}</td>
                                        <td className="py-3 truncate">{car.model}</td>
                                        <td className="py-3">{car.year}</td>
                                        <td className="py-3">{car.type}</td>
                                        <td className="py-3">{car.plate}</td>

                                        <td className="py-3 text-right pr-6">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => openEditModal(car)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(car.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500">
                                            No results
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
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            {isEditing ? "Edit Car" : "Add Car"}
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <label className="text-sm font-semibold text-gray-600">Name</label>
                                <input
                                    className="w-full border px-3 py-2 rounded-lg"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">Model</label>
                                <input
                                    className="w-full border px-3 py-2 rounded-lg"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">Brand ID</label>
                                <input
                                    type="number"
                                    className="w-full border px-3 py-2 rounded-lg"
                                    value={brandId}
                                    onChange={(e) => setBrandId(Number(e.target.value))}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">Year</label>
                                <input
                                    maxLength={4}
                                    className="w-full border px-3 py-2 rounded-lg"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">Type</label>
                                <input
                                    className="w-full border px-3 py-2 rounded-lg"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600">Plate</label>
                                <input
                                    className="w-full border px-3 py-2 rounded-lg"
                                    value={plate}
                                    onChange={(e) => setPlate(e.target.value)}
                                />
                            </div>

                            {!isEditing && (
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Client ID</label>
                                    <input
                                        type="number"
                                        className="w-full border px-3 py-2 rounded-lg"
                                        value={clientId}
                                        onChange={(e) => setClientId(Number(e.target.value))}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                                onClick={() => setOpenModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={isEditing ? handleUpdate : handleCreate}
                                className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6]"
                            >
                                {isEditing ? "Save" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
