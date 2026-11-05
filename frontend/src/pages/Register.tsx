import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-samgat-black mb-1.5">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-samgat-gray-light" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="O seu nome"
                  className="w-full pl-10 pr-4 py-2.5 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-samgat-black mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-samgat-gray-light" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-samgat-black mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-samgat-gray-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-10 pr-10 py-2.5 border border-samgat-gray-lighter rounded-lg text-sm focus:outline-none focus:border-samgat-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-samgat-gray-light hover:text-samgat-black"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-samgat-gray-light mt-1.5">
                Pelo menos 8 caracteres, com maiúsculas, minúsculas e números.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full bg-samgat-black text-white py-2.5 rounded-lg font-medium hover:bg-samgat-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              {isLoading ? 'A criar...' : 'Criar Conta'}
            </button>
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
