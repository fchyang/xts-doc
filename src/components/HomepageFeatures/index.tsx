import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import { FeatureItem } from '@site/src/components/HomepageFeatures';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        When you face test problems, XTS Doc is here to provide guidance.
      </>
    ),
  },
  /*{
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },*/
  {
    title: 'Contact Us',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        If you have any further questions about XTS, please feel free to contact us.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--6')} style={{ 
      maxWidth: '450px',  // 限制最大宽度
      flex: '0 0 auto'    // 防止 flex 项目拉伸
    }}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        {/* 只保留这一个容器 */}
        <div style={{ 
          display: 'flex', 
		  flexDirection: 'row',  // 明确指定水平排列
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2rem' // 可选：添加一些间距
        }}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
