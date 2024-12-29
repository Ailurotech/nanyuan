import { UseFormTrigger, UseFormGetValues } from 'react-hook-form';

export function usePhoneClickHandler(
  SendOtp: (phone: string) => void,
  trigger: UseFormTrigger<any>,
  getValues: UseFormGetValues<any>
) {
  return async () => {
    const result = await trigger('phone');
    const phone = getValues('phone');
    if (result) {
      SendOtp(phone);
    }
  };
}
