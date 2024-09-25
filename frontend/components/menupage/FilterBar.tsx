import { Select, Box } from "@chakra-ui/react";
import MultiSelectBar from "./multiselectBar";
import SearchBar  from './SearchBar';

const FilterBar = ({ selectedCategories = [], selectedFilter, onFilterChange, onSortChange, onRemoveCategory, onSearch }: {  selectedCategories: string[], selectedFilter: string, onFilterChange: (value: string) => void, onSortChange: (sortOrder: string) => void, onRemoveCategory: (value: string) => void, onSearch: (searchTerm: string) => void }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <>
    <Box display="flex" flexDirection={{ base: "column", md: "row" }} justifyContent="center" gap={4} width="50%" >
      <Box flex="1" minWidth="200px">
        <Select 
        onChange={handleFilterChange} 
        icon={<></>} 
        bg="black"
        textColor="white"
        textAlign="center"
        fontSize="lg"
        fontWeight="bold"
        color="white"
        value={selectedFilter}
        _focus={{ outline: "none" }}
        sx={{
          position: 'relative',
          option: {
            fontWeight: "bold",
          },
        }}
        padding="0.5rem 1rem"
        >
          <option value="All">All</option>
          <option value="SignatureDishes">Signature Dishes</option>
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
        
        <Box>
        {selectedCategories.length > 0 && (
          <Box maxW="175px" mt={4} ml={{ base: 3, md: 8 }}>
            <MultiSelectBar selectedCategories={selectedCategories} onRemoveCategory={onRemoveCategory}/>
          </Box>
          )}
        </Box>
      </Box>
      
      <Box flex="1" minWidth="200px" >
        <Select
          fontSize="lg"
          fontWeight="bold"
          color="white"
          placeholder="Sort"
          onChange={handleSortChange}
          icon={<></>}
          bg="black"
          textColor="white"
          textAlign="center"
          _focus={{ outline: "none" }}
          sx={{
            position: 'relative',
            option: {
              fontWeight: "bold",
            },
          }}
          padding="0.5rem 0.5rem"
        >
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </Select>
      </Box>
    
      <Box flex="1" minWidth="200px" padding="0.5rem 1rem 0.5rem 0rem">
        <Box display="flex" justifyContent="center" alignItems="center">
          <SearchBar onSearch={onSearch} />
        </Box>
      </Box>
    </Box>
  </>
  );
};

export default FilterBar;
