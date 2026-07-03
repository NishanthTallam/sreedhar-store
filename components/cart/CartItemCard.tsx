"use client";

interface CartItemCardProps {
  item: any; // In a real app, define a proper type
  onUpdateQuantity: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  return (
    <div className="flex gap-4 border-b border-neutral-200 py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
        {/* Placeholder image */}
        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
          Image
        </div>
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-neutral-900">{item.productName}</h4>
            <p className="mt-1 text-xs text-neutral-500">{item.variantLabel}</p>
          </div>
          <p className="text-sm font-semibold text-neutral-900">₹{item.price}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-neutral-200 bg-white shadow-sm">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-brand-600 disabled:opacity-50"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:text-brand-600"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
