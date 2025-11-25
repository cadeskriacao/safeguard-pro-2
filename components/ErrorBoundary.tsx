import * as React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    backgroundColor: '#f3f4f6'
                }}>
                    <div style={{
                        maxWidth: '600px',
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h1 style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            color: '#dc2626',
                            marginBottom: '1rem'
                        }}>
                            ⚠️ Erro na Aplicação
                        </h1>
                        <p style={{ marginBottom: '1rem', color: '#374151' }}>
                            Ocorreu um erro ao carregar a aplicação:
                        </p>
                        <div style={{
                            backgroundColor: '#fef2f2',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                            border: '1px solid #fecaca'
                        }}>
                            <code style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                                {this.state.error?.message}
                            </code>
                        </div>
                        <div style={{
                            backgroundColor: '#eff6ff',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #bfdbfe'
                        }}>
                            <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem' }}>
                                <strong>💡 Possíveis soluções:</strong>
                            </p>
                            <ul style={{ fontSize: '0.875rem', color: '#1e40af', paddingLeft: '1.5rem' }}>
                                <li>Verifique se as variáveis de ambiente estão configuradas no Vercel</li>
                                <li>Certifique-se que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas</li>
                                <li>Abra o Console do navegador (F12) para mais detalhes</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return <>{this.props.children}</>;
    }
}

export default ErrorBoundary;
