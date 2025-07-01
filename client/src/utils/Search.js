import { useState } from "react";
function Search({ setcandidateFilter }) {
   const [query,setQuery] = useState("");
  const handleSearchReset = () => {
      setQuery("");
      setcandidateFilter("");
      console.log("Search reset");
    }
   const  handleSearch = () => {
      setcandidateFilter(query);
      console.log("Search query:", query);
    }

  return (
    <div className="d-flex gap-2 mt-4">
      <div>
        <input
          type="text"
          placeholder="Search Using Name ..."
          className="form-control"
          style={{ width: "300px", margin: " auto" }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
           
          }}
          
        />
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => {
            handleSearchReset();
          }}
        >
          reset
        </button>
      </div>
    </div>
  );
}

export default Search;
