import { optionFCRM } from './constants/optionStatus';

export default function getFRCMStatus(value) {
  const find = optionFCRM?.find((item) => item.value === value);
  return find?.label;
}
