import type { SceneDef } from '../engine/sceneTypes';

export function InboxStage({ email, name }: { email: NonNullable<SceneDef['email']>; name?: string }) {
  return <div className="inbox-stage">
    <aside className="inbox-list"><div className="inbox-message"><strong>{email.from}</strong><p>{email.subject}</p></div>
      <div className="inbox-skeleton" aria-hidden="true" /><div className="inbox-skeleton" aria-hidden="true" /></aside>
    <article className="facilities-email">
      <p><strong>From:</strong> {email.from}</p>
      <p><strong>Subject:</strong> {email.subject}</p>
      <p>{email.body}</p>
      {name ? <p className="recorded-name">{name}</p> : null}
      <p style={{ whiteSpace: 'pre-line' }}>{email.signoff}</p>
    </article>
  </div>;
}
