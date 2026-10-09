import LegalPage from '../components/sections/LegalPage.jsx';
import { EMAIL_LEGAL, TERMS } from '../lib/content.js';

export default function Terms() {
  return (
    <LegalPage doc={TERMS}
      contact={<>Write to <a className="link-u" href={`mailto:${EMAIL_LEGAL}`}>{EMAIL_LEGAL}</a>.</>} />
  );
}
