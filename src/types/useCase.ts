export interface UseCaseType {
  name: string;
  logo: { url: string };
  description: string;
  link: string;
  Cta_label: string;
}

export interface FinalUserCaseType extends Omit<UseCaseType, 'logo'> {
  logo: string;
}
