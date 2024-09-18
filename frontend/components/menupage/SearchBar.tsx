import { Input, Box, IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

const SearchBar = ({ onSearch }: { onSearch: (query: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const toggleSearchBar = () => {
    setShowSearch(!showSearch);
  };

  return (
    <Box display="flex" alignItems="center">
    <IconButton
      aria-label="Search menu"
      icon={<SearchIcon />}
      onClick={toggleSearchBar}
      mr={2}
      colorScheme="teal"
    />
    {showSearch && (
      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search dish by name"
        size="lg"
        bg="white"
        color="black"
        autoFocus
      />
    )}
  </Box>
  );
};

export default SearchBar;
