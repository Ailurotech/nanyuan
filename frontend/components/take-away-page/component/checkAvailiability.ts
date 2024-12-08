import { DateTime } from 'luxon';

interface CheckTakeawayOrderAvailabilityResult {
    errorMessage?: string;
}

const validateInitialConditions = (
    otp: boolean,
): CheckTakeawayOrderAvailabilityResult => {
    return !otp
        ? { errorMessage: 'OTP not verified' }
        : {};
};

const validatePickUpTime = (
    pickUpDate: string,
    pickUpTime: string
): CheckTakeawayOrderAvailabilityResult => {
    const now = DateTime.now();
    const pickUpDateTime = DateTime.fromISO(`${pickUpDate}T${pickUpTime}`);

    return pickUpDateTime <= now
        ? { errorMessage: 'Cannot pick up in the past.' }
        : pickUpDateTime < now.plus({ hours: 0.5 })
        ? { errorMessage: 'Pick-up time must be at least 30 minutes from now.' }
        : {};
};

const validatePrice = (
    price: number
): CheckTakeawayOrderAvailabilityResult => {
    return price <= 0
        ? { errorMessage: 'Price must be greater than zero.' }
        : price >= 1000
        ? { errorMessage: 'Please call us to order.' }
        : {};
};

const checkTakeawayOrderAvailability = async (
    otp: boolean,
    pickUpDate: string,
    pickUpTime: string,
    price: number
): Promise<CheckTakeawayOrderAvailabilityResult> => {
    let result: CheckTakeawayOrderAvailabilityResult = {};

    const validations = [
        () => validateInitialConditions(otp),
        () => validatePickUpTime(pickUpDate, pickUpTime),
        () => validatePrice(price),
    ];

    for (const validation of validations) {
        result = validation();
        if (result.errorMessage) return result; 
    }

    return result; 
};

export default checkTakeawayOrderAvailability;
