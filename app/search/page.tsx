import React from "react";
import SearchResultsClient from "./SearchResultsClient";

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  return <SearchResultsClient initialQuery={q} />;
}
