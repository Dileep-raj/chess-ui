import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Hello Chess!</h1>
      <div>
        <Link href={"/board"}>
          <button className="my-1 p-1 px-2 bg-gray-800 rounded-sm">
            Open board
          </button>
        </Link>
      </div>
    </main>
  );
}
