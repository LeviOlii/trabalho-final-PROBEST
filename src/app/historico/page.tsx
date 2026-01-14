'use client';

import { LucideX, LucideUser, LucideShieldCheck } from 'lucide-react';
import Cookies from 'js-cookie';
import {
  LucideArrowLeft,
  LucideCalendar,
  LucideExternalLink,
  LucideHistory,
  LucideInbox,
  LucideLayoutDashboard,
  LucideLoader2,
  LucideLogOut,
  LucideSearch,
  LucideZap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { getAccidentHistory } from '@/service/api/accident';
import { AccidentHistoryItem } from '@/service/api/types';
import { AnimatePresence, motion } from 'framer-motion';

function ResultBadge({ result }: { result: string }) {
  const styles = {
    severe: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-100',
      label: 'Alta Severidade',
    },
    moderate: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      label: 'Média Severidade',
    },
    not_accident: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      label: 'Sem Acidente',
    },
  };

  const style = styles[result as keyof typeof styles] || {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-100',
    label: result,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}
    >
      {style.label}
    </span>
  );
}

export default function HistoryPage() {
  const [data, setData] = useState<AccidentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedItem, setSelectedItem] = useState<AccidentHistoryItem | null>(null);

  useEffect(() => {
    setLoading(true);

    getAccidentHistory({ page })
      .then((res) => {
        setData(res.data);
        setTotalPages(res.options.pages);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [page]);


  function handleLogout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.href = '/entrar';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar SaaS */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LucideZap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">AutoSeguro</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-colors"
          >
            <LucideLayoutDashboard className="w-5 h-5" />
            Nova Análise
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-xl transition-colors">
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider hover:underline"
                >
                  <LucideArrowLeft className="w-3 h-3" />
                  Voltar ao Início
                </button>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Histórico de Vistorias</h1>
              <p className="text-gray-500 text-sm mt-1">
                Registo completo de todas as análises realizadas via IA.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <LucideSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar análise..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64"
                />
              </div>
            </div>
          </div>

          {/* Lista de Histórico */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <LucideLoader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 text-sm font-medium">A carregar registos...</p>
              </div>
            ) : data.length === 0 ? (
              <div className="py-24 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <LucideInbox className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-semibold">Nenhum registo encontrado</h3>
                <p className="text-gray-500 text-xs mt-2 max-w-xs leading-relaxed">
                  Ainda não realizou nenhuma vistoria. As suas análises de IA aparecerão listadas
                  aqui.
                </p>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Fazer Primeira Análise
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Evidência
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Resultado IA
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                        Confiança
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        Data & Utilizador
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <div className="relative w-16 h-16 overflow-hidden rounded-xl border border-gray-200 shadow-sm group-hover:scale-105 transition-transform duration-300">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt="Análise"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <ResultBadge result={item.result} />
                          <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase">
                            ID: #{item.id.toString().slice(-6)}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-gray-700">
                            {(item.confidence * 100).toFixed(0)}%
                          </span>
                          <div className="w-16 bg-gray-100 h-1 rounded-full mt-1 mx-auto overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full"
                              style={{ width: `${item.confidence * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                              <LucideCalendar className="w-3 h-3 text-gray-400" />
                              {new Date(item.created_at).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">{item.user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                            <LucideExternalLink className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Paginação / Footer do Dashboard */}
          {!loading && data.length > 0 && (
            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 px-2">
              <p>
                Página <span className="font-semibold text-gray-900">{page}</span> de{' '}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className={`px-3 py-1.5 bg-white border border-gray-200 rounded-lg transition-colors ${
                    page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-900'
                  }`}
                >
                  Anterior
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`px-3 py-1.5 bg-white border border-gray-200 rounded-lg transition-colors ${
                    page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-900'
                  }`}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Detalhes da Análise</h2>
                    <p className="text-xs text-gray-500">Registro #{selectedItem.id}</p>
                  </div>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <LucideX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  {/* Imagem */}
                  <div className="flex items-center justify-center bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedItem.image}
                      alt="Imagem da análise"
                      className=" w-full
                      max-h-[75vh]
                      object-contain
                      rounded-xl
                      shadow-2xl
                      transition-transform
                      duration-300
                      hover:scale-[1.01]"
                    />
                  </div>

                  {/* Informações */}
                  <div className="flex flex-col justify-between">
                    <div className="space-y-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                          Resultado da IA
                        </p>
                        <ResultBadge result={selectedItem.result} />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                          Confiança
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-gray-900">
                            {(selectedItem.confidence * 100).toFixed(1)}%
                          </span>
                          <LucideShieldCheck className="w-6 h-6 text-indigo-600" />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                          Data da análise
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(selectedItem.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
                          Usuário
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <LucideUser className="w-4 h-4 text-gray-400" />
                          {selectedItem.user.email}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 mt-8 border-t flex justify-end">
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
