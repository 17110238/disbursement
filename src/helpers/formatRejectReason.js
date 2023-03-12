import { rejectReason } from './constants/optionStatus';

export default function formatRejectReason(value) {
  const find = rejectReason?.find((item) => item.value === value);
  return find?.label;
}
