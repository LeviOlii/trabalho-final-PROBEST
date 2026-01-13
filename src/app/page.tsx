'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';

import { ImageUpload } from '@/components/ImageUpload';
import { PredictButton } from '@/components/PredictButton';
import { ResultCard } from '@/components/ResultCard';

import { postProcessAccidentImage } from '@/service/api/accident';
import { AccidentProcessResult } from '@/service/api/types';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState<AccidentProcessResult | null>(null);

  function handleLogout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/entrar';
  }

  async function handlePredict() {
    if (!image) return;

    setStatus('loading');
    setResult(null);

    try {
      const data = await postProcessAccidentImage(image);
      setResult(data);
      setStatus('done');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.response?.status === 403) {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/entrar';
        return;
      }
      setResult({ message: 'Erro ao processar imagem' });
      setStatus('done');
    }
  }

  function handleReset() {
    setImage(null);
    setStatus('idle');
    setResult(null);
  }

  function getActionsBySeverity(severity?: string) {
    if (severity === 'severe') {
      return [
        {
          label: 'Chamar emergência 190',
          action: () => console.log('Chamando emergência...'),
        },
        {
          label: 'Acionar seguro',
          action: () => window.open('https://www.google.com/search?q=acionar+seguro+auto'),
        },
        {
          label: 'Localizar oficina próxima',
          action: () => window.open('https://www.google.com/maps/search/oficina+auto+perto+de+mim'),
        },
      ];
    }
    if (severity === 'moderate') {
      return [
        {
          label: 'Acionar seguro',
          action: () => window.open('https://www.google.com/search?q=acionar+seguro+auto'),
        },
        {
          label: 'Localizar oficina próxima',
          action: () => window.open('https://www.google.com/maps/search/oficina+auto+perto+de+mim'),
        },
      ];
    }
    if (severity === 'not_accident') {
      return [];
    }
    return [];
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md relative">
        <div className="flex justify-end mb-2">
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-red-600 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>
        <header className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Classificador de Acidentes</h1>
          <p className="text-gray-500">Envie uma imagem para analisar a severidade</p>
        </header>

        <div className="space-y-6">
          <ImageUpload onImageSelect={setImage} />

          <PredictButton
            disabled={!image || status === 'loading'}
            loading={status === 'loading'}
            onClick={handlePredict}
          />

          <button
            onClick={() => (window.location.href = '/historico')}
            className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium mb-2"
          >
            Ver histórico
          </button>

          {status === 'done' && result && (
            <div className="space-y-4">
              <ResultCard result={result} />
              {result.details?.class && (
                <div className="space-y-2">
                  {getActionsBySeverity(result.details.class).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-900 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              <button
                onClick={handleReset}
                className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Analisar outra imagem
              </button>
            </div>
          )}
        </div>

        <footer className="mt-16 text-center">
          <p className="text-xs text-gray-400">Trabalho Final — PROBEST</p>
        </footer>
      </div>
    </main>
  );
}
