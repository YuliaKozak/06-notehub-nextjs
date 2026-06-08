// app/notes/page.tsx

//const response = await getNotes();

//return (
//<section>
//<h1>Notes List</h1>
//{response?.notes?.length > 0 && <NoteList notes={response.notes} />}
//</section>

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import Modal from "../../src/components/Modal/Modal";
import NoteForm from "../../src/components/NoteForm/NoteForm";
import NoteList from "../../src/components/NoteList/NoteList";
import Pagination from "../../src/components/Pagination/Pagination";
import SearchBox from "../../src/components/SearchBox/SearchBox";
import { fetchNotes } from "../../src/lib/api";
//import { getNotes } from "@/src/lib/api";
//import { type Note } from "..//../types/note";

import css from "./App.module.css";

function Notes() {
  const [page, setPage] = useState<number>(1);

  const [search, setSearch] = useState<string>("");

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    // queryKey — це унікальний ідентифікатор запиту.
    // Щоразу, коли змінюються page або search, TanStack Query автоматично перезапустить запит!
    queryKey: ["notes", page, search],
    // queryFn — функція, яка безпосередньо робить запит через Axios
    queryFn: () => fetchNotes(page, search),
    placeholderData: keepPreviousData,
  });

  // Масив нотаток беремо з data (залежно від того, як сервер повертає: data.notes чи просто data)

  const totalPages = data?.totalPages || 1;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={debouncedSetSearch} />

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </header>

        <main>
          {isLoading && <p>Loading notes...</p>}
          {isError && <p>Something went wrong...</p>}
          {data?.notes && data.notes.length > 0 && (
            <NoteList notes={data.notes} />
          )}
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
}

export default Notes;
