import { Box, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";

interface MultiSelectBarProps {
  selectedCategories: string[];
  onRemoveCategory: (category: string) => void;
}

const MultiSelectBar = ({ selectedCategories, onRemoveCategory }: MultiSelectBarProps) => {
  return (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {selectedCategories.length > 0 &&
        selectedCategories.map((category) => (
          <Tag
            key={category}
            size="lg"
            borderRadius="full"
            variant="solid"
            bg="yellow.400"
            textColor="green.700"
            px={1}
            py={1}
            fontWeight="bold"
            display="flex"
            alignItems="center"
          >
            <TagLabel>{category}</TagLabel>
            <TagCloseButton onClick={() => onRemoveCategory(category)} />
          </Tag>
        ))}
    </Box>
  );
};

export default MultiSelectBar;
