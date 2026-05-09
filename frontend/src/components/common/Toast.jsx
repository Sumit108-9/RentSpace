import React, { useEffect, useState } from 'react';

export const ToastContainer = ({ toasts, removeToast }) => {
  const [exitingToasts, setExitingToasts] = useState(new Set());

  // Auto-dismiss toasts after their duration
  useEffect(() => {
    toasts.forEach(toast => {
      if (!exitingToasts.has(toast.id)) {
        const timer = setTimeout(() => {
          // Start exit animation
          setExitingToasts(prev => new Set([...prev, toast.id]));
          // Remove after animation completes
          setTimeout(() => {
            removeToast(toast.id);
            setExitingToasts(prev => {
              const newSet = new Set(prev);
              newSet.delete(toast.id);
              return newSet;
            });
          }, 300);
        }, toast.duration || 1500);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast, exitingToasts]);

  const handleClick = (id) => {
    // Start exit animation on click
    setExitingToasts(prev => new Set([...prev, id]));
    setTimeout(() => {
      removeToast(id);
      setExitingToasts(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes toastSlideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        .toast-enter {
          animation: toastSlideIn 0.3s ease-out forwards;
        }
        .toast-exit {
          animation: toastSlideOut 0.3s ease-in forwards;
        }
      `}</style>
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <div 
            key={t.id} 
            onClick={() => handleClick(t.id)} 
            className={exitingToasts.has(t.id) ? 'toast-exit' : 'toast-enter'}
            style={{
              padding: '14px 20px', borderRadius: 10, fontSize: 14, cursor: 'pointer',
              background: t.type === 'success' ? '#E1F5EE' : t.type === 'error' ? '#FCEBEB' : t.type === 'warning' ? '#FEF3C7' : '#E6F1FB',
              color: t.type === 'success' ? '#085041' : t.type === 'error' ? '#A32D2D' : t.type === 'warning' ? '#92400E' : '#185FA5',
              border: '0.5px solid #e8e6df', boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              fontFamily: "'DM Sans', sans-serif", minWidth: 200
            }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>
                {t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <div style={{ flex: 1 }}>
                {t.title && <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.title}</div>}
                <div>{t.message}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
