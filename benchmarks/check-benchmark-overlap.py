import json
import re
import sys
import unicodedata
from difflib import SequenceMatcher

def normalize(text):
    text = unicodedata.normalize("NFKD", text.lower())
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return " ".join(text.split())

def tokens(text):
    stop = {"je","j","de","du","des","la","le","les","un","une","et","a","au","aux","en","dans","pour","avec","mon","ma","mes","que","qui","sur","plus","mieux","voudrais","souhaite","cherche","dois"}
    return {w for w in normalize(text).split() if len(w) > 2 and w not in stop}

def score(a, b):
    na, nb = normalize(a), normalize(b)
    ta, tb = tokens(a), tokens(b)
    union = ta | tb
    jaccard = len(ta & tb) / len(union) if union else 0
    sequence = SequenceMatcher(None, na, nb).ratio()
    return jaccard, sequence

if len(sys.argv) != 3:
    print("Usage: python benchmarks/check-benchmark-overlap.py NOUVEAU.json CONSOMME.json")
    raise SystemExit(2)

new = json.load(open(sys.argv[1], encoding="utf-8"))["cases"]
old = json.load(open(sys.argv[2], encoding="utf-8"))["cases"]

results = []
for case in new:
    best = None
    for previous in old:
        j, s = score(case["query"], previous["query"])
        candidate = (max(j, s), j, s, previous)
        if best is None or candidate[0] > best[0]:
            best = candidate
    results.append((best[0], case, best[1], best[2], best[3]))

results.sort(reverse=True, key=lambda x: x[0])

print("===== PROXIMITES LES PLUS FORTES =====")
for _, case, j, s, previous in results[:20]:
    flag = "A VERIFIER" if j >= 0.45 or s >= 0.72 else "OK"
    print(f"{flag} | {case['id']} <-> {previous['id']} | Jaccard={j:.2f} | Sequence={s:.2f}")
    print("  Nouveau :", case["query"])
    print("  Ancien  :", previous["query"])
