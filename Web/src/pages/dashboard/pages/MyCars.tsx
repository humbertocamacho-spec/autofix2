import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { VITE_API_URL } from "../../../config/env";
import { useAuthContext } from "../../../context/AuthContext";
import type { Cars } from "../../../types/cars";
import type { CarBrands } from "../../../types/car_brands";
import { useTranslation } from "react-i18next";

export default function MyCarsTable() {
    const { user } = useAuthContext();
    const { t } = useTranslation();

    const [cars, setCars] = useState<Cars[]>([]);
    const [brands, setBrands] = useState<CarBrands[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCar, setCurrentCar] = useState<Cars | null>(null);

    const [name, setName] = useState("");
    const [car_brand_id, setCarBrandId] = useState<number>(0);
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
        try {
            const res = await fetch(
                `${VITE_API_URL}/api/car_clients/client/${user!.id}`
            );

            const data = await res.json();
            setCars(data);
        } catch (error) {
            console.error("Error fetching cars:", error);
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
            console.error("Error fetching brands:", error);
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

    const openEditModal = (car: Cars) => {
        setIsEditing(true);
        setCurrentCar(car);

        setName(car.name);
        setCarBrandId(car.car_brand_id);
        setModel(car.model);
        setYear(String(car.year));
        setType(car.type);
        setPlate(car.plate);

        setOpenModal(true);
    };

    const validateForm = () => {
        if (!name.trim() || !model.trim() || !plate.trim()) {
            alert("Completa todos los campos obligatorios.");
            return false;
        }

        if (car_brand_id === 0) {
            alert("Selecciona una marca.");
            return false;
        }

        if (!/^\d{4}$/.test(year)) {
            alert("El año debe tener exactamente 4 números.");
            return false;
        }

        if (!type.trim()) {
            alert("El campo 'Tipo' es obligatorio.");
            return false;
        }

        return true;
    };

    const handleCreate = async () => {
        if (!user?.id) return;
        if (!validateForm()) return;

        try {
            const res = await fetch(`${VITE_API_URL}/api/cars`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    car_brand_id,
                    model,
                    year: Number(year),
                    type,
                    plate,
                    client_id: user.id, 
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error al crear vehículo");
                return;
            }

            alert("Vehículo creado correctamente");
            setOpenModal(false);
            fetchCars();

        } catch (error) {
            console.error("Error creating car:", error);
            alert("Error creando el vehículo");
        }
    };

    const handleUpdate = async () => {
        if (!currentCar) return;
        if (!validateForm()) return;

        try {
            const res = await fetch(`${VITE_API_URL}/api/cars/${currentCar.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    car_brand_id,
                    model,
                    year: Number(year),
                    type,
                    plate,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error al actualizar");
                return;
            }

            alert("Vehículo actualizado correctamente");
            setOpenModal(false);
            fetchCars();

        } catch (error) {
            console.error("Error updating car:", error);
            alert("Error actualizando el vehículo");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este vehículo?")) return;

        try {
            const res = await fetch(`${VITE_API_URL}/api/cars/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Error al eliminar");
                return;
            }

            alert("Vehículo eliminado correctamente");
            fetchCars();

        } catch (error) {
            console.error("Error deleting car:", error);
            alert("Error eliminando el vehículo");
        }
    };

    const filtered = cars.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.brand_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.model.toLowerCase().includes(search.toLowerCase()) ||
        c.plate.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            {!user ? (
                <p className="text-center py-10">{t("myCars_screen.loading")}</p>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-6">{t("myCars_screen.title")}</h1>

                    <div className="mb-6 flex justify-between">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-80 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#27B9BA]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow hover:bg-[#1da5a6] transition"
                        >
                            {t("myCars_screen.add_button")}
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                        {loading ? (
                            <p className="text-center py-10 text-gray-500">{t("myCars_screen.loading")}</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-600 border-b">
                                            <th className="pb-3">{t("myCars_screen.table.name")}</th>
                                            <th className="pb-3">{t("myCars_screen.table.brand")}</th>
                                            <th className="pb-3">{t("myCars_screen.table.model")}</th>
                                            <th className="pb-3">{t("myCars_screen.table.year")}</th>
                                            <th className="pb-3">{t("myCars_screen.table.type")}</th>
                                            <th className="pb-3">{t("myCars_screen.table.plate")}</th>
                                            <th className="pb-3 text-right w-40 pr-6">{t("myCars_screen.table.actions")}</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filtered.map((car) => (
                                            <tr key={car.id} className="border-b hover:bg-gray-50 text-gray-700">
                                                <td className="py-3">{car.name}</td>
                                                <td className="py-3">{car.brand_name}</td>
                                                <td className="py-3">{car.model}</td>
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
                                    </tbody>
                                </table>

                                {filtered.length === 0 && (
                                    <p className="text-center py-6 text-gray-500">{t("myCars_screen.no_results")}</p>
                                )}
                            </div>
                        )}
                    </div>

                    {openModal && (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white w-[450px] rounded-2xl p-6 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {isEditing ? t("myCars_screen.edit_title") : t("myCars_screen.create_title")}
            </h2>

            <div className="space-y-4">

                {/* Name */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        {t("myCars_screen.table.name")}
                    </label>
                    <input
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg 
                                   focus:ring-2 focus:ring-[#27B9BA]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Brand */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        {t("myCars_screen.table.brand")}
                    </label>
                    <select
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg
                                   focus:ring-2 focus:ring-[#27B9BA]"
                        value={car_brand_id}
                        onChange={(e) => setCarBrandId(Number(e.target.value))}
                    >
                        <option value="0">{t("myCars_screen.table.select_brand")}</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                {/* Model */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        {t("myCars_screen.table.model")}
                    </label>
                    <input
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg
                                   focus:ring-2 focus:ring-[#27B9BA]"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    />
                </div>

                {/* Year */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        {t("myCars_screen.table.year")}
                    </label>
                    <input
                        type="number"
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg
                                   focus:ring-2 focus:ring-[#27B9BA]"
                        value={year}
                        onChange={(e) => setYear(e.target.value.slice(0, 4))}
                        min="1900"
                        max="2099"
                    />
                </div>

                {/* Type */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        {t("myCars_screen.table.type")}
                    </label>
                    <input
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg
                                   focus:ring-2 focus:ring-[#27B9BA]"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                </div>

                {/* Plate */}
                <div>
                    <label className="text-sm font-semibold text-gray-600">
                        {t("myCars_screen.table.plate")}
                    </label>
                    <input
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg
                                   focus:ring-2 focus:ring-[#27B9BA]"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                    />
                </div>

            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                    onClick={() => setOpenModal(false)}
                >
                    {t("myCars_screen.cancel")}
                </button>

                <button
                    onClick={isEditing ? handleUpdate : handleCreate}
                    className="px-4 py-2 bg-[#27B9BA] text-white rounded-lg shadow 
                               hover:bg-[#1da5a6] transition"
                >
                    {isEditing ? t("myCars_screen.save") : t("myCars_screen.create")}
                </button>
            </div>
        </div>
    </div>
)}

                </>
            )}
        </DashboardLayout>
    );
}
