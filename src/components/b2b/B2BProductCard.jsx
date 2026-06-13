import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import { getB2BUnitPrice } from '../../redux/b2bPurchaseSlice';

const B2BProductCard = ({ product, cartQuantity = 0, onAdd }) => {
  const [quantity, setQuantity] = useState(10);
  const b2bPrice = getB2BUnitPrice(product);
  const maxQuantity = Math.max(product.stock || 1, 1);

  const updateQuantity = (value) => {
    const nextValue = Math.min(Math.max(Number(value) || 1, 1), maxQuantity);
    setQuantity(nextValue);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-teal-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[1.25/1] bg-slate-50 p-4 dark:bg-slate-950">
        <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">{product.brand}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-bold text-slate-950 dark:text-white">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{product.description}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">B2B Price</p>
            <p className="font-extrabold text-slate-950 dark:text-white">{formatCurrency(b2bPrice)}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-slate-400">MRP</p>
            <p className="font-semibold text-slate-500 line-through">{formatCurrency(product.mrp)}</p>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-950">
            <button type="button" onClick={() => updateQuantity(quantity - 1)} className="grid h-8 w-8 place-items-center rounded-md text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Decrease quantity">
              <Minus size={16} />
            </button>
            <input
              value={quantity}
              onChange={(event) => updateQuantity(event.target.value)}
              className="h-8 w-16 bg-transparent text-center text-sm font-bold text-slate-950 outline-none dark:text-white"
              inputMode="numeric"
            />
            <button type="button" onClick={() => updateQuantity(quantity + 1)} className="grid h-8 w-8 place-items-center rounded-md text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Increase quantity">
              <Plus size={16} />
            </button>
          </div>
          <button type="button" onClick={() => onAdd(product, quantity)} className="btn-primary inline-flex h-10 w-full items-center justify-center gap-2 text-sm">
            <ShoppingCart size={17} />
            {cartQuantity ? `Add More (${cartQuantity})` : 'Add to B2B Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default B2BProductCard;
