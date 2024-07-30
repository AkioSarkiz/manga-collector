import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  imgPath: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Multiple Website Support",
    imgPath: "/img/website.png",
    description: <>Scrape data from various manga websites seamlessly.</>,
  },
  {
    title: "Easy Data Extraction",
    imgPath: "/img/extract.png",
    description: <>Simple APIs to extract manga information effortlessly.</>,
  },
  {
    title: "Test Coverage",
    imgPath: "/img/tested.png",
    description: <>Ensuring reliability and performance.</>,
  },
];

function Feature({ title, imgPath, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={imgPath} style={{ width: "100px", height: "100px" }} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
