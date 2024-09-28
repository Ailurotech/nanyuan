import { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Button,
  NumberInputStepper,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

export default function BookATablePage() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(2);
  const [preference, setPreference] = useState('No Preference');

  const handleDateChange = (e: any) => {
    setDate(e.target.value);
  };

  const getDayOfWeek = (date: string) => {
    return new Date(date).getDay();
  };

  const isWeekend = date && [5, 6, 0].includes(getDayOfWeek(date));
  const isFormComplete = date && time && name;

  return (
    <div className="w-full h-screen bg-[rgba(25,25,25,1)] pt-[8%] flex justify-center">
      <div className="w-[550px] h-[70vh] bg-[#e5e7eb] rounded-[20px] px-7 py-7 flex flex-col">
        <div className="w-full">
          <h1 className="font-bold text-2xl">Book a Table</h1>
          <p className="mt-1 font-extralight">
            Please fill in your details to reserve a table
          </p>
        </div>
        <Box className="h-full flex-grow pt-5 grid grid-cols-2 grid-rows-[repeat(4,1fr)_2fr] gap-x-4 gap-y-2 text-[0.9rem]">
          {/* Name Field */}
          <FormControl>
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">Name</FormLabel>
              <span className="text-red-500 ml-2">*</span>
            </div>
            <input
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>

          {/* Phone Number Field */}
          <FormControl>
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">Phone number</FormLabel>
              <span className="text-red-500 ml-2">*</span>
            </div>
            <div className="flex flex-row gap-x-2 mt-2">
              <input className="h-[35px] rounded-[5px] px-2" type="text" />
              <button className="bg-[#ff0000] h-[35px] w-full rounded-[5px] font-bold">
                Verify
              </button>
            </div>
          </FormControl>

          {/* Date Field */}
          <FormControl>
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">Date</FormLabel>
              <span className="text-red-500 ml-2">*</span>
            </div>
            <input
              className="w-full h-[35px] mt-2 rounded-[5px] px-2"
              type="date"
              value={date}
              onChange={(e) => handleDateChange(e)}
            />
          </FormControl>

          {/* Time Field */}
          <FormControl>
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">Time</FormLabel>
              <span className="text-red-500 ml-2">*</span>
            </div>
            <Select
              placeholder="Select time"
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              isDisabled={!date}
              sx={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                bg: date ? 'white' : 'gray.100',
                color: date ? 'black' : 'gray.500',
              }}
            >
              {isWeekend && (
                <>
                  <option>11:30</option>
                  <option>12:00</option>
                  <option>12:30</option>
                  <option>13:00</option>
                  <option>13:30</option>
                </>
              )}
              <option>17:00</option>
              <option>17:30</option>
              <option>18:00</option>
              <option>18:30</option>
              <option>19:00</option>
              <option>19:30</option>
              <option>20:00</option>
            </Select>
          </FormControl>

          {/* Email Field */}
          <FormControl className="col-span-2">
            <FormLabel className="font-bold">Email</FormLabel>
            <input
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
              type="text"
            />
          </FormControl>

          {/* Number of Guests Field */}
          <FormControl>
            <div className="flex items-center justify-between">
              <FormLabel className="font-bold">Number of Guests</FormLabel>
              <span className="text-red-500 ml-2">*</span>
            </div>
            <NumberInput
              max={50}
              min={1}
              value={guests}
              onChange={(value) => setGuests(parseInt(value))}
            >
              <NumberInputField className="w-full h-[35px] mt-2 rounded-[5px] px-2" />
              <NumberInputStepper>
                <NumberIncrementStepper className="mt-2 px-2" />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>

          {/* Seating Preference Field */}
          <FormControl>
            <FormLabel className="font-bold">Seating preference</FormLabel>
            <Select
              className="w-full h-[35px] mt-2 rounded-[5px] pl-2"
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              sx={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
              }}
            >
              <option>No Preference</option>
              <option>Near the Inside</option>
              <option>By windows</option>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Box className="col-span-2 mt-4">
            <Button
              width="full"
              bg="#ff0000"
              color="black"
              rounded="10px"
              py={2}
              mt={5}
              fontWeight="bold"
              isDisabled={!isFormComplete}
              _hover={{ bg: "#ff0000" }}
              _disabled={{ bg: "gray.400", color: "white" }}
            >
              Reserve Table
            </Button>
          </Box>
        </Box>
      </div>
    </div>
  );
}
