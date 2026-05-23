'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateCNPJ, formatCNPJ, cleanCNPJ } from '@/lib/cnpj';
import { fetchCNPJData } from '@/lib/mock-data';
import type { LeadAnalysis } from '@/lib/types';

const cnpjSchema = z.object({
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .refine((val) => validateCNPJ(val), 'CNPJ inválido'),
});

type CNPJFormData = z.infer<typeof cnpjSchema>;

interface CNPJSearchProps {
  onResult: (data: LeadAnalysis, cnpj: string) => void;
}

export function CNPJSearch({ onResult }: CNPJSearchProps) {
  const [searchCNPJ, setSearchCNPJ] = useState<string | null>(null);
  const hasCalledResult = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CNPJFormData>({
    resolver: zodResolver(cnpjSchema),
  });

  const cnpjValue = watch('cnpj', '');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['cnpj', searchCNPJ],
    queryFn: () => fetchCNPJData(searchCNPJ!),
    enabled: !!searchCNPJ,
  });

  // Pass result to parent when data is available using useEffect
  useEffect(() => {
    if (data && searchCNPJ && !hasCalledResult.current) {
      hasCalledResult.current = true;
      onResult(data, formatCNPJ(searchCNPJ));
      setSearchCNPJ(null);
    }
  }, [data, searchCNPJ, onResult]);

  // Reset ref when searchCNPJ changes
  useEffect(() => {
    if (searchCNPJ) {
      hasCalledResult.current = false;
    }
  }, [searchCNPJ]);

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 14) {
      if (value.length > 12) {
        value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`;
      } else if (value.length > 8) {
        value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`;
      } else if (value.length > 5) {
        value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
      } else if (value.length > 2) {
        value = `${value.slice(0, 2)}.${value.slice(2)}`;
      }
      setValue('cnpj', value);
    }
  };

  const onSubmit = (formData: CNPJFormData) => {
    setSearchCNPJ(cleanCNPJ(formData.cnpj));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
        <div className="relative flex-1">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            {...register('cnpj')}
            onChange={handleCNPJChange}
            value={cnpjValue}
            placeholder="Digite o CNPJ (ex: 11.222.333/0001-81)"
            className="pl-10 h-11"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-11 px-6">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2">Consultar</span>
        </Button>
      </form>

      {errors.cnpj && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{errors.cnpj.message}</span>
        </div>
      )}

      {isError && (
        <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>Erro ao consultar CNPJ. Tente novamente.</span>
        </div>
      )}

      {data === null && searchCNPJ && !isLoading && (
        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
          <Building2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            CNPJ não encontrado. Verifique o número e tente novamente.
          </p>
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">
        <p>CNPJs de exemplo para teste:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {['11.222.333/0001-81', '22.333.444/0001-92', '33.444.555/0001-03'].map((cnpj) => (
            <button
              key={cnpj}
              type="button"
              onClick={() => setValue('cnpj', cnpj)}
              className="text-primary hover:underline"
            >
              {cnpj}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
