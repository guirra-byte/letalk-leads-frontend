'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Loader2, Building2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateCNPJ, formatCNPJ, cleanCNPJ } from '@/lib/cnpj';
import { formatPhone, cleanPhone, validatePhone } from '@/lib/phone';
import { useCnpjLookup } from '@/hooks/use-cnpj-lookup';
import type { LeadInputFields, LeadPreview } from '@/lib/types';

const optionalEmailSchema = z
  .string()
  .trim()
  .email('E-mail inválido')
  .optional()
  .or(z.literal(''));

const leadSearchSchema = z.object({
  leadName: z.string().trim().optional(),
  leadEmail: optionalEmailSchema,
  leadPhoneNumber: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || validatePhone(val), 'Telefone inválido'),
  companyName: z.string().trim().optional(),
  cnpj: z
    .string()
    .min(1, 'CNPJ é obrigatório')
    .refine((val) => validateCNPJ(val), 'CNPJ inválido'),
});

type LeadSearchFormData = z.infer<typeof leadSearchSchema>;

export interface LeadSearchResult {
  data: LeadPreview;
  cnpj: string;
  inputFields: LeadInputFields;
}

interface CNPJSearchProps {
  onResult: (result: LeadSearchResult) => void;
}

export function CNPJSearch({ onResult }: CNPJSearchProps) {
  const { mutate, isPending, isError, error, reset } = useCnpjLookup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LeadSearchFormData>({
    resolver: zodResolver(leadSearchSchema),
    defaultValues: {
      leadName: '',
      leadEmail: '',
      leadPhoneNumber: '',
      companyName: '',
      cnpj: '',
    },
  });

  const cnpjValue = watch('cnpj', '');
  const phoneValue = watch('leadPhoneNumber', '');

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
    if (isError) reset();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('leadPhoneNumber', formatPhone(e.target.value));
    if (isError) reset();
  };

  const onSubmit = (formData: LeadSearchFormData) => {
    const cleaned = cleanCNPJ(formData.cnpj);
    const inputFields: LeadInputFields = {
      leadName: formData.leadName?.trim() || undefined,
      leadEmail: formData.leadEmail?.trim() || undefined,
      leadPhoneNumber: formData.leadPhoneNumber?.trim()
        ? formatPhone(cleanPhone(formData.leadPhoneNumber))
        : undefined,
      companyName: formData.companyName?.trim() || undefined,
    };

    mutate(
      {
        cnpj: cleaned,
        ...inputFields,
      },
      {
        onSuccess: (data) => {
          onResult({
            data,
            cnpj: formatCNPJ(cleaned),
            inputFields,
          });
        },
      }
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Nome do lead</label>
            <Input
              {...register('leadName')}
              placeholder="Nome do contato"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Empresa informada</label>
            <Input
              {...register('companyName')}
              placeholder="Nome da empresa"
              disabled={isPending}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">E-mail do lead</label>
            <Input
              {...register('leadEmail')}
              type="email"
              placeholder="email@exemplo.com"
              disabled={isPending}
            />
            {errors.leadEmail && (
              <p className="mt-1 text-xs text-destructive">
                {errors.leadEmail.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Telefone do lead</label>
            <Input
              {...register('leadPhoneNumber')}
              onChange={handlePhoneChange}
              value={phoneValue}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={15}
              placeholder="(11) 99999-9999"
              disabled={isPending}
            />
            {errors.leadPhoneNumber && (
              <p className="mt-1 text-xs text-destructive">
                {errors.leadPhoneNumber.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">CNPJ *</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register('cnpj')}
                onChange={handleCNPJChange}
                value={cnpjValue}
                placeholder="Digite o CNPJ (ex: 11.222.333/0001-81)"
                className="pl-10 h-11"
                disabled={isPending}
              />
            </div>
            <Button type="submit" disabled={isPending} className="h-11 px-6">
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">Consultar</span>
            </Button>
          </div>
          {errors.cnpj && (
            <div className="mt-2 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.cnpj.message}</span>
            </div>
          )}
        </div>
      </form>

      {isError && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>
            {error?.message ?? 'Erro ao consultar CNPJ. Tente novamente.'}
          </span>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
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
