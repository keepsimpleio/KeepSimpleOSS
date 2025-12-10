import { FC } from 'react';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';

import styles from './AboutProjects.module.scss';

type projectsProps = {
  id: number;
  project_name: string;
  description: string;
};
type AboutProjectsProps = {
  projects: projectsProps[];
  darkTheme?: boolean;
};

const AboutProjects: FC<AboutProjectsProps> = ({ projects, darkTheme }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section
      ref={ref}
      className={cn(styles.projects, {
        [styles.darkTheme]: darkTheme,
      })}
    >
      {projects.map((project: any, index) => (
        <div
          key={project.id}
          className={cn(styles.project, {
            [styles[`inView-${project.id}`]]: inView,
          })}
        >
          <h3 className={styles.name}>{project.project_name}</h3>
          <div dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
      ))}
    </section>
  );
};

export default AboutProjects;
