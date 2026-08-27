import { useCallback, useState } from 'react';
import pageClasses from '@/styles/sizingTool.module.css';
import GpuFormSection from './formSection';
import GpuResultSection from './resultSection';
import { IGpuPayload, IGpuSnapshot, INITIAL_GPU_SNAPSHOT } from './config';
import { GpuValidationErrorEnum } from '@/types/sizingGpu';

export default function GpuSizingTool() {
  const [snapshot, setSnapshot] = useState<IGpuSnapshot>(INITIAL_GPU_SNAPSHOT);
  const [error, setError] = useState<GpuValidationErrorEnum | null>(null);

  // An invalid combination keeps the last consistent set of numbers on screen
  // instead of blanking the result column.
  const handleCalculatedResult = useCallback((payload: IGpuPayload) => {
    setError(payload.error);
    if (!payload.error) {
      setSnapshot(payload.snapshot);
    }
  }, []);

  return (
    <div className={pageClasses.contentContainer}>
      <GpuFormSection
        className={pageClasses.leftSection}
        onCalculatedResult={handleCalculatedResult}
      />
      <GpuResultSection
        className={pageClasses.rightSection}
        snapshot={snapshot}
        error={error}
      />
    </div>
  );
}
