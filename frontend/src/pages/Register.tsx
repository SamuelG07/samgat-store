import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({ name, email, password });
      toast.success('Conta criada com sucesso!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao criar conta');
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
          <p className="text-samgat-gray-light mt-2">Crie a sua conta</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-samgat-gray-lighter p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome completo"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="O seu nome"
            />

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />

            <p className="text-xs text-samgat-gray-light">
              A senha deve conter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números.
            </p>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-samgat-gray-light">
            Já tem conta?{' '}
            <Link to="/login" className="text-samgat-black font-medium hover:underline">
              Entrar
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
