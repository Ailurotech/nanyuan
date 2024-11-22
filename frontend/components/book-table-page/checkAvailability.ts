import { sanityClient } from '@/lib/sanityClient';
import { DateTime } from 'luxon';

interface AvailabilityResult {
  status: 'success' | 'error';
  error?: string;
}

type FormData = {
  name: string;
  phone: string;
  time: string;
  guests: string;
  preference: string;
  notes: string;
  email: string;
  date: string;
};

export const checkAvailability = async (
  data: FormData,
  verifyOtp: boolean
): Promise<AvailabilityResult> => {
  // 检查是否通过 OTP 验证
  if (!verifyOtp) {
    return { status: 'error', error: 'Please verify your phone number.' };
  }

  try {
    // Step 1: 获取所有桌子类型
    const tables = await sanityClient.fetch(`
      *[_type == "table"] {
        _id,
        type,
        quantity
      }
    `);
    console.log(tables);

    // Step 2: 找到最适合的桌子类型
    const suitableTable = tables.find(
      (table: any) => parseInt(data.guests, 10) <= parseInt(table.type)
    );

    if (!suitableTable) {
      return { status: 'error', error: 'No suitable table is available for your group size.' };
    }

    // Step 3: 计算预订开始时间
    const startTime = DateTime.fromISO(`${data.date}T${data.time}`).toISO();

    if (!startTime) {
      return { status: 'error', error: 'Invalid start time format.' };
    }

    // Step 4: 查询当前时间段冲突的预订记录（仅查询别人的 `endTime`）
    const reservations = await sanityClient.fetch(`
      *[_type == "reservation" && table._ref == $tableId && (
        date == $date && (
          $startTime < endTime && time < $startTime
        )
      )] {
        _id
      }
    `, {
      tableId: suitableTable._id,
      date: data.date,
      startTime,
    });

    const usedTables = reservations.length;
    const availableTables = suitableTable.quantity - usedTables;

    if (availableTables <= 0) {
      return { status: 'error', error: 'No tables are available for the selected time.' };
    }

    // Step 5: 返回成功状态
    return { status: 'success' };
  } catch (error) {
    console.error('Error checking availability:', error);
    return { status: 'error', error: 'Failed to check table availability. Please try again later.' };
  }
};
