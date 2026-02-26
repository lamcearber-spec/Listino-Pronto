import json
import asyncio
from typing import Optional

from openai import AsyncAzureOpenAI

from app.core.config import settings
from app.schemas.catalog import ClassifyItem, ClassifyResult, ExtractedFeature

SYSTEM_PROMPT = """You are an Expert Italian Electrical Data Classifier with deep knowledge of ETIM 9.0.
Analyze the product description and select the SINGLE most accurate ETIM class from the candidates provided.
Extract all relevant technical features as key-value pairs mapping to ETIM feature codes.

Return ONLY valid JSON with this exact schema:
{
  "etim_class_code": "ECXXXXXX",
  "confidence_score": 0.0-1.0,
  "reasoning": "brief explanation",
  "extracted_features": [
    {"feature_code": "EF000227", "feature_name": "Rated current", "value": 16, "unit": "A"}
  ]
}"""


async def classify_single(
    client: AsyncAzureOpenAI,
    item: ClassifyItem,
    few_shot_examples: list[dict] | None = None,
    semaphore: asyncio.Semaphore | None = None,
) -> ClassifyResult:
    sem = semaphore or asyncio.Semaphore(5)
    async with sem:
        candidates_text = "\n".join(
            f"- {c.class_id}: {c.class_name}" for c in item.candidates
        )

        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        if few_shot_examples:
            for ex in few_shot_examples[:3]:
                messages.append({
                    "role": "user",
                    "content": f"Product: {ex['description']}\nCandidates:\n{ex.get('candidates_text', '')}",
                })
                messages.append({
                    "role": "assistant",
                    "content": json.dumps({
                        "etim_class_code": ex["etim_class_code"],
                        "confidence_score": 0.95,
                        "reasoning": "Based on verified correction",
                        "extracted_features": ex.get("features", []),
                    }),
                })

        messages.append({
            "role": "user",
            "content": f"Product description: {item.description}\n\nETIM Class Candidates:\n{candidates_text}",
        })

        try:
            response = await asyncio.wait_for(
                client.chat.completions.create(
                    model=settings.azure_openai_deployment,
                    messages=messages,
                    response_format={"type": "json_object"},
                    temperature=0.1,
                ),
                timeout=15.0,
            )

            content = response.choices[0].message.content or "{}"
            parsed = json.loads(content)

            features = []
            for f in parsed.get("extracted_features", []):
                features.append(ExtractedFeature(
                    feature_code=f.get("feature_code", ""),
                    feature_name=f.get("feature_name", ""),
                    value=f.get("value", ""),
                    unit=f.get("unit"),
                ))

            return ClassifyResult(
                etim_class_code=parsed.get("etim_class_code", "UNKNOWN"),
                etim_class_name=parsed.get("etim_class_code", ""),
                confidence_score=min(1.0, max(0.0, parsed.get("confidence_score", 0.5))),
                reasoning=parsed.get("reasoning", ""),
                extracted_features=features,
            )

        except (asyncio.TimeoutError, Exception) as e:
            return ClassifyResult(
                etim_class_code="UNKNOWN",
                confidence_score=0.0,
                reasoning=f"Classification failed: {str(e)}",
                extracted_features=[],
            )


async def classify_batch(
    items: list[ClassifyItem],
    few_shot_examples: list[dict] | None = None,
) -> list[ClassifyResult]:
    client = AsyncAzureOpenAI(
        api_key=settings.azure_openai_api_key,
        azure_endpoint=settings.azure_openai_endpoint,
        api_version=settings.azure_openai_api_version,
    )
    semaphore = asyncio.Semaphore(5)

    tasks = [
        classify_single(client, item, few_shot_examples, semaphore)
        for item in items
    ]
    return await asyncio.gather(*tasks)
