import React, { FC } from 'react';

import uxcoreApi from '@uxcore/data/uxcoreApi/uxcoreapi';

import BorderedContainer from '@uxcore/components/BorderedContainer';
import CodeSnippet from '@uxcore/components/CodeSnippet';
import ToolFooter from '@uxcore/components/ToolFooter';

import styles from './ApiLayout.module.scss';

const ApiLayout: FC = () => {
  const sectionDescription = `Welcome to the UXCore API documentation! Our API provides a simple and powerful way to access all information
   available in the UXCore project. In this documentation, you'll find details about the API's endpoints,
    parameters, and examples to help you get started quickly. The API is free. Still, we open access per request
     because of some technicalities. For access request or any other questions please contact us at alexanyanwolf@gmail.com`;

  return (
    <div className={styles.body}>
      <section className={styles.wrapper}>
        <h1 className={styles.pageTitle}>UX CORE API</h1>
        <div className={styles.mainInfo}>
          <p className={styles.sectionDescription}>{sectionDescription}</p>
        </div>
        <hr className={styles.separator} />
        {uxcoreApi.map((el, key) => {
          return (
            <div key={key}>
              <div className={styles.mainInfo}>
                <h3 className={styles.mainTitle}> {el.mainTitle} </h3>
                {el.link.includes(':ID') ? (
                  <span className={styles.link}>{el.link}</span>
                ) : (
                  <a className={styles.link} href={el.link} target={'_blank'}>
                    {el.link}
                  </a>
                )}
                <h4 className={styles.parametersTxt}> {el.parametersTxt} </h4>
                <span> {el.parametersInfo}</span>
              </div>
              <BorderedContainer
                content={el.parameters}
                className={styles.borderedContainer}
              />
              <div className={styles.codeUsage}>
                <h6 className={styles.usageTitle}> {el.usageTitle} </h6>
                <p> {el.usageTxt}</p>
                <CodeSnippet code={el.code} />
              </div>
            </div>
          );
        })}
      </section>
      <ToolFooter page={'api'} />
      <div className={styles.Motto}>Be Kind. Do Good.</div>
    </div>
  );
};
export default ApiLayout;
