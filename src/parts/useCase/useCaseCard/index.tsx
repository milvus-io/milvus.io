import styles from './index.module.less';
import CustomButton from '@/components/customButton';

export default function UseCaseCard({ useCase }) {
  const { name, logo, description, link, cta_label } = useCase;

  return (
    <div className={styles.cardContainer}>
      <img src={logo} alt={name} />
      <p className={styles.desc}>{description}</p>
      {link && (
        <CustomButton
          href={link}
          target="_blank"
          variant="outlined"
          classes={{
            root: styles.startLinkButton,
          }}
        >
          {cta_label}
        </CustomButton>
      )}
    </div>
  );
}
