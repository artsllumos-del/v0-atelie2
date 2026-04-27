'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Aqui você pode enviar para serviço de logging (Sentry, etc)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <CardTitle>Algo deu errado</CardTitle>
                </div>
                <CardDescription>
                  Desculpe, ocorreu um erro inesperado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {this.state.error?.message || 'Por favor, tente novamente mais tarde'}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Recarregar página
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="w-full"
                  >
                    Voltar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )
    }

    return this.props.children
  }
}
