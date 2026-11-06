import { contentDimensions, pushGrowthEvent } from './growth-measurement';

// One lifecycle per mounted form. Attempts and accepted leads are separate
// facts; callbacks may repeat and must never manufacture multiple successes.
export function createFormMeasurement(formId: string) {
  let started = false;
  let attempted = false;
  let error = false;
  let succeeded = false;
  const emit = (event: string, errorType = '') => pushGrowthEvent(event, {
    ...contentDimensions('milvus.io', window.location.pathname),
    form_id: formId, error_type: errorType,
  });
  return {
    start() { if (!started) { started = true; emit('form_start'); } },
    attempt() {
      if (succeeded) return;
      if (!attempted) { attempted = true; error = false; emit('form_submit_attempt'); }
    },
    error(type: 'validation' | 'request') {
      if (!error && !succeeded) { error = true; emit('form_error', type); }
      attempted = false;
    },
    success() { if (!succeeded) { succeeded = true; emit('form_success'); } },
  };
}
