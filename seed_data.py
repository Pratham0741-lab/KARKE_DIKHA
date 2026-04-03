"""
One-time data seeder for FinQuest.
Reads clean_finquest.csv, maps correct_option text to letter (A/B/C/D),
structures data into 2 stages x 5 levels, inserts via REST API.
"""
import csv
import json
import urllib.request
import urllib.error
from collections import Counter

SUPABASE_URL = "https://vgarnqvzlrijgwzeipej.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYXJucXZ6bHJpamd3emVpcGVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTg3MDEsImV4cCI6MjA5MDczNDcwMX0.s30wH2Lq8l_FDScmGlo3ctd5_yEo8OhhUKZ3ZkJnM6o"


def text_to_letter(row):
    """Map correct_option text to A/B/C/D by matching against options."""
    correct = row["correct_option"].strip()
    options = {
        "A": row["option_a"].strip(),
        "B": row["option_b"].strip(),
        "C": row["option_c"].strip(),
        "D": row["option_d"].strip(),
    }
    for letter, text in options.items():
        if text == correct:
            return letter
    # Fuzzy: check if correct_option starts with or is contained in option
    for letter, text in options.items():
        if correct in text or text in correct:
            return letter
    # Default fallback
    print(f"  WARNING: Could not match correct_option: {correct[:60]}...")
    return "A"


with open("dataset/clean_finquest.csv", "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    rows = list(reader)

stage1 = [r for r in rows if r["stage"] == "1"]
others = [r for r in rows if r["stage"] != "1"]

output = []

for r in stage1:
    level = int(float(r["level"]))
    qo = int(float(r["question_order"])) if r.get("question_order") and r["question_order"].strip() else None
    output.append({
        "stage": 1, "topic": r["topic"], "level": level,
        "question": r["Question"],
        "option_a": r["option_a"], "option_b": r["option_b"],
        "option_c": r["option_c"], "option_d": r["option_d"],
        "correct_option": text_to_letter(r),
        "explanation": r["Explanation"],
        "question_type": r["question_type"],
        "question_order": qo,
    })

core2 = [r for r in others if r["question_type"] == "core"][:25]
rl2 = [r for r in others if r["question_type"] == "reinforcement"][:15]

for i, r in enumerate(core2):
    output.append({
        "stage": 2, "topic": r.get("topic") or "Advanced Finance",
        "level": (i // 5) + 1,
        "question": r["Question"],
        "option_a": r["option_a"], "option_b": r["option_b"],
        "option_c": r["option_c"], "option_d": r["option_d"],
        "correct_option": text_to_letter(r),
        "explanation": r["Explanation"],
        "question_type": "core", "question_order": (i % 5) + 1,
    })

for i, r in enumerate(rl2):
    output.append({
        "stage": 2, "topic": r.get("topic") or "Advanced Finance",
        "level": (i // 3) + 1,
        "question": r["Question"],
        "option_a": r["option_a"], "option_b": r["option_b"],
        "option_c": r["option_c"], "option_d": r["option_d"],
        "correct_option": text_to_letter(r),
        "explanation": r["Explanation"],
        "question_type": "reinforcement", "question_order": (i % 3) + 1,
    })

# Verify
counts = Counter()
for r in output:
    counts[(r["stage"], r["level"], r["question_type"])] += 1
print(f"Total: {len(output)} rows")
for k in sorted(counts.keys()):
    print(f"  Stage {k[0]} Level {k[1]} {k[2]}: {counts[k]}")

# Check correct_option values
co_vals = set(r["correct_option"] for r in output)
print(f"correct_option values: {co_vals}")

# Insert via REST API
url = f"{SUPABASE_URL}/rest/v1/questions"
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

success = 0
fail = 0
for i, row in enumerate(output):
    body = json.dumps(row).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        urllib.request.urlopen(req)
        success += 1
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        if fail < 3:
            print(f"  FAIL row {i}: {e.code} {err[:200]}")
        fail += 1

print(f"\nResult: {success} inserted, {fail} failed out of {len(output)}")
if fail > 0 and success == 0:
    print("\nRLS is blocking inserts. Please do ONE of these:")
    print("  1. Go to Supabase Dashboard -> SQL Editor -> paste and run:")
    print("     ALTER TABLE questions DISABLE ROW LEVEL SECURITY;")
    print("  2. Then re-run this script")
    print("  3. After seeding, re-enable: ALTER TABLE questions ENABLE ROW LEVEL SECURITY;")
