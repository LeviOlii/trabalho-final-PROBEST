import { AccidentProcessResult } from '@/service/api/types';

interface ResultCardProps {
  result: AccidentProcessResult;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const pct = (n?: number) => `${(clamp01(n ?? 0) * 100).toFixed(0)}%`;

function ProgressRow({
  label,
  value,
  barClassName,
}: {
  label: string;
  value: number;
  barClassName: string;
}) {
  const v = clamp01(value);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-800">{label}</span>
        <span className="tabular-nums text-gray-500">{pct(v)}</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className={`h-full rounded-full ${barClassName}`} style={{ width: `${v * 100}%` }} />
      </div>
    </div>
  );
}

export function ResultCard({ result }: ResultCardProps) {
  const klass = result.details?.class;

  const ui = (() => {
    if (klass === 'severe')
      return {
        title: 'Atenção: pode ser um acidente grave!',
        subtitle: 'Recomendamos agir com prioridade.',
        theme: 'border-red-200 bg-red-50/60',
        badge: 'bg-red-100 text-red-700 ring-red-200',
      };
    if (klass === 'moderate')
      return {
        title: 'Pode ser um acidente leve ou moderado',
        subtitle: 'Vale conferir os detalhes com calma.',
        theme: 'border-yellow-200 bg-yellow-50/60',
        badge: 'bg-yellow-100 text-yellow-800 ring-yellow-200',
      };
    if (klass === 'not_accident')
      return {
        title: 'Não parece ser um acidente',
        subtitle: 'Nenhum indicativo relevante foi encontrado.',
        theme: 'border-green-200 bg-green-50/60',
        badge: 'bg-green-100 text-green-700 ring-green-200',
      };
    return {
      title: 'Não foi possível identificar com clareza',
      subtitle: 'Tente enviar outra imagem mais nítida.',
      theme: 'border-gray-200 bg-gray-50',
      badge: 'bg-gray-100 text-gray-700 ring-gray-200',
    };
  })();

  const confidence =
    typeof result.details?.confidence === 'number' ? clamp01(result.details.confidence) : undefined;

  const probs = result.details?.probabilities;
  const pSevere = clamp01(probs?.severe ?? 0);
  const pModerate = clamp01(probs?.moderate ?? 0);
  const pNot = clamp01(probs?.not_accident ?? 0);

  const confidenceLabel =
    confidence === undefined
      ? null
      : confidence >= 0.8
        ? 'Alta'
        : confidence >= 0.6
          ? 'Média'
          : 'Baixa';

  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${ui.theme}`}>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-gray-600">Resultado</p>

          <p className="mt-1 text-xl font-semibold text-gray-900 break-words">
            {ui.title}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {ui.subtitle}
          </p>
        </div>

        {confidenceLabel && (
          <div className="w-full sm:w-auto sm:ml-auto">
            <div
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${ui.badge}`}
              title="O quão segura esta análise parece estar"
            >
              <span className="whitespace-nowrap">Segurança: {confidenceLabel}</span>
              {confidence !== undefined && (
                <span className="tabular-nums opacity-80 whitespace-nowrap">
                  ({pct(confidence)})
                </span>
              )}
            </div>
          </div>
        )}
      </div>


      {/* “Probabilidades” mais leigo */}
      {probs && (
        <div className="mt-5 rounded-xl bg-white/70 border border-white/60 p-4">
          <p className="text-sm font-medium text-gray-900">Como essa análise ficou</p>
          <p className="mt-1 text-xs text-gray-500">Barras mais altas significam maior chance.</p>

          <div className="mt-4 space-y-4">
            <ProgressRow label="Acidente grave" value={pSevere} barClassName="bg-red-500" />
            <ProgressRow label="Acidente leve/moderado" value={pModerate} barClassName="bg-yellow-500" />
            <ProgressRow label="Sem acidente" value={pNot} barClassName="bg-green-500" />
          </div>

          {/* Se quiser manter mensagem de orientação */}
          <div className="mt-4 text-xs text-gray-600">
            Dica: se a imagem estiver escura ou tremida, o resultado pode ficar menos confiável.
          </div>
        </div>
      )}

      {result.message && <p className="mt-4 text-xs text-gray-500">{result.message}</p>}
    </div>
  );
}
