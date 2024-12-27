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

export const DependencyComponent = (props: {
  data: DependencyConfigType;
  mode: ModeEnum;
  dependency: DependencyComponentEnum;
}) => {
  const { t } = useTranslation('sizingTool');
  const { data, mode, dependency } = props;

  const { etcd, minio, pulsar, kafka } = data;

  const PulsarInfo = (props: Pick<DependencyConfigType, 'pulsar'>) => {
    const { pulsar } = props;

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
                values={{ count: pulsar.bookie.count }}
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
                  {t('setup.basic.core', { cpu: pulsar.bookie.cpu })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.bookie.memory })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.journal')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.bookie.journal })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.ledger')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.bookie.ledgers })}
                </span>
              </li>
            </ol>
          </li>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.broker"
                values={{ count: pulsar.broker.count }}
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
                  {t('setup.basic.core', { cpu: pulsar.broker.cpu })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.broker.memory })}
                </span>
              </li>
            </ol>
          </li>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.proxy"
                values={{ count: pulsar.proxy.count }}
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
                  {t('setup.basic.core', { cpu: pulsar.proxy.cpu })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.proxy.memory })}
                </span>
              </li>
            </ol>
          </li>
          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.zookeeper"
                values={{ count: pulsar.zookeeper.count }}
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
                  {t('setup.basic.core', { cpu: pulsar.zookeeper.cpu })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.zookeeper.memory })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.pvcLabel')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: pulsar.zookeeper.pvc })}
                </span>
              </li>
            </ol>
          </li>
        </ul>
      </div>
    );
  };

  const KafkaInfo = (props: Pick<DependencyConfigType, 'kafka'>) => {
    const { kafka } = props;

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
                values={{ count: kafka.broker.count }}
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
                  {t('setup.basic.core', { cpu: kafka.broker.cpu })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: kafka.broker.memory })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.pvcLabel')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: kafka.broker.pvc })}
                </span>
              </li>
            </ol>
          </li>

          <li className={classes.configItem}>
            <p className={classes.columnName}>
              <Trans
                t={t}
                i18nKey="setup.dependency.zookeeper"
                values={{ count: kafka.zookeeper.count }}
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
                  {t('setup.basic.core', { cpu: kafka.zookeeper.cpu })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.memory')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: kafka.zookeeper.memory })}
                </span>
              </li>
              <li className={classes.columnItem}>
                <span className={classes.columnLabel}>
                  {t('setup.basic.pvcLabel')}:
                </span>
                <span className={classes.columnValue}>
                  {t('setup.basic.gb', { memory: kafka.zookeeper.pvc })}
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
          data={t('setup.basic.config', { cpu: etcd.cpu, memory: etcd.memory })}
          count={etcd.count}
          desc={
            <p className={classes.dataDesc}>
              <Trans
                t={t}
                i18nKey="setup.basic.pvc"
                values={{ pvc: etcd.pvc }}
                components={[<span key="pvc"></span>]}
              />
            </p>
          }
          classname={classes.card}
        />
        <DataCard
          name={t('setup.dependency.minio')}
          data={t('setup.basic.config', {
            cpu: minio.cpu,
            memory: minio.memory,
          })}
          count={minio.count}
          desc={
            <p className={classes.dataDesc}>
              <Trans
                t={t}
                i18nKey="setup.basic.pvc"
                values={{ pvc: minio.pvc }}
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
              <PulsarInfo pulsar={pulsar} />
            ) : (
              <KafkaInfo kafka={kafka} />
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
  count?: number;
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
