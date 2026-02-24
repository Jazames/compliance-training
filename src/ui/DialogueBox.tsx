interface DialogueBoxProps {
  title?: string;
  body?: string;
}

export function DialogueBox({ title, body }: DialogueBoxProps) {
  return (
    <section className="dialogue-box" aria-live="polite">
      {title ? <h2>{title}</h2> : null}
      {body ? <p>{body}</p> : null}
    </section>
  );
}

