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
import { SizingVersionConfig } from './types';

interface NodesValueType {
  cpu: number;
  memory: number;
  count: number;
}

export const MilvusComponent = (props: {
  isOutOfCalculate: boolean;
  clusterNodeConfig: Record<string, NodesValueType>;
  standaloneNodeConfig: NodesValueType;
  diskSize: number;
  diskUnit: string;
  mode: any;
  memorySize: number;
  rawDataSize: number;
  config: SizingVersionConfig;
}) => {
  const { t } = useTranslation('sizingTool');

  const {
    isOutOfCalculate,
    clusterNodeConfig,
    standaloneNodeConfig,
    diskSize,
    diskUnit,
    mode,
    config,
  } = props;

  const { ModeEnum } = config.types;
  const { extraNodeKey, extraNodeLabelKey, extraNodeTipKey } = config;

  const { proxy, mixCoord, dataNode, queryNode } = clusterNodeConfig;
  const extraNode = clusterNodeConfig[extraNodeKey];

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
                    {t(extraNodeLabelKey)}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t(extraNodeTipKey)}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={t('setup.basic.config', {
              cpu: extraNode?.cpu || 0,
              memory: extraNode?.memory || 0,
            })}
            count={extraNode?.count || 0}
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
