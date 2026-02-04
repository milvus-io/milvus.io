export interface UseCaseType {
  name: string;
  logo: { url: string };
  description: string;
  link: string;
  cta_label: string;
}

export interface FinalUserCaseType extends Omit<UseCaseType, 'logo'> {
  logo: string;
}
