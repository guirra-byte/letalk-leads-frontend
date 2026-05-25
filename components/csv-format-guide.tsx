'use client';

import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

const CSV_COLUMNS = ['nome', 'email', 'telefone', 'empresa', 'cnpj'] as const;

const CSV_EXAMPLE = `nome;email;telefone;empresa;cnpj
João Silva;joao@empresa.com;(11) 99999-9999;Minha Empresa;11222333000181
Maria;maria@empresa.com;;Empresa ABC;22333444000192`;

export function CsvFormatGuide() {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-4">
      <p className="text-sm font-medium">Formato do CSV</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Use exatamente estas colunas, nesta ordem.
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {CSV_COLUMNS.map((column) => (
          <Badge
            key={column}
            variant="secondary"
            className="font-mono text-[11px] font-normal"
          >
            {column}
          </Badge>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Separador{' '}
        <span className="font-mono text-foreground">;</span>
        {' · '}
        CNPJ obrigatório por linha
        {' · '}
        UTF-8
      </p>

      <Collapsible className="mt-3">
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="group h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Ver exemplo
            <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 rounded-md border bg-background/80 p-2.5">
            <code className="block break-all font-mono text-[11px] leading-relaxed text-foreground">
              {CSV_EXAMPLE}
            </code>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
