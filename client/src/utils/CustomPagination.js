import { Stack, Pagination, PaginationItem } from "@mui/material";

const CustomPagination = ({
  totalProfiles,
  profilesPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const pageCount = Math.ceil(totalProfiles / profilesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Stack
      spacing={1}
      sx={{
        marginTop: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pagination
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        showFirstButton
        showLastButton
        hidePrevButton={false}
        hideNextButton={false}
        siblingCount={0}
        boundaryCount={0}
        renderItem={(item) => {
          // Always show Previous and Next buttons
          if (item.type === "previous" || item.type === "next") {
            return <PaginationItem {...item} />;
          }

          // Only show the current page number
          if (item.type === "page" && item.page === currentPage) {
            return <PaginationItem {...item} />;
          }

          // Hide other page numbers
          return null;
        }}
      />
    </Stack>
  );
};

export default CustomPagination;