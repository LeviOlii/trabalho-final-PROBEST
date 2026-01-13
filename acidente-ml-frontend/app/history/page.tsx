"use client";

import Image from "next/image";

const mockData = [
  {
    id: 1,
    imageUrl: "/accident.jpeg",
    result: "grave",
    confidence: 0.92,
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    imageUrl: "/accident.jpeg",
    result: "moderado",
    confidence: 0.74,
    createdAt: "2025-01-09",
  },
  {
    id: 3,
    imageUrl: "/accident.jpeg",
    result: "nao_acidente",
    confidence: 0.88,
    createdAt: "2025-01-08",
  },
];

function ResultBadge({ result }: { result: string }) {
  const colors: Record<string, string> = {
    grave: "bg-red-500/20 text-red-400",
    moderado: "bg-yellow-500/20 text-yellow-400",
    nao_acidente: "bg-green-500/20 text-green-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colors[result]}`}
    >
      {result.replace("_", " ")}
    </span>
  );
}

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl p-6 shadow-xl">
        <h1 className="text-xl font-semibold text-gray-100 mb-6">
          Histórico de Análises
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-3">Imagem</th>
                <th>Resultado</th>
                <th>Confiança</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {mockData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-700 last:border-none"
                >
                  <td className="py-3">
                    <Image
                      src={item.imageUrl}
                      alt="Acidente"
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </td>

                  <td>
                    <ResultBadge result={item.result} />
                  </td>

                  <td className="text-gray-300">
                    {(item.confidence * 100).toFixed(1)}%
                  </td>

                  <td className="text-gray-400">{item.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
