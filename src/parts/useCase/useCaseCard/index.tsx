import styles from './index.module.less';

export default function UseCaseCard({ useCase }) {
  const { name, logo, description, link, cta_label } = useCase;

  return (
    <div className={styles.cardContainer}>
      <img src={logo} alt={name} />
      <p className={styles.desc}>{description}</p>
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className={styles.linkButton}
        >
          {cta_label}
        </a>
      )}
    </div>
  );
}
