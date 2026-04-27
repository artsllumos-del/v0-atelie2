'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-2xl">
                Conta Criada com Sucesso!
              </CardTitle>
              <CardDescription>
                Verifique seu email para confirmar sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground text-center">
                  Um email de confirmação foi enviado para o seu endereço. Clique no link do email para ativar sua conta.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Ir para Login
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/loja">
                    Voltar para Loja
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
