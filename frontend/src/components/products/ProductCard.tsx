import { Link } from 'react-router-dom';
import { Product } from '../../types/store';
import { formatKz } from '../../utils/format';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/produtos/${product.id}`}
      className="group block bg-white border border-samgat-gray-lighter rounded-lg overflow-hidden hover:border-samgat-black transition-colors"
    >
      <div className="aspect-square bg-samgat-off-white overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-samgat-gray-light text-sm">
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-samgat-black text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-base font-bold text-samgat-black">
          {formatKz(Number(product.price))}
        </p>
      </div>
    </Link>
  );
}
