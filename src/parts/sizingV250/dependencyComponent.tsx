import {
  ModeEnum,
  DependencyComponentEnum,
  DependencyConfigType,
} from '@/types/sizingV250';
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
import { formatOutOfCalData } from '@/utils/sizingToolV250';
import { DataCard, PulsarIcon, KafkaIcon } from './components';

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
        <h5 className="flex items-center gap-[4px] mb-[12px]">
          <PulsarIcon color="#188FFF" />
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                className={clsx(classes.commonKeyLabel, classes.tooltipTrigger)}
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
            <DataCard
              name={t('setup.dependency.bookie')}
              data={t('setup.basic.config', {
                cpu: pulsar.bookie.cpu,
                memory: pulsar.bookie.memory,
              })}
              count={pulsar.bookie.count}
              desc={
                <>
                  <div className="flex items-center">
                    {t('setup.basic.journal')}:&nbsp;
                    <span className="text-black1 font-[500]">
                      {formatOutOfCalData({
                        data: t('setup.basic.gb', {
                          memory: pulsar.bookie.journal,
                        }),
                        isOut: isOutOfCalculate,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {t('setup.basic.ledger')}:&nbsp;
                    <span className="text-black1 font-[500]">
                      {formatOutOfCalData({
                        data: t('setup.basic.gb', {
                          memory: pulsar.bookie.ledgers,
                        }),
                        isOut: isOutOfCalculate,
                      })}
                    </span>
                  </div>
                </>
              }
              isOutOfCalculate={isOutOfCalculate}
            />
          </li>
          <li className={classes.configItem}>
            <DataCard
              name={t('setup.dependency.broker')}
              count={pulsar.broker.count}
              data={t('setup.basic.config', {
                cpu: pulsar.broker.cpu,
                memory: pulsar.broker.memory,
              })}
              isOutOfCalculate={isOutOfCalculate}
            />
          </li>
          <li className={classes.configItem}>
            <DataCard
              name={t('setup.dependency.proxy')}
              count={pulsar.proxy.count}
              data={t('setup.basic.config', {
                cpu: pulsar.proxy.cpu,
                memory: pulsar.proxy.memory,
              })}
              isOutOfCalculate={isOutOfCalculate}
            />
          </li>

          <li className={classes.configItem}>
            <DataCard
              name={t('setup.dependency.zookeeper')}
              data={t('setup.basic.config', {
                cpu: pulsar.zookeeper.cpu,
                memory: pulsar.zookeeper.memory,
              })}
              count={pulsar.zookeeper.count}
              desc={
                <div className="flex items-center">
                  {t('setup.basic.pvcLabel')}:&nbsp;
                  <span className="text-black1 font-[500]">
                    {formatOutOfCalData({
                      data: t('setup.basic.gb', {
                        memory: pulsar.zookeeper.pvc,
                      }),
                      isOut: isOutOfCalculate,
                    })}
                  </span>
                </div>
              }
              isOutOfCalculate={isOutOfCalculate}
            />
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
        <h5 className="flex items-center gap-[4px] mb-[12px]">
          <KafkaIcon color="#188FFF" />
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                className={clsx(classes.commonKeyLabel, classes.tooltipTrigger)}
              >
                {t('setup.dependency.kafka')}
              </TooltipTrigger>
              <TooltipContent sideOffset={5} className="w-[280px]">
                {t('setup.dependency.kafkaTip')}
                <TooltipArrow />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h5>
        <ul className={classes.configList}>
          <li className={classes.configItem}>
            <DataCard
              name={t('setup.dependency.broker')}
              data={t('setup.basic.config', {
                cpu: kafka.broker.cpu,
                memory: kafka.broker.memory,
              })}
              count={kafka.broker.count}
              desc={
                <div className="flex items-center">
                  {t('setup.basic.pvcLabel')}:&nbsp;
                  <span className="text-black1 font-[500]">
                    {formatOutOfCalData({
                      data: t('setup.basic.gb', {
                        memory: kafka.broker.pvc,
                      }),
                      isOut: isOutOfCalculate,
                    })}
                  </span>
                </div>
              }
              isOutOfCalculate={isOutOfCalculate}
            />
          </li>

          <li className={classes.configItem}>
            <DataCard
              name={t('setup.dependency.zookeeper')}
              data={t('setup.basic.config', {
                cpu: kafka.zookeeper.cpu,
                memory: kafka.zookeeper.memory,
              })}
              count={kafka.zookeeper.count}
              desc={
                <div className="flex items-center">
                  {t('setup.basic.pvcLabel')}:&nbsp;
                  <span className="text-black1 font-[500]">
                    {formatOutOfCalData({
                      data: t('setup.basic.gb', {
                        memory: kafka.zookeeper.pvc,
                      }),
                      isOut: isOutOfCalculate,
                    })}
                  </span>
                </div>
              }
              isOutOfCalculate={isOutOfCalculate}
            />
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className={classes.dependencyDetailContainer}>
      <div className="flex items-center justify-between gap-[24px] pl-[24px] pr-[24px] mb-[16px]">
        <DataCard
          name={
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={clsx(
                    classes.commonKeyLabel,
                    classes.tooltipTrigger
                  )}
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
          data={t('setup.basic.config', {
            cpu: etcd.cpu,
            memory: etcd.memory,
          })}
          count={etcd.count}
          desc={
            <Trans
              t={t}
              i18nKey="setup.basic.pvc"
              values={{
                pvc: formatOutOfCalData({
                  data: `${etcd.pvc} GB`,
                  isOut: isOutOfCalculate,
                }),
              }}
              components={[<span key="pvc" className="text-black1"></span>]}
            />
          }
          classname={classes.card}
          isOutOfCalculate={isOutOfCalculate}
        />
        <DataCard
          name={t('setup.dependency.minio')}
          data={t('setup.basic.config', {
            cpu: minio.cpu,
            memory: minio.memory,
          })}
          count={minio.count}
          desc={
            <Trans
              t={t}
              i18nKey="setup.basic.pvc"
              values={{
                pvc: formatOutOfCalData({
                  data: `${minio.pvc} GB`,
                  isOut: isOutOfCalculate,
                }),
              }}
              components={[<span key="pvc" className="text-black1"></span>]}
            />
          }
          classname={classes.card}
          isOutOfCalculate={isOutOfCalculate}
        />
      </div>
      {mode === ModeEnum.Cluster && (
        <>
          {dependency === DependencyComponentEnum.Pulsar ? (
            <PulsarInfo pulsar={pulsar} isOutOfCalculate={isOutOfCalculate} />
          ) : (
            <KafkaInfo kafka={kafka} isOutOfCalculate={isOutOfCalculate} />
          )}
        </>
      )}
    </div>
  );
};
