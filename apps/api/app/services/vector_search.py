import chromadb

from app.core.config import settings


def get_chroma_client() -> chromadb.ClientAPI:
    return chromadb.PersistentClient(
        path=settings.chroma_path,
    )


def get_etim_collection(client: chromadb.ClientAPI):
    return client.get_or_create_collection(
        name="etim_classes",
        metadata={"hnsw:space": "cosine"},
    )


async def search_etim_classes(
    descriptions: list[str],
    n_results: int = 5,
) -> list[dict]:
    client = get_chroma_client()
    collection = get_etim_collection(client)

    results = []
    for desc in descriptions:
        query_result = collection.query(
            query_texts=[desc],
            n_results=n_results,
        )

        candidates = []
        if query_result["ids"] and query_result["ids"][0]:
            for i, doc_id in enumerate(query_result["ids"][0]):
                meta = query_result["metadatas"][0][i] if query_result["metadatas"] else {}
                distance = query_result["distances"][0][i] if query_result["distances"] else 1.0
                score = max(0.0, 1.0 - distance)
                candidates.append({
                    "class_id": meta.get("class_id", doc_id),
                    "class_name": meta.get("class_name", ""),
                    "score": round(score, 4),
                })

        results.append({
            "description": desc,
            "candidates": candidates,
        })

    return results
