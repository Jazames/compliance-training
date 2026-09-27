import { useEffect, useRef, type ReactNode } from 'react';

export function FeedbackSheet({ status, title, children }: {
  status: 'correct' | 'incorrect'; title?: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    window.scrollTo({ top: 0, behavior: 'instant' });
    return () => dialog?.close();
  }, []);
  return <dialog ref={ref} className="feedback-sheet" data-status={status}
    aria-label={title} onCancel={(event) => event.preventDefault()}>
    {children}
  </dialog>;
}
