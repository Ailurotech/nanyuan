import { Input, Box } from "@chakra-ui/react";
import { useState } from "react";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <Box display="flex" alignItems="center">
      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search"
        size="lg"
        bg="black"
        fontSize="lg" 
        fontWeight="bold" 
        textColor="white"
        textAlign="center"
        autoFocus
        width="100%"
        _focus={{ outline: "none" }}
        sx={{
          "::placeholder": { color: "white" },
        }}
      />
  </Box>
  );
};

export default SearchBar;
