#!/usr/bin/env python3
"""Seed ETIM taxonomy into ChromaDB for vector search."""

import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import chromadb


def seed_etim(taxonomy_path: str, chroma_path: str = "./chroma_data"):
    with open(taxonomy_path, "r", encoding="utf-8") as f:
        taxonomy = json.load(f)

    client = chromadb.PersistentClient(
        path=chroma_path,
    )

    collection = client.get_or_create_collection(
        name="etim_classes",
        metadata={"hnsw:space": "cosine"},
    )

    ids = []
    documents = []
    metadatas = []

    for cls in taxonomy:
        class_id = cls["class_id"]
        class_name = cls["class_name"]
        synonyms_it = " ".join(cls.get("synonyms_it", []))
        synonyms_en = " ".join(cls.get("synonyms_en", []))
        features_text = " ".join(f.get("name", "") for f in cls.get("features", []))

        doc = f"{class_id} {class_name} {synonyms_it} {synonyms_en} {features_text}"

        ids.append(class_id)
        documents.append(doc)
        metadatas.append({
            "class_id": class_id,
            "class_name": class_name,
        })

    collection.upsert(
        ids=ids,
        documents=documents,
        metadatas=metadatas,
    )

    print(f"Seeded {len(ids)} ETIM classes into ChromaDB at {chroma_path}")


if __name__ == "__main__":
    taxonomy_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "app", "data", "etim-taxonomy-sample.json"
    )
    seed_etim(taxonomy_file)
