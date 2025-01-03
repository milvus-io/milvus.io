import {
  ModeEnum,
  DependencyComponentEnum,
  DependencyConfigType,
} from '@/types/sizing';
import classes from './index.module.less';
import { Trans, useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@/components/ui';
import { formatOutOfCalData } from '@/utils/sizingTool';

export const DependencyComponent = (props: {
  data: DependencyConfigType;
  mode: ModeEnum;
  dependency: DependencyComponentEnum;
  isOutOfCalculate: boolean;
}) => {
  const { t } = useTranslation('sizingTool');
  const { data, mode, dependency, isOutOfCalculate } = props;

  const { etcd, minio, pulsar, kafka } = data;

  const PulsarInfo = (
    props: Pick<DependencyConfigType, 'pulsar'> & {
      isOutOfCalculate: boolean;
    }
  ) => {
    const { pulsar, isOutOfCalculate } = props;

    return (
      <div className={classes.configContainer}>
        <h5 className={classes.configName}>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                className={clsx(classes.dataCardName, classes.tooltipTrigger)}
              >
                {t('setup.dependency.pulsar')}
              </TooltipTrigger>
              <TooltipContent sideOffset={5} className="w-[280px]">
                {t('setup.dependency.apacheTip')}
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h5>
        <ul className={classes.configList}>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.bookie"
                values={{
                  count: formatOutOfCalData({
                    data: pulsar.bookie.count,
                    isOut: isOutOfCalculate,
                    isCount: true,
                  }),
                }}
                components={[
                  <span key="pod-num" className={classes.columnValue}></span>,
                ]}
              />
            </p>
            <ol className={classes.columnList}>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.cpu')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.core', { cpu: pulsar.bookie.cpu }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: pulsar.bookie.memory }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.journal')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', {
                      memory: pulsar.bookie.journal,
                    }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.ledger')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', {
                      memory: pulsar.bookie.ledgers,
                    }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
            </ol>
          </li>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.broker"
                values={{
                  count: formatOutOfCalData({
                    data: pulsar.broker.count,
                    isOut: isOutOfCalculate,
                    isCount: true,
                  }),
                }}
                components={[
                  <span key="pod-num" className={classes.columnValue}></span>,
                ]}
              />
            </p>
            <ol className={classes.columnList}>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.cpu')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.core', { cpu: pulsar.broker.cpu }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: pulsar.broker.memory }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
            </ol>
          </li>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.proxy"
                values={{
                  count: formatOutOfCalData({
                    data: pulsar.proxy.count,
                    isOut: isOutOfCalculate,
                    isCount: true,
                  }),
                }}
                components={[
                  <span key="pod-num" className={classes.columnValue}></span>,
                ]}
              />
            </p>
            <ol className={classes.columnList}>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.cpu')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.core', { cpu: pulsar.proxy.cpu }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: pulsar.proxy.memory }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
            </ol>
          </li>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.zookeeper"
                values={{
                  count: formatOutOfCalData({
                    data: pulsar.zookeeper.count,
                    isOut: isOutOfCalculate,
                    isCount: true,
                  }),
                }}
                components={[
                  <span key="pod-num" className={classes.columnValue}></span>,
                ]}
              />
            </p>
            <ol className={classes.columnList}>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.cpu')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.core', { cpu: pulsar.zookeeper.cpu }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', {
                      memory: pulsar.zookeeper.memory,
                    }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.pvcLabel')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: pulsar.zookeeper.pvc }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    );
  };

  const KafkaInfo = (
    props: Pick<DependencyConfigType, 'kafka'> & {
      isOutOfCalculate: boolean;
    }
  ) => {
    const { kafka, isOutOfCalculate } = props;

    return (
      <div className={classes.configContainer}>
        <h5 className={classes.configName}>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                className={clsx(classes.dataCardName, classes.tooltipTrigger)}
              >
                {t('setup.dependency.kafka')}
              </TooltipTrigger>
              <TooltipContent sideOffset={5} className="w-[280px]">
                {t('setup.dependency.apacheTip')}
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h5>
        <ul className={classes.configList}>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.broker"
                values={{
                  count: formatOutOfCalData({
                    data: kafka.broker.count,
                    isOut: isOutOfCalculate,
                    isCount: true,
                  }),
                }}
                components={[
                  <span key="pod-num" className={classes.columnValue}></span>,
                ]}
              />
            </p>
            <ol className={classes.columnList}>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.cpu')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.core', { cpu: kafka.broker.cpu }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: kafka.broker.memory }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.pvcLabel')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: kafka.broker.pvc }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
            </ol>
          </li>

          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.zookeeper"
                values={{
                  count: formatOutOfCalData({
                    data: kafka.zookeeper.count,
                    isOut: isOutOfCalculate,
                    isCount: true,
                  }),
                }}
                components={[
                  <span key="pod-num" className={classes.columnValue}></span>,
                ]}
              />
            </p>
            <ol className={classes.columnList}>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.cpu')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.core', { cpu: kafka.zookeeper.cpu }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', {
                      memory: kafka.zookeeper.memory,
                    }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.pvcLabel')}:
                </span>
                <span className={classes.columnValue}>
                  {formatOutOfCalData({
                    data: t('setup.basic.gb', { memory: kafka.zookeeper.pvc }),
                    isOut: isOutOfCalculate,
                  })}
                </span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className={classes.dependencyDetailContainer}>
      <div className={classes.firstRow}>
        <DataCard
          name={
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(classes.dataCardName, classes.tooltipTrigger)}
                >
                  {t('setup.dependency.etcd')}
                </TooltipTrigger>
                <TooltipContent sideOffset={5} className="w-[280px]">
                  {t('setup.dependency.etcdTip')}
                  <TooltipArrow />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
          data={formatOutOfCalData({
            data: t('setup.basic.config', {
              cpu: etcd.cpu,
              memory: etcd.memory,
            }),
            isOut: isOutOfCalculate,
          })}
          count={formatOutOfCalData({
            data: etcd.count,
            isOut: isOutOfCalculate,
            isCount: true,
          })}
          desc={
            <p className={classes.dataDesc}>
              <Trans
                t={t}
                i18nKey="setup.basic.pvc"
                values={{
                  pvc: formatOutOfCalData({
                    data: `${etcd.pvc} GB`,
                    isOut: isOutOfCalculate,
                  }),
                }}
                components={[<span key="pvc"></span>]}
              />
            </p>
          }
          classname={classes.card}
        />
        <DataCard
          name={t('setup.dependency.minio')}
          data={formatOutOfCalData({
            data: t('setup.basic.config', {
              cpu: minio.cpu,
              memory: minio.memory,
            }),
            isOut: isOutOfCalculate,
          })}
          count={formatOutOfCalData({
            data: minio.count,
            isOut: isOutOfCalculate,
            isCount: true,
          })}
          desc={
            <p className={classes.dataDesc}>
              <Trans
                t={t}
                i18nKey="setup.basic.pvc"
                values={{
                  pvc: formatOutOfCalData({
                    data: `${minio.pvc} GB`,
                    isOut: isOutOfCalculate,
                  }),
                }}
                components={[<span key="pvc"></span>]}
              />
            </p>
          }
          classname={classes.card}
        />
      </div>
      {mode === ModeEnum.Cluster && (
        <div className="">
          <>
            {dependency === DependencyComponentEnum.Pulsar ? (
              <PulsarInfo pulsar={pulsar} isOutOfCalculate={isOutOfCalculate} />
            ) : (
              <KafkaInfo kafka={kafka} isOutOfCalculate={isOutOfCalculate} />
            )}
          </>
        </div>
      )}
    </div>
  );
};

export const DataCard = (props: {
  name: React.ReactNode;
  data: string;
  desc?: React.ReactNode;
  count?: number | string;
  classname?: string;
  size?: string;
}) => {
  const { name, data, count, desc, classname = '', size = 'medium' } = props;
  return (
    <div className={clsx(classes.dataCard, classname)}>
      <div
        className={clsx(classes.dataName, {
          [classes.largeName]: size === 'large',
        })}
      >
        {name}
      </div>
      <p
        className={clsx(classes.dataInfo, {
          [classes.largeData]: size === 'large',
        })}
      >
        {data}
      </p>
      {desc && <div className={classes.dataDesc}>{desc}</div>}
      {count && <p className={classes.dataCount}>x{count}</p>}
    </div>
  );
};
