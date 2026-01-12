import { ImageUpload } from "../src/components/ImageUpload";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-xl p-6 flex flex-col gap-4">
        <h1 className="text-center text-2xl font-semibold text-gray-100">
          Classificador de Acidentes
        </h1>

        <p className="text-center text-sm text-gray-400">
          Envie uma imagem para prever a severidade do acidente.
        </p>

        <ImageUpload />
      </div>
    </main>
  );
}
