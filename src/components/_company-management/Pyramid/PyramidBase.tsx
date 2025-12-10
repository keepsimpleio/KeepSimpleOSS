import { type FC } from 'react';
import BlueSeparators from './separators/BlueSeparators';
import OrangeSeparators from './separators/OrangeSeparators';
import PurpleSeparators from './separators/PurpleSeparators';

const variations = {
  blue: [
    ['#70EEFF', '#5FCCE3', '#4F8EC7', '#004573', '#0B1C51'],
    [
      {
        x1: '572',
        y1: '-5.26012e-06',
        x2: '-46.4957',
        y2: '546.899',
      },
      [
        {
          offset: 0.145776,
          stopColor: '#204675',
        },
        {
          offset: 0.461552,
          stopColor: '#96E4FF',
        },
        {
          offset: 1,
          stopColor: '#204675',
        },
      ],
    ],
    '0 0 0 0 0.160784 0 0 0 0 0.360784 0 0 0 0 0.772549 0 0 0 0.94 0',
  ],
  orange: [
    ['#E0946B', '#CB7F5D', '#6F3B2A', '#3E2014', '#3A1602'],
    [
      {
        x1: '394.379',
        y1: '-3.60062',
        x2: '206.789',
        y2: '600.292',
      },
      [
        {
          offset: 0,
          stopColor: '#864F00',
        },
        {
          offset: 0.49,
          stopColor: '#DCB47B',
        },
        {
          offset: 1,
          stopColor: '#5B4C38',
        },
      ],
    ],
    '0 0 0 0 0.566667 0 0 0 0 0.368611 0 0 0 0 0.240833 0 0 0 1 0',
  ],
  purple: [
    ['#916BE0', '#9B5DCB', '#81438B', '#54224C', '#3C1125'],
    [
      {
        x1: '394.379',
        y1: '-3.60062',
        x2: '206.789',
        y2: '600.292',
      },
      [
        {
          offset: 0,
          stopColor: '#803B92',
        },
        {
          offset: 0.49,
          stopColor: '#DA7BDC',
        },
        {
          offset: 1,
          stopColor: '#52385B',
        },
      ],
    ],
    '0 0 0 0 0.3451 0 0 0 0 0.240833 0 0 0 0 0.566667 0 0 0 1 0',
  ],
};

const data = {
  blue: [
    // In-house Atmosphere Analysis (RIO)
    {
      x: 264,
      y: 70,
      text: 'In-house',
    },
    {
      x: 250,
      y: 90,
      text: 'Atmosphere',
    },
    {
      x: 266,
      y: 110,
      text: 'Analysis',
    },
    {
      x: 274,
      y: 130,
      text: '(RIO)',
    },
    // Team Availability Management
    {
      x: 210,
      y: 170,
      text: 'Team',
    },
    {
      x: 190,
      y: 190,
      text: 'Availability',
    },
    {
      x: 180,
      y: 210,
      text: 'Management',
    },
    // 'Communication Flowchart',
    {
      x: 290,
      y: 190,
      text: 'Communication',
    },
    {
      x: 310,
      y: 210,
      text: 'Flowchart',
    },
    // 'Management Roles and Responsibilities',
    {
      x: 156,
      y: 265,
      text: 'Management Roles',
    },
    {
      x: 154,
      y: 285,
      text: 'and Responsibilities',
    },
    // 'Technical Documentation',
    {
      x: 350,
      y: 265,
      text: 'Technical',
    },
    {
      x: 330,
      y: 285,
      text: 'Documentation',
    },
    // 'Onboarding',
    {
      x: 144,
      y: 360,
      text: 'Onboarding',
    },
    // 'PRD Standards',
    {
      x: 344,
      y: 360,
      text: 'PRD Standards',
    },
    // 'Project Processing Workflow',
    {
      x: 70,
      y: 434,
      text: 'Project Processing',
    },
    {
      x: 105,
      y: 454,
      text: 'Workflow',
    },
    // 'Hiring',
    {
      x: 297,
      y: 442,
      text: 'Hiring',
    },
    // 'Career Path',
    {
      x: 434,
      y: 442,
      text: 'Career Path',
    },
  ],
  orange: [
    // 'Dashboards and Reports'
    {
      x: 252,
      y: 90,
      text: 'Dashboards',
    },
    {
      x: 250,
      y: 110,
      text: 'and Reports',
    },
    // 'Monitoring and Alerts',
    {
      x: 218,
      y: 190,
      text: 'Monitoring and Alerts',
    },
    // 'Environment Integrations',
    {
      x: 180,
      y: 266,
      text: 'Environment',
    },
    {
      x: 180,
      y: 286,
      text: 'Integrations',
    },
    // 'Automations',
    {
      x: 340,
      y: 276,
      text: 'Automations',
    },
    // 'HR Environment',
    {
      x: 130,
      y: 350,
      text: 'HR',
    },
    {
      x: 96,
      y: 370,
      text: 'Environment',
    },
    // 'Finance Environment',
    {
      x: 246,
      y: 350,
      text: 'Finance',
    },
    {
      x: 230,
      y: 370,
      text: 'Environment',
    },
    // 'Non-technical Teams Environment',
    {
      x: 370,
      y: 350,
      text: 'Non-technical',
    },
    {
      x: 356,
      y: 370,
      text: 'Teams Environment',
    },
    // 'Communication',
    {
      x: 80,
      y: 440,
      text: 'Communication',
    },
    // 'File exchange',
    {
      x: 275,
      y: 440,
      text: 'File exchange',
    },
    // 'Coordination',
    {
      x: 436,
      y: 440,
      text: 'Coordination',
    },
  ],
  purple: [
    // Security Awareness Training
    {
      x: 264,
      y: 90,
      text: 'Security',
    },
    {
      x: 255,
      y: 110,
      text: 'Awareness',
    },
    {
      x: 264,
      y: 130,
      text: 'Training',
    },
    // 'Monitoring and Alerts',
    {
      x: 204,
      y: 184,
      text: 'Monitoring',
    },
    {
      x: 205,
      y: 204,
      text: 'and Alerts',
    },
    // 'Role-based access control (RBAC)',
    {
      x: 300,
      y: 166,
      text: 'Role-based',
    },
    {
      x: 316,
      y: 184,
      text: 'access',
    },
    {
      x: 316,
      y: 202,
      text: 'control',
    },
    {
      x: 316,
      y: 220,
      text: '(RBAC)',
    },
    // 'Backup and Recovery',
    {
      x: 176,
      y: 270,
      text: 'Backup and',
    },
    {
      x: 184,
      y: 290,
      text: 'Recovery',
    },
    // 'Firewall (Traffic Management)',
    {
      x: 340,
      y: 270,
      text: 'Firewall',
    },
    {
      x: 300,
      y: 290,
      text: '(Traffic Management)',
    },
    // '2-Factor Auth',
    {
      x: 140,
      y: 360,
      text: '2-Factor Auth',
    },
    // 'Security Policies',
    {
      x: 340,
      y: 360,
      text: 'Security Policies',
    },
    // 'VPN (Traffic Management)',
    {
      x: 120,
      y: 430,
      text: 'VPN',
    },
    {
      x: 62,
      y: 450,
      text: '(Traffic Management)',
    },
    // 'Data Encryption',
    {
      x: 264,
      y: 440,
      text: 'Data Encryption',
    },
    // 'Corporate Emails',
    {
      x: 414,
      y: 440,
      text: 'Corporate Emails',
    },
  ],
};

interface PyramidBaseProps {
  color: 'blue' | 'orange' | 'purple';
  className?: string;
  pyramidStatistics: any;
  selectedPyramidColor: string;
  setStatisticsInfo: any;
}

const PyramidBase: FC<PyramidBaseProps> = ({
  color,
  className = '',
  pyramidStatistics,
  selectedPyramidColor,
  setStatisticsInfo,
}) => {
  const variation = variations[color];
  const currentData = data[color];

  return (
    <svg
      width="587"
      height="478"
      viewBox="0 0 587 478"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter={`url(#${color}filter0_bi_46138_896)`}>
        <path
          d="M293.5 0L587 478H0L293.5 0Z"
          fill={`url(#${color}paint0_linear_46138_896)`}
          fillOpacity="0.92"
        />
        <path
          d="M1.78748 477L293.5 1.91112L585.213 477H1.78748Z"
          stroke={`url(#${color}paint1_linear_46138_896)`}
          strokeWidth="2"
        />
      </g>
      <rect
        opacity="0.65"
        x="51.25"
        y="396.25"
        width="484.5"
        height="0.5"
        fill="white"
        stroke={`url(#${color}paint2_linear_46138_896)`}
        strokeWidth="0.5"
      />
      <rect
        opacity="0.65"
        x="102.25"
        y="313.25"
        width="382.5"
        height="0.5"
        fill="white"
        stroke={`url(#${color}paint3_linear_46138_896)`}
        strokeWidth="0.5"
      />
      <rect
        opacity="0.65"
        x="154.25"
        y="229.25"
        width="278.5"
        height="0.5"
        fill="white"
        stroke={`url(#${color}paint4_linear_46138_896)`}
        strokeWidth="0.5"
      />
      <rect
        opacity="0.65"
        x="205.25"
        y="145.25"
        width="175.5"
        height="0.5"
        fill="white"
        stroke={`url(#${color}paint5_linear_46138_896)`}
        strokeWidth="0.5"
      />
      {color === 'blue' && <BlueSeparators />}
      {color === 'orange' && <OrangeSeparators />}
      {color === 'purple' && <PurpleSeparators />}
      <defs>
        <filter
          id={`${color}filter0_bi_46138_896`}
          x="-45"
          y="-45"
          width="677"
          height="568"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result={`${color}BackgroundImageFix`} />
          <feGaussianBlur
            in={`${color}BackgroundImageFix`}
            stdDeviation="22.5"
          />
          <feComposite
            in2={`${color}SourceAlpha`}
            operator="in"
            result={`${color}effect1_backgroundBlur_46138_896`}
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2={`${color}effect1_backgroundBlur_46138_896`}
            result={`${color}shape`}
          />
          <feColorMatrix
            in={`${color}SourceAlpha`}
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result={`${color}hardAlpha`}
          />
          <feOffset />
          <feGaussianBlur stdDeviation="25" />
          <feComposite
            in2={`${color}hardAlpha`}
            operator="arithmetic"
            k2="-1"
            k3="1"
          />
          <feColorMatrix
            type="matrix"
            // @ts-ignore
            values={variation[2]}
          />
          <feBlend
            mode="normal"
            in2={`${color}shape`}
            result="effect2_innerShadow_46138_896"
          />
        </filter>
        <linearGradient
          id={`${color}paint0_linear_46138_896`}
          x1="293.5"
          y1="0"
          x2="293.5"
          y2="478"
          gradientUnits="userSpaceOnUse"
        >
          {/* @ts-ignore */}
          <stop stopColor={variation[0][0]} />
          {/* @ts-ignore */}
          <stop offset="0.265" stopColor={variation[0][1]} />
          {/* @ts-ignore */}
          <stop offset="0.525" stopColor={variation[0][2]} />
          {/* @ts-ignore */}
          <stop offset="0.785" stopColor={variation[0][3]} />
          {/* @ts-ignore */}
          <stop offset="1" stopColor={variation[0][4]} />
        </linearGradient>
        {/* @ts-ignore */}
        <linearGradient
          id={`${color}paint1_linear_46138_896`}
          /* @ts-ignore */
          {...variation[1][0]}
          gradientUnits="userSpaceOnUse"
        >
          <stop {...variation[1][1][0]} />
          <stop {...variation[1][1][1]} />
          <stop {...variation[1][1][2]} />
        </linearGradient>
        <linearGradient
          id={`${color}paint2_linear_46138_896`}
          x1="-267.281"
          y1="395.722"
          x2="-267.267"
          y2="392.502"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.396889" stopColor="#A99FC6" />
          <stop offset="1" stopColor="#BCBCBC" />
        </linearGradient>
        <linearGradient
          id={`${color}paint3_linear_46138_896`}
          x1="-149.344"
          y1="312.722"
          x2="-149.326"
          y2="309.502"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.396889" stopColor="#A99FC6" />
          <stop offset="1" stopColor="#BCBCBC" />
        </linearGradient>
        <linearGradient
          id={`${color}paint4_linear_46138_896`}
          x1="-29.0938"
          y1="228.722"
          x2="-29.0695"
          y2="225.502"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.396889" stopColor="#A99FC6" />
          <stop offset="1" stopColor="#BCBCBC" />
        </linearGradient>
        <linearGradient
          id={`${color}paint5_linear_46138_896`}
          x1="89.5"
          y1="144.722"
          x2="89.5384"
          y2="141.503"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="0.396889" stopColor="#A99FC6" />
          <stop offset="1" stopColor="#BCBCBC" />
        </linearGradient>
      </defs>
      {/* Here */}
      <g type="group">
        {currentData.map(({ text, ...coords }, index) => (
          <text
            key={index}
            {...coords}
            fill="#fff"
          >
            {text}
          </text>
        ))}
      </g>
    </svg>
  );
};

export default PyramidBase;
