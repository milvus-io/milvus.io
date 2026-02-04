import styles from './index.module.less';
import CustomButton from '@/components/customButton';
import { FinalUserCaseType, UseCaseType } from '@/types/useCase';

export default function UseCaseCard({ useCase }: { useCase: FinalUserCaseType; }) {
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
