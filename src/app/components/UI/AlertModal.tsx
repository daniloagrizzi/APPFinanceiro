"use client";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 ease-out scale-100 opacity-100 animate-slideIn">
        <div className="flex flex-col items-center">
          {/* Ícone de Sucesso */}
          <div className="text-green-500 text-6xl mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-800 text-2xl font-bold mb-3 text-center">Sucesso!</p>
          <p className="text-gray-600 text-base mb-8 text-center leading-relaxed">{message}</p>
          <button
            onClick={onClose}
            className="cursor-pointer px-8 py-3 rounded-full cursor-pointer bg-indigo-600 text-white font-medium text-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}