import { Select, Box, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

const FilterBar = ({ selectedCategories = [], selectedFilter, onFilterChange, onSortChange, onRemoveCategory  }: { selectedCategories: string[], selectedFilter: string, onFilterChange: (value: string) => void, onSortChange: (sortOrder: string) => void, onRemoveCategory: (value: string) => void }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <Box display="flex" gap={4} alignItems="center">
      <Select onChange={handleFilterChange} icon={<></>} bg="black" textColor="white" value={selectedFilter}>
      <option value="All">All</option>
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

      <Box display="flex" flexWrap="wrap" gap={2}>
        {selectedCategories.length > 0 && selectedCategories.map((category) => (
          <Tag key={category} size="lg"
               borderRadius="full"
               variant="solid"
               bg="yellow.400"
               textColor="green.700"
               px={1}
               py={1}
               fontWeight="bold"
               display="flex"
               alignItems="center">
            <TagLabel>{category}</TagLabel>
            <TagCloseButton onClick={() => onRemoveCategory(category)} />
          </Tag>
        ))}
      </Box>
      
      <Select placeholder="Sort by" onChange={handleSortChange} icon={<></>} bg="black" textColor="white">
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </Select>
      
    </Box>
  );
};

export default FilterBar;
