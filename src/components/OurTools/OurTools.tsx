import { FC } from 'react';
import ToolContainer from '@components/ToolContainer';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';

import UXCoreGray from '@icons/UXCoreGray';
import PyramidsGray from '@icons/PyramidsGray';
import BobGray from '@icons/BobGray';
import BobLight from '@icons/BobLight';

import styles from './OurTools.module.scss';

type Tool = {
  name: string;
  description: string;
  slug: string;
};

type OurToolsProps = {
  tools: Tool[];
  darkTheme?: boolean;
  title?: string;
  russianView?: boolean;
};

const OurTools: FC<OurToolsProps> = ({
  tools,
  darkTheme,
  title,
  russianView,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const bobIcon = darkTheme ? <BobGray /> : <BobLight />;
  const japaneseNames = {
    uxcore: '主要',
    'company-management': '必要のピラミッド',
    bob: 'アシスタント',
  };
  const urls = {
    uxcore: '/uxcore',
    'company-management': '/company-management',
    bob: 'https://chat.openai.com/g/g-BtuSiGF18-bob-trickery-and-deception-by-ux-core',
  };

  const icons = {
    uxcore: <UXCoreGray />,
    'company-management': <PyramidsGray />,
    bob: bobIcon,
  };
  const sizes = {
    uxcore: 'small',
    'company-management': 'medium',
    bob: 'large',
  };

  const IDs = {
    uxcore: 'uxcore',
    'company-management': 'company-management',
    bob: 'bob',
  };

  const toolItems = tools.map(tool => {
    return {
      ...tool,
      japaneseName: japaneseNames[tool.slug],
      url: urls[tool.slug],
      icon: icons[tool.slug],
      size: sizes[tool.slug],
      id: IDs[tool.slug],
    };
  });

  return (
    <section
      ref={ref}
      className={cn(styles.tools, {
        [styles.darkTheme]: darkTheme,
        [styles.russianView]: russianView,
      })}
    >
      <h2
        className={cn(styles.title, {
          [styles.visibleTitle]: inView,
        })}
      >
        {title}
      </h2>
      <div className={styles.toolsWrapper}>
        {toolItems.map((tool, index) => (
          <ToolContainer
            darkTheme={darkTheme}
            size={tool.size}
            icon={tool.icon}
            url={tool.url}
            japaneseName={tool.japaneseName}
            name={tool.name}
            description={tool.description}
            key={index}
            russianView={russianView}
            id={tool.id}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
};

export default OurTools;
