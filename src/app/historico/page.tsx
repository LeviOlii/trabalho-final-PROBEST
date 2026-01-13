'use client';

import { getAccidentHistory } from '@/service/api/accident';
import { AccidentHistoryItem } from '@/service/api/types';
import { useEffect, useState } from 'react';

function ResultBadge({ result }: { result: string }) {
  const getColor = (res: string) => {
    if (res === 'severe') return 'text-red-600 bg-red-50';
    if (res === 'moderate') return 'text-yellow-600 bg-yellow-50';
    if (res === 'not_accident') return 'text-green-600 bg-green-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColor(result)}`}>
      {result === 'severe'
        ? 'Alta severidade'
        : result === 'moderate'
          ? 'Média severidade'
          : result === 'not_accident'
            ? 'Sem acidente'
            : result}
    </span>
  );
}

export default function HistoryPage() {
  const [data, setData] = useState<AccidentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccidentHistory()
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-start mb-6">
          <button
            onClick={() => (window.location.href = '/')}
            className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Voltar para análise
          </button>
        </div>
        <header className="mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Histórico</h1>
          <p className="text-gray-500">Análises realizadas anteriormente</p>
        </header>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-400">Carregando...</p>
          ) : data.length === 0 ? (
            <p className="text-center text-gray-400">Nenhum histórico encontrado.</p>
          ) : (
            data.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt="Imagem analisada"
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <ResultBadge result={item.result} />
                  <p className="text-sm text-gray-500 mt-2">
                    Confiança: {(item.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-xs text-gray-400">{item.user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <footer className="mt-16 text-center">
          <p className="text-xs text-gray-400">Trabalho Final — PROBEST</p>
        </footer>
      </div>
    </main>
  );
}
