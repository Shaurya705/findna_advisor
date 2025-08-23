# FinBERT 10-Question Sentiment Test

This quick test runs 10 finance-related prompts through FinBERT and prints the predicted sentiment (positive/neutral/negative) with confidence scores. It uses the wrapper in `app/services/finbert_service.py`.

## Prerequisites
- Python 3.10+
- pip
- Internet access on first run (to download model weights)

`transformers` and `torch` are already pinned in `backend/requirements.txt`.

## Setup (Windows PowerShell)
```powershell
cd "c:\\Users\\Lenovo\\Desktop\\sunhacks\\findna_advisor\\backend"
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

Notes:
- First run downloads model weights to your Hugging Face cache (e.g., `%USERPROFILE%\\.cache\\huggingface`).
- CPU is fine; GPU is optional if your PyTorch install supports CUDA.

## Run the 10-question test
Option A: Module mode (recommended)
```powershell
cd "c:\\Users\\Lenovo\\Desktop\\sunhacks\\findna_advisor\\backend"
.\\.venv\\Scripts\\Activate.ps1
python -m app.tests.finbert_10q_test
```

Option B: Direct file execution (if PYTHONPATH includes `backend`)
```powershell
python app\\tests\\finbert_10q_test.py
```

## Expected output
For each prompt, a line like:
```
[positive] 0.87 - "Should I increase my SIP if markets are volatile?"
```
Where the label is the predicted sentiment and the number is the confidence (softmax probability).

## The 10 finance prompts
1. Should I increase my SIP if markets are volatile?
2. Is now a good time to invest in banking sector stocks?
3. I’m worried about declining revenue this quarter.
4. How can I reduce my tax outgo this financial year?
5. What’s the outlook on gold for the next six months?
6. My cash flow looks weak; what should I prioritize?
7. Are ELSS funds a better option than PPF for me?
8. Our margins improved and the new product is doing well.
9. I’m uncertain about raising fresh debt for expansion.
10. Will rate cuts boost equity markets in the near term?

## Troubleshooting
- If `transformers`/`torch` import errors occur, ensure the venv is active and installation succeeded.
- Slow first run is normal due to model download.
- For CUDA/GPU, install the appropriate PyTorch build from pytorch.org; otherwise CPU will be used.

## Next steps
- Surface FinBERT sentiment in chat replies (already attached to `relevant_data.sentiment`).
- Use sentiments to route concern/negative queries to specific advice flows.
