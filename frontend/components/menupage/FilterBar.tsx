import { Select, Box } from "@chakra-ui/react";
const FilterBar = ({ onSortChange }: { onFilterChange: (value: string) => void, onSortChange: (sortOrder: string) => void }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value); 
  };

  return (
    <Box bg="gray.100" p={4} rounded="md" shadow="md">
      <Select mt={4} placeholder="Sort by" onChange={handleSortChange}>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </Select>
    </Box>
  );
};

export default FilterBar;
