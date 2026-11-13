import { notFound } from "next/navigation";
import { books, getBook } from "@/lib/books";
import { Reader } from "@/components/reader";

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBook(slug);

  if (!book) notFound();

  return <Reader book={book} />;
}
