// Chrome strings: the few labels the OffsecBiasView renders itself rather
// than reading from a case file (the envelope "From", the call kicker, the
// consent-screen heading, the default confidence label, the tell key). Case
// content is translated per locale in ./ru and ./hy; these belong to the
// component, so they live here and are picked by locale at render time.
// Armenian falls back to English wherever a translation is missing, matching
// the rest of the UX Core tree.

export interface OffsecChrome {
  tellKey: string;
  from: string;
  incomingCall: string;
  wantsAccessTo: string;
  confidenceDefault: string;
}

const en: OffsecChrome = {
  tellKey: 'The tell',
  from: 'From',
  incomingCall: 'Incoming call',
  wantsAccessTo: 'Wants access to',
  confidenceDefault: 'Your confidence',
};

const ru: OffsecChrome = {
  tellKey: 'Примета',
  from: 'От',
  incomingCall: 'Входящий звонок',
  wantsAccessTo: 'Запрашивает доступ',
  confidenceDefault: 'Ваша уверенность',
};

const hy: OffsecChrome = {
  tellKey: 'Նշանը',
  from: 'Ումից',
  incomingCall: 'Մուտքային զանգ',
  wantsAccessTo: 'Հասանելիություն է խնդրում',
  confidenceDefault: 'Ձեր վստահությունը',
};

const chrome: Record<string, OffsecChrome> = { en, ru, hy };

export const getOffsecChrome = (locale?: string): OffsecChrome =>
  chrome[locale] ?? en;

export default chrome;
