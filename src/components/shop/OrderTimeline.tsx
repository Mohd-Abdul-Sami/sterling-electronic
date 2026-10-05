import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2 } from 'lucide-react';
import { OrderStatus } from '../../types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const STAGES: { key: OrderStatus; label: string; icon: any }[] = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'packed', label: 'Packed & Sealed', icon: Package },
  { key: 'shipped', label: 'Shipped (Express)', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'processing':
        return 1;
      case 'packed':
        return 2;
      case 'shipped':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
      case 'refunded':
        return -1;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(currentStatus);

  if (currentStatus === 'cancelled' || currentStatus === 'refunded') {
    return (
      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs text-center font-medium">
        This order has been {currentStatus.toUpperCase()}.
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="relative flex items-center justify-between">
        {/* Progress connecting line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 z-0">
          <div
            className="h-full bg-cyan-400 transition-all duration-700"
            style={{
              width: `${(currentIndex / (STAGES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stage Nodes */}
        {STAGES.map((stage, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                    : 'bg-slate-900 border border-white/10 text-slate-500'
                } ${isCurrent ? 'ring-4 ring-cyan-500/20 scale-110' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`mt-2 text-[11px] font-mono whitespace-nowrap hidden sm:block ${
                  isCompleted ? 'text-slate-100 font-semibold' : 'text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
