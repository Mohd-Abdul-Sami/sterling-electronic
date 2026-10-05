import React, { useState } from 'react';
import { Star, Check, X, Trash2, MessageSquare } from 'lucide-react';
import { getReviews, updateReviewStatus, deleteReview } from '../../services/db';
import { Review } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminReviews: React.FC = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(getReviews());

  const refresh = () => setReviews(getReviews());

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    updateReviewStatus(id, status, 'Admin Portal');
    refresh();
    showToast(`Review marked as ${status}.`, 'success');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete customer review?')) {
      deleteReview(id, 'Admin Portal');
      refresh();
      showToast('Review deleted.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Customer Review Moderation</h2>
        <p className="text-xs text-slate-400">Review feedback submissions for authenticity and policy compliance</p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-[#0c0f17] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-100">{rev.title}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs font-mono text-cyan-400">{rev.productName}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
              <p className="text-[11px] text-slate-500 font-mono">
                By {rev.customerName} · {new Date(rev.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                rev.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300'
              }`}>
                {rev.status}
              </span>

              {rev.status !== 'approved' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'approved')}
                  className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300"
                  title="Approve review"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}

              {rev.status !== 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300"
                  title="Reject review"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 border border-white/10 text-slate-400 hover:text-rose-400"
                title="Delete review"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
