import { useState, FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Se veio de uma rota protegida, volta para lá. Senão, vai para a home.
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await login(email, password) as any;
      toast.success('Login realizado com sucesso!');

      // Se veio de uma rota protegida, volta para lá.
      // Senão, vai para a home (funciona para CUSTOMER e ADMIN).
      navigate(from, { replace: true });
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Email ou senha incorretos.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-samgat-off-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-samgat-black">
            Samgat Store
          </Link>
          <p className="text-samgat-gray-light mt-2">Entre na sua conta</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-samgat-gray-lighter p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />

            <Input
              label="Senha"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-samgat-gray-light">
            Não tem conta?{' '}
            <Link to="/register" className="text-samgat-black font-medium hover:underline">
              Criar Conta
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-samgat-gray-light hover:text-samgat-black">
            ← Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
