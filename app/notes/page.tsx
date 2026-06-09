// app/notes/page.tsx
import NotesClient from "./Notes.client";

export const metadata = {
  title: "My Notes | NoteHub",
  description: "Manage your personal notes here.",
};

export default function NotesPage() {
  return <NotesClient />;
}
