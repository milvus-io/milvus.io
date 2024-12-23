import { IIndexType, IndexTypeEnum } from '@/types/sizing';
import { RadioGroupItem, RadioGroup } from '@/components/ui';
import classes from './index.module.less';

const SCANNComponent = (props: {
  data: IIndexType;
  onChange: (key: string, value: any) => void;
}) => {
  const { data, onChange } = props;

  return (
    <div className="">
      <p className={classes.smallerLabel}>Index Parameters</p>
      <p className={classes.indexParamLabel}>With_raw_data</p>
      <RadioGroup
        value={data.widthRawData.toString()}
        onValueChange={val => {
          onChange('widthRawData', val === 'true');
        }}
        className={classes.radioGroup}
      >
        <div className={classes.flexRow}>
          <RadioGroupItem value="true"></RadioGroupItem>
          <p className="">True</p>
        </div>
        <div className={classes.flexRow}>
          <RadioGroupItem value="false">False</RadioGroupItem>
          <p className="">False</p>
        </div>
      </RadioGroup>
    </div>
  );
};

export const IndexTypeComponent = (props: {
  data: IIndexType;
  onChange: (key: string, value: any) => void;
}) => {
  const { data, onChange } = props;
  switch (data.indexType) {
    case IndexTypeEnum.FLAT:
      return null;
    case IndexTypeEnum.SCANN:
      return <SCANNComponent {...props} />;
    default:
      return null;
  }
};
