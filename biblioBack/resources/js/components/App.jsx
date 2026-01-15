import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchBooks() {
            try {
                setLoading(true);
                const response = await axios.get("/api/books");
                setBooks(response.data);
            } catch (err) {
                setError("Impossible de charger la liste des livres.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div
            className="min-h-screen text-[#1b1b18] flex flex-col items-center p-6 relative"
            style={{
                backgroundImage: 'url("/images/votre_image.jpeg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Overlay sombre pour améliorer la lisibilité */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* Contenu */}
            <div className="relative z-10 w-full">
                <header className="w-full max-w-5xl mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-white drop-shadow-lg">
                        Biblio - Gestion de bibliothèque
                    </h1>
                    <span className="text-sm text-white/90 drop-shadow">
                        Frontend React connecté à Laravel
                    </span>
                </header>

                <main className="w-full max-w-5xl bg-white/95 backdrop-blur-sm shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] border border-[#e3e3e0] rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-4">
                        Liste des livres
                    </h2>

                    {loading && <p>Chargement des livres...</p>}
                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && !error && books.length === 0 && (
                        <p>
                            Aucun livre trouvé. Ajoutez des livres via le
                            backend.
                        </p>
                    )}

                    {!loading && !error && books.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#f9fafb]">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium border-b">
                                            ID
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium border-b">
                                            Titre
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium border-b">
                                            Auteur
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium border-b">
                                            Catégorie
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map((book) => (
                                        <tr
                                            key={book.id}
                                            className="border-b last:border-b-0 hover:bg-[#f9fafb]"
                                        >
                                            <td className="px-4 py-2">
                                                {book.id}
                                            </td>
                                            <td className="px-4 py-2">
                                                {book.title ??
                                                    book.titre ??
                                                    "—"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {book.author?.name ??
                                                    book.author_name ??
                                                    book.auteur ??
                                                    "—"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {book.category?.name ??
                                                    book.category_name ??
                                                    book.categorie ??
                                                    "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App;
