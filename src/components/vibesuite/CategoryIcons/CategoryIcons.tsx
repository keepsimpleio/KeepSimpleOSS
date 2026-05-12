import { CategoryIconProps } from './CategoryIcons.types';

const iconStyle = {
  width: '1em',
  height: '1em',
  display: 'inline-block',
  verticalAlign: '-0.1em',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden="true">
      {children}
    </svg>
  );
}

function LlmAiIcon() {
  return (
    <Icon>
      <circle cx="12" cy="4" r="2" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" />
      <circle cx="8" cy="20" r="2" />
      <circle cx="16" cy="20" r="2" />
      <line x1="12" y1="6" x2="4" y2="10" />
      <line x1="12" y1="6" x2="20" y2="10" />
      <line x1="4" y1="14" x2="8" y2="18" />
      <line x1="20" y1="14" x2="16" y2="18" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </Icon>
  );
}

function LocalAiIcon() {
  return (
    <Icon>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <polyline points="6,9 10,12 6,15" />
      <line x1="12" y1="15" x2="18" y2="15" />
    </Icon>
  );
}

function ImageVideoIcon() {
  return (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21,15 16,10 5,21" />
      <line x1="14" y1="14" x2="21" y2="21" />
    </Icon>
  );
}

function FrontendUiIcon() {
  return (
    <Icon>
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <circle cx="5" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="5.5" r="0.5" fill="currentColor" stroke="none" />
      <rect x="5" y="11" width="6" height="7" rx="0.5" />
      <line x1="14" y1="11" x2="19" y2="11" />
      <line x1="14" y1="14" x2="19" y2="14" />
      <line x1="14" y1="17" x2="17" y2="17" />
    </Icon>
  );
}

function BackendDbIcon() {
  return (
    <Icon>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4,5 v14 c0,1.66 3.58,3 8,3 s8-1.34 8-3 V5" />
      <path d="M4,12 c0,1.66 3.58,3 8,3 s8-1.34 8-3" />
    </Icon>
  );
}

function AuthSecurityIcon() {
  return (
    <Icon>
      <path d="M12,2 L3,7 v5 c0,5.55 3.84,10.74 9,12 5.16-1.26 9-6.45 9-12 V7 Z" />
      <rect x="9" y="10" width="6" height="5" rx="1" />
      <path d="M10,10 V8 a2,2 0 0,1 4,0 v2" />
    </Icon>
  );
}

function DeployInfraIcon() {
  return (
    <Icon>
      <path
        d="M18,10 h1 a4,4 0 0,1 0,8 H6 A5,5 0 1,1 7.7,9.3 a7,7 0 0,1 13.3,1.7"
        fill="none"
      />
      <polyline points="12,13 12,21" />
      <polyline points="9,16 12,13 15,16" />
    </Icon>
  );
}

function PaymentsIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5,8 H10.5 a2,2 0 0,0 0,4 H13.5 a2,2 0 0,1 0,4 H9.5" />
      <line x1="12" y1="6" x2="12" y2="8" />
      <line x1="12" y1="16" x2="12" y2="18" />
    </Icon>
  );
}

function IntegrationsIcon() {
  return (
    <Icon>
      <path d="M10,13 a5,5 0 0,1 0-7 l1-1 a5,5 0 0,1 7,7 l-1,1" />
      <path d="M14,11 a5,5 0 0,1 0,7 l-1,1 a5,5 0 0,1 -7,-7 l1-1" />
    </Icon>
  );
}

function AiToolsIcon() {
  return (
    <Icon>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="none" />
    </Icon>
  );
}

const CATEGORY_ICONS: Record<string, React.ComponentType> = {
  'llm-ai': LlmAiIcon,
  'local-ai': LocalAiIcon,
  'image-video': ImageVideoIcon,
  'frontend-ui': FrontendUiIcon,
  'backend-db': BackendDbIcon,
  'auth-security': AuthSecurityIcon,
  'deploy-infra': DeployInfraIcon,
  payments: PaymentsIcon,
  integrations: IntegrationsIcon,
  'ai-tools': AiToolsIcon,
};

export default function CategoryIcon({ categoryId }: CategoryIconProps) {
  const IconComponent = CATEGORY_ICONS[categoryId];
  if (!IconComponent) return null;
  return <IconComponent />;
}
