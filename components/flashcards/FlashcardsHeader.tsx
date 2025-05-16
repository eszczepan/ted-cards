interface FlashcardsHeaderProps {
  totalFlashcards?: number;
}

export default function FlashcardsHeader({ totalFlashcards = 0 }: FlashcardsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">My Flashcards</h1>
      {totalFlashcards > 0 && <p className="text-gray-500 mt-2">Total flashcards: {totalFlashcards}</p>}
    </div>
  );
}
