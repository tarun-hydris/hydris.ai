import LegalPage from '../components/sections/LegalPage.jsx';
import { EMAIL_PRIVACY, PRIVACY } from '../lib/content.js';

export default function Privacy() {
  return (
    <LegalPage doc={PRIVACY}
      contact={<>Write to <a className="link-u" href={`mailto:${EMAIL_PRIVACY}`}>{EMAIL_PRIVACY}</a>. {PRIVACY.contact}</>} />
  );
}
