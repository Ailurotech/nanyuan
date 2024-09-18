import { Select, Box } from "@chakra-ui/react";

const FilterBar = ({ onFilterChange, onSortChange }: { onFilterChange: (value: string) => void, onSortChange: (sortOrder: string) => void }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <Box display="flex" gap={4} alignItems="center">
      <Select placeholder="All" onChange={handleFilterChange} icon={<></>}>
        <option value="Signature Dishes">Signature Dishes</option>
        <option value="Entree">Entree</option>
        <option value="Soup">Soup</option>
        <option value="Chicken">Chicken</option>
        <option value="Beef & Lamb">Beef & Lamb</option>
        <option value="Duck">Duck</option>
        <option value="Seafood">Seafood</option>
        <option value="Vegetables">Vegetables</option>
        <option value="Tofu & Claypot">Tofu & Claypot</option>
        <option value="Noodles & Rice">Noodles & Rice</option>
        <option value="Banquet">Banquet</option>
      </Select>

      <Select placeholder="Sort by" onChange={handleSortChange} icon={<></>}>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </Select>
    </Box>
  );
};

export default FilterBar;
