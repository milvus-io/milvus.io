import classes from './index.module.less';
import { Trans, useTranslation } from 'react-i18next';
import { DataCard } from './dependencyComponent';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@radix-ui/react-tooltip';
import clsx from 'clsx';
import { formatOutOfCalData, unitBYTE2Any } from '@/utils/sizingTool';
import { ModeEnum, NodesKeyType, NodesValueType } from '@/types/sizing';

const MEMORY_SIZE_OPTIONS = [8, 16, 32, 64];

export const MilvusComponent = (props: {
  isOutOfCalculate: boolean;
  nodeConfig: Record<NodesKeyType, NodesValueType>;
  diskSize: number;
  diskUnit: string;
  mode: ModeEnum;
  memorySize: number;
  rawDataSize: number;
}) => {
  const { t } = useTranslation('sizingTool');

  const {
    isOutOfCalculate,
    nodeConfig,
    diskSize,
    diskUnit,
    mode,
    memorySize,
    rawDataSize,
  } = props;
  const { proxy, mixCoord, dataNode, indexNode, queryNode } = nodeConfig;

  const { size: memoryGb } = unitBYTE2Any(memorySize, 'GB');
  const properMemorySize = MEMORY_SIZE_OPTIONS.find(item => item >= memoryGb);
  console.log('properMemorySize--', properMemorySize);
  const properCoreSize = properMemorySize / 4;
  const localDisk = unitBYTE2Any(rawDataSize * 4);
  console.log('localDisk--', localDisk);

  return (
    <div className={classes.milvusDataDetail}>
      {mode === ModeEnum.Standalone ? (
        <DataCard
          name={t('setup.milvus.standaloneNode')}
          data={t('setup.basic.config', {
            cpu: properCoreSize,
            memory: properMemorySize,
          })}
          desc={
            <Trans
              t={t}
              i18nKey="setup.basic.diskWithValue"
              values={{
                disk: localDisk.size,
                unit: localDisk.unit,
              }}
              components={[
                <span key="value" className={classes.valueInfo}></span>,
              ]}
            />
          }
        />
      ) : (
        <>
          <DataCard
            name={
              <>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger
                      className={clsx(
                        classes.dataCardName,
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
              </>
            }
            data={formatOutOfCalData({
              data: t('setup.basic.config', {
                cpu: proxy.cpu,
                memory: proxy.memory,
              }),
              isOut: isOutOfCalculate,
            })}
            count={formatOutOfCalData({
              data: proxy.count,
              isOut: isOutOfCalculate,
              isCount: true,
            })}
            classname={classes.detailCard}
          />
          <DataCard
            name={
              <>
                <TooltipProvider>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger
                      className={clsx(
                        classes.dataCardName,
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
            data={formatOutOfCalData({
              data: t('setup.basic.config', {
                cpu: mixCoord.cpu,
                memory: mixCoord.memory,
              }),
              isOut: isOutOfCalculate,
            })}
            count={formatOutOfCalData({
              data: mixCoord.count,
              isOut: isOutOfCalculate,
              isCount: true,
            })}
            classname={classes.detailCard}
          />
          <DataCard
            name={
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.dataCardName,
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
            data={formatOutOfCalData({
              data: t('setup.basic.config', {
                cpu: dataNode.cpu,
                memory: dataNode.memory,
              }),
              isOut: isOutOfCalculate,
            })}
            count={formatOutOfCalData({
              data: dataNode.count,
              isOut: isOutOfCalculate,
              isCount: true,
            })}
            classname={classes.detailCard}
          />
          <DataCard
            name={
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.dataCardName,
                      classes.tooltipTrigger
                    )}
                  >
                    {t('setup.milvus.indexNode')}
                  </TooltipTrigger>
                  <TooltipContent sideOffset={5} className="w-[280px]">
                    {t('setup.milvus.indexNodeTip')}
                    <TooltipArrow />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            }
            data={formatOutOfCalData({
              data: t('setup.basic.config', {
                cpu: indexNode.cpu,
                memory: indexNode.memory,
              }),
              isOut: isOutOfCalculate,
            })}
            count={formatOutOfCalData({
              data: indexNode.count,
              isOut: isOutOfCalculate,
              isCount: true,
            })}
            classname={classes.detailCard}
          />
          <DataCard
            name={
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger
                    className={clsx(
                      classes.dataCardName,
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
            data={formatOutOfCalData({
              data: t('setup.basic.config', {
                cpu: queryNode.cpu,
                memory: queryNode.memory,
              }),
              isOut: isOutOfCalculate,
            })}
            desc={
              diskSize > 0 ? (
                <Trans
                  t={t}
                  i18nKey="setup.milvus.diskSize"
                  values={{
                    size: formatOutOfCalData({
                      data: `${diskSize} ${diskUnit}`,
                      isOut: isOutOfCalculate,
                    }),
                  }}
                  components={[
                    <span
                      className={classes.descLabel}
                      key="desc-label"
                    ></span>,
                    <span
                      className={classes.descValue}
                      key="desc-value"
                    ></span>,
                  ]}
                />
              ) : undefined
            }
            count={formatOutOfCalData({
              data: queryNode.count,
              isOut: isOutOfCalculate,
              isCount: true,
            })}
            classname={classes.detailCard}
          />
        </>
      )}
    </div>
  );
};
