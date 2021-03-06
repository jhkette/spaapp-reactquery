import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "react-query";
import { Species } from "./Species";

const initialUrl = "https://swapi.dev/api/species/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // for infinitequery guide see https://react-query.tanstack.com/reference/useInfiniteQuery
  const {data, fetchNextPage, hasNextPage, isLoading, isError, error, isFetching } = useInfiniteQuery(
    "sw-species",
    ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.next || undefined,
    }
  )

  if(isLoading) return <div className="loading">Loading..</div>
  if(isError) return <div>Error </div>
  return (
     <>
    {isFetching && <div className="loading">Loading..</div>}
    <InfiniteScroll loadMore={fetchNextPage} hasMore={hasNextPage}>
      {data.pages.map((pageData) => {
        return pageData.results.map((animal) => {
          return (
            <Species
              key={animal.name}
              name={animal.name}
              language={animal.language}
              averageLifespan={animal.average_lifespan}
            />
          );
        });
      })}
    </InfiniteScroll>
  </>)
}
