from app.services.finbert_service import FinBertService

prompts = [
    "Should I increase my SIP if markets are volatile?",
    "Is now a good time to invest in banking sector stocks?",
    "I’m worried about declining revenue this quarter.",
    "How can I reduce my tax outgo this financial year?",
    "What’s the outlook on gold for the next six months?",
    "My cash flow looks weak; what should I prioritize?",
    "Are ELSS funds a better option than PPF for me?",
    "Our margins improved and the new product is doing well.",
    "I’m uncertain about raising fresh debt for expansion.",
    "Will rate cuts boost equity markets in the near term?",
]


def main():
    svc = FinBertService()
    if not svc.available():
        print("FinBERT not available. Ensure transformers/torch installed and internet on first run.")
        return

    for q in prompts:
        res = svc.analyze(q)
        if res is None:
            print(f"[n/a]  - \"{q}\"")
            continue
        label = res.get("label", "n/a")
        score = res.get("score", 0.0)
        print(f"[{label}] {score:.2f} - \"{q}\"")


if __name__ == "__main__":
    main()
