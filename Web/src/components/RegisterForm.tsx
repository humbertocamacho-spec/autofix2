import React, { useState } from "react";
import { register } from "../services/api";
import { useNavigate } from "react-router-dom";
import type { AuthResponse } from "../types";
import PhoneInput from "react-phone-input-2";
import type { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("52");

   // Checkbox y modal
  const [termsChecked, setTermsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    const data: AuthResponse = await register(
      name,
      phone,        
      countryCode,  
      email,
      password
    );

    if (!data.ok) {
      setError(data.message || "Error al registrarte");
      return;
    }

    navigate("/login");
  };

  const handleOpenModal = (privacy = false) => {
    setShowPrivacy(privacy);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowPrivacy(false);
  };

 return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-800">Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">Phone</label>

          <PhoneInput
            country={"mx"}
            value={`+${countryCode}${phone}`}
            onChange={(value: string, data: {} | CountryData) => {
              if ("dialCode" in data) {
                setCountryCode(data.dialCode);
                const cleanNumber = value.replace(new RegExp(`^${data.dialCode}`), "");
                setPhone(cleanNumber);
              } else {
                setPhone(value);
              }
            }}
            placeholder="+52 27367263728"
            inputStyle={{
              width: "100%",
              height: 42,
              fontSize: 14,
              borderRadius: 8,
              border: "1px solid #ccc",
              paddingLeft: 48,
              color: "#000",
            }}
            containerStyle={{ width: "100%" }}
            buttonStyle={{
              borderRadius: "8px 0 0 8px",
              border: "1px solid #ccc",
              borderRight: "none",
              height: 42,
            }}
            dropdownStyle={{ borderRadius: 8 }}
            enableSearch
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:bg-[#ffffff]"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center text-sm mt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
            />
            <span className="text-gray-700">
              Al marcar esta casilla aceptas nuestros{" "}
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={() => handleOpenModal(false)}
              >
                Términos y Condiciones
              </button>
            </span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="text-center">
          <button
            type="submit"
            disabled={!termsChecked}
            className={`w-full py-3 rounded-lg font-semibold transition
              ${termsChecked ? "bg-[#27B9BA] hover:bg-[#25afaf] text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Create Account
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
            <h2 className="text-lg font-bold mb-4">
              {showPrivacy ? "Aviso de Privacidad" : "Términos y Condiciones"}
            </h2>

            <div className="overflow-y-auto max-h-96 text-sm space-y-2">
              {!showPrivacy ? (
                <div className="whitespace-pre-line">
                  Al registrarte en AutoFix, aceptas los presentes Términos y Condiciones,
                  los cuales regulan el uso de la aplicación y los servicios ofrecidos.

                  {"\n\n"}• La información proporcionada deberá ser veraz, completa y actualizada.
                  {"\n"}• El usuario es responsable del uso correcto de su cuenta.
                  {"\n"}• El uso indebido de la aplicación podrá resultar en la suspensión o
                  cancelación de la cuenta.
                  {"\n"}• AutoFix no se hace responsable por información incorrecta ingresada
                  por el usuario.

                  {"\n\n"}
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setShowPrivacy(true)}
                  >
                    Ver Aviso de Privacidad
                  </button>
                </div>
              ) : (
                <div className="whitespace-pre-line">
                  En cumplimiento con la Ley Federal de Protección de Datos Personales en
                  Posesión de los Particulares (LFPDPPP), este aviso tiene como finalidad
                  informarle sobre el tratamiento de sus datos personales, las finalidades
                  para su uso y los derechos que le asisten como titular de los mismos.

                  {"\n\n"}IDENTIDAD Y DOMICILIO DEL RESPONSABLE
                  {"\n"}El responsable del tratamiento de sus datos personales es Rebrights
                  S.A. de C.V., con domicilio en Jaumave 3946, Colonia Residencial Abraham
                  Lincoln, Monterrey, Nuevo León, correo electrónico info@rebrights.com y
                  número telefónico 81 2148 0195.

                  {"\n\n"}DATOS PERSONALES RECABADOS
                  {"\n"}Recabamos los siguientes datos personales:
                  {"\n"}• Nombre completo
                  {"\n"}• Correo electrónico
                  {"\n"}• Número de teléfono
                  {"\n"}• Dirección
                  {"\n"}• Preferencias de consumo
                  {"\n"}• Cualquier otra información necesaria para las finalidades descritas.

                  {"\n\n"}FINALIDADES DEL TRATAMIENTO
                  {"\n"}Sus datos personales serán utilizados para:
                  {"\n"}• Ofrecer productos y servicios personalizados.
                  {"\n"}• Realizar campañas publicitarias y promocionales.
                  {"\n"}• Analizar preferencias y tendencias de consumo.
                  {"\n"}• Compartir información con socios comerciales y terceros para fines
                  comerciales y publicitarios.

                  {"\n\n"}TRANSFERENCIA DE DATOS PERSONALES
                  {"\n"}Sus datos personales podrán ser transferidos a terceros, nacionales
                  o extranjeros, incluyendo socios comerciales, agencias publicitarias y
                  proveedores de servicios tecnológicos, exclusivamente para las finalidades
                  señaladas en este aviso.

                  {"\n\n"}DERECHOS ARCO
                  {"\n"}Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (ARCO)
                  al tratamiento de sus datos personales. Para ejercer estos derechos, deberá
                  enviar una solicitud al correo electrónico info@rebrights.com, especificando
                  claramente su petición.

                  {"\n\n"}REVOCACIÓN DEL CONSENTIMIENTO
                  {"\n"}Usted puede revocar en cualquier momento el consentimiento otorgado
                  para el tratamiento de sus datos personales, enviando una solicitud al
                  correo info@rebrights.com.

                  {"\n\n"}CAMBIOS AL AVISO DE PRIVACIDAD
                  {"\n"}Nos reservamos el derecho de realizar modificaciones o actualizaciones
                  al presente aviso de privacidad. Cualquier cambio será publicado en el sitio
                  web www.rebrights.com.

                  {"\n\n"}Atentamente,
                  {"\n"}César Augusto Camacho Torres
                  {"\n"}Co-Fundador

                  {"\n\n"}
                  <button
                    className="text-blue-600 underline"
                    onClick={() => setShowPrivacy(false)}
                  >
                    ← Volver a Términos y Condiciones
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleCloseModal}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}