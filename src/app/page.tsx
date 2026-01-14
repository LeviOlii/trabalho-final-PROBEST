'use client';

import Cookies from 'js-cookie';
import {
  LucideCheckCircle2,
  LucideHistory,
  LucideInfo,
  LucideLayoutDashboard,
  LucideLoader2,
  LucideLogOut,
  LucideMapPin,
  LucidePhoneCall,
  LucideShieldCheck,
  LucideUploadCloud,
  LucideZap,
} from 'lucide-react';
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
        handleLogout();
        return;
      }
      setResult({ message: 'Erro ao processar imagem. Tente novamente.' });
      setStatus('done');
    }
  }

  function handleReset() {
    setImage(null);
    setStatus('idle');
    setResult(null);
  }

  const getActionsBySeverity = (severity?: string) => {
    const actions = {
      severe: [
        {
          label: 'Chamar Emergência 112',
          icon: <LucidePhoneCall className="w-4 h-4" />,
          primary: true,
          action: () => alert('A ligar para o 112...'),
        },
        {
          label: 'Acionar Seguro Auto',
          icon: <LucideShieldCheck className="w-4 h-4" />,
          primary: false,
          action: () => window.open('https://www.google.com/search?q=acionar+seguro+auto'),
        },
        {
          label: 'Oficina Mais Próxima',
          icon: <LucideMapPin className="w-4 h-4" />,
          primary: false,
          action: () => window.open('https://www.google.com/maps/search/oficina+auto'),
        },
      ],
      moderate: [
        {
          label: 'Acionar Seguro Auto',
          icon: <LucideShieldCheck className="w-4 h-4" />,
          primary: true,
          action: () => window.open('https://www.google.com/search?q=acionar+seguro+auto'),
        },
        {
          label: 'Oficina Mais Próxima',
          icon: <LucideMapPin className="w-4 h-4" />,
          primary: false,
          action: () => window.open('https://www.google.com/maps/search/oficina+auto'),
        },
      ],
      not_accident: [],
    };
    return actions[severity as keyof typeof actions] || [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Navegação SaaS */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LucideZap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">AutoSeguro</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-xl transition-colors">
            <LucideLayoutDashboard className="w-5 h-5" />
            Nova Análise
          </button>
          <button
            onClick={() => (window.location.href = '/historico')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
          >
            <LucideHistory className="w-5 h-5" />
            Histórico
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LucideLogOut className="w-5 h-5" />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-grow p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Mobile & Título */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análise de Incidente</h1>
              <p className="text-gray-500 text-sm mt-1">
                Carregue a evidência visual para classificação instantânea via IA.
              </p>
            </div>
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <LucideLayoutDashboard />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Coluna de Entrada (Upload) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all">
                <div className="p-1">
                  {/* Reaproveita o componente ImageUpload com estilos modernos */}
                  <ImageUpload onImageSelect={setImage} />
                </div>

                <div className="p-6 bg-white">
                  <PredictButton
                    disabled={!image || status === 'loading'}
                    loading={status === 'loading'}
                    onClick={handlePredict}
                  />

                  {!image && (
                    <div className="mt-4 flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <LucideInfo className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        Certifique-se de que a foto está bem iluminada e foca nos danos estruturais
                        do veículo para uma previsão mais precisa.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coluna de Resultados / Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estado Inicial / Vazio */}
              {status === 'idle' && !result && (
                <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <LucideZap className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-gray-900 font-semibold">Aguardando Análise</h3>
                  <p className="text-gray-500 text-xs mt-2 px-4 leading-relaxed">
                    Os resultados da inteligência artificial aparecerão aqui após o carregamento da
                    imagem.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {status === 'loading' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center h-full flex flex-col items-center justify-center">
                  <LucideLoader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                  <h3 className="text-gray-900 font-semibold">Processando Evidência</h3>
                  <p className="text-gray-500 text-xs mt-2 animate-pulse">
                    O modelo Naive Bayes está a classificar os padrões de danos...
                  </p>
                </div>
              )}

              {/* Resultado Final */}
              {status === 'done' && result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <LucideCheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Relatório Gerado
                      </span>
                    </div>

                    <ResultCard result={result} />

                    {/* Ações baseadas na severidade */}
                    {result.details?.class && (
                      <div className="mt-6 space-y-3 pt-6 border-t border-gray-100">
                        <h4 className="text-xs font-bold text-gray-900 uppercase">
                          Ações Recomendadas
                        </h4>
                        <div className="grid gap-2">
                          {getActionsBySeverity(result.details.class).map((item, idx) => (
                            <button
                              key={idx}
                              onClick={item.action}
                              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                                item.primary
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleReset}
                      className="w-full mt-6 text-xs font-medium text-gray-400 hover:text-indigo-600 flex items-center justify-center gap-1 transition-colors"
                    >
                      <LucideUploadCloud className="w-3 h-3" />
                      Analisar outro ficheiro
                    </button>
                  </div>

                  {/* Info Adicional do Modelo */}
                  <div className="bg-indigo-900 rounded-2xl p-6 text-white overflow-hidden relative">
                    <LucideZap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5" />
                    <h4 className="text-sm font-bold opacity-80 mb-2">Sobre esta análise</h4>
                    <p className="text-xs leading-relaxed opacity-70">
                      Esta previsão foi gerada por um algoritmo de classificação probabilística
                      treinado em milhares de cenários de colisão para garantir precisão e rapidez.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
