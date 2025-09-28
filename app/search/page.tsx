import React from "react";
import SearchResultsClient from "./SearchResultsClient";

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  return <SearchResultsClient initialQuery={q} />;
}
