import classes from './index.module.less';
import { Trans, useTranslation } from 'react-i18next';
import { DataCard } from './components';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import { formatOutOfCalData, unitBYTE2Any } from '@/utils/sizingTool';
import { ModeEnum, NodesKeyType, NodesValueType } from '@/types/sizing';

export const MilvusComponent = (props: {
  isOutOfCalculate: boolean;
  clusterNodeConfig: Record<NodesKeyType, NodesValueType>;
  standaloneNodeConfig: NodesValueType;
  diskSize: number;
  diskUnit: string;
  mode: ModeEnum;
  memorySize: number;
  rawDataSize: number;
}) => {
  const { t } = useTranslation('sizingTool');

  const {
    isOutOfCalculate,
    clusterNodeConfig,
    standaloneNodeConfig,
    diskSize,
    diskUnit,
    mode,
    memorySize,
    rawDataSize,
  } = props;
  const { proxy, mixCoord, dataNode, streamNode, queryNode } =
    clusterNodeConfig;

  return (
    <div className={classes.milvusDataDetail}>
      {mode === ModeEnum.Standalone ? (
        <DataCard
          name={t('setup.milvus.standaloneNode')}
          data={t('setup.basic.config', {
            cpu: standaloneNodeConfig.cpu,
            memory: standaloneNodeConfig.memory,
          })}
          desc={
            <Trans
              t={t}
              i18nKey="setup.basic.diskWithValue"
              values={{
                disk: `${diskSize} ${diskUnit}`,
              }}
              components={[
                <span
                  key="value"
                  className="text-[12px] leading-[18px] font-[500] text-black1"
                ></span>,
              ]}
            />
          }
        />
      ) : (
        <>
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
                    {t('setup.milvus.proxy')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('setup.milvus.proxyTip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={t('setup.basic.config', {
              cpu: proxy.cpu,
              memory: proxy.memory,
            })}
            count={proxy.count}
            classname={classes.detailCard}
            isOutOfCalculate={isOutOfCalculate}
          />
          <DataCard
            name={
              <>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger
                      className={clsx(
                        classes.commonKeyLabel,
                        classes.tooltipTrigger
                      )}
                    >
                      {t('setup.milvus.mixCoord')}
                    </TooltipTrigger>
                    <TooltipContent sideOffset={5} className="w-[280px]">
                      {t('setup.milvus.mixCoordTip')}
                      <TooltipArrow />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            }
            data={t('setup.basic.config', {
              cpu: mixCoord.cpu,
              memory: mixCoord.memory,
            })}
            count={mixCoord.count}
            classname={classes.detailCard}
            isOutOfCalculate={isOutOfCalculate}
          />
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
                    {t('setup.milvus.dataNode')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('setup.milvus.dataNodeTip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={t('setup.basic.config', {
              cpu: dataNode.cpu,
              memory: dataNode.memory,
            })}
            count={dataNode.count}
            classname={classes.detailCard}
            isOutOfCalculate={isOutOfCalculate}
          />
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
                    {t('setup.milvus.streamNode')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('setup.milvus.streamNodeTip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={t('setup.basic.config', {
              cpu: streamNode.cpu,
              memory: streamNode.memory,
            })}
            count={streamNode.count}
            classname={classes.detailCard}
            isOutOfCalculate={isOutOfCalculate}
          />
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
                    {t('setup.milvus.queryNode')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('setup.milvus.queryNodeTip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={t('setup.basic.config', {
              cpu: queryNode.cpu,
              memory: queryNode.memory,
            })}
            desc={
              isOutOfCalculate ? undefined : diskSize > 0 ? (
                <Trans
                  t={t}
                  i18nKey="setup.basic.diskWithValue"
                  values={{
                    disk: `${diskSize} ${diskUnit}`,
                  }}
                  components={[
                    <span
                      className="text-[12px] leading-[18px] font-[500] text-black1"
                      key="local-disk"
                    ></span>,
                  ]}
                />
              ) : undefined
            }
            count={queryNode.count}
            classname={classes.detailCard}
            isOutOfCalculate={isOutOfCalculate}
          />
        </>
      )}
    </div>
  );
};
