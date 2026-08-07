#!/usr/bin/env python3
"""
Ribbit Image Pipeline — Step 1: extract prompts from the spreadsheet.

Reads "Images to Use.xlsx" and writes prompts.json:
  [{ level, title, prompt, steps: [{ n, text }] }, ...]

Usage:  python3 extract-prompts.py [path/to/Images to Use.xlsx]
"""
import json, sys, os
import openpyxl

DEFAULT_XLSX = os.path.expanduser(
    "~/Documents/Claude/Projects/Penguin English Studio/Images to Use.xlsx")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prompts.json")


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_XLSX
    if not os.path.exists(path):
        sys.exit(f"Spreadsheet not found: {path}")

    ws = openpyxl.load_workbook(path, read_only=True)["Images to Use"]
    rows = list(ws.iter_rows(values_only=True))[1:]  # drop header

    stories, level, story = [], None, None
    for level_cell, title_cell, step_n, text, _img, prompt in rows:
        if level_cell:
            level = str(level_cell).strip()
        if title_cell:
            story = {
                "level": level,
                "title": str(title_cell).strip(),
                "prompt": (prompt or "").strip(),
                "steps": [],
            }
            stories.append(story)
        if story is None or text is None:
            continue
        story["steps"].append({"n": int(step_n), "text": str(text).strip()})

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(stories, f, ensure_ascii=False, indent=1)

    total_steps = sum(len(s["steps"]) for s in stories)
    missing = [s["title"] for s in stories if not s["prompt"]]
    print(f"Wrote {OUT}")
    print(f"  stories: {len(stories)}   steps: {total_steps}")
    if missing:
        print(f"  WARNING — {len(missing)} stories have no prompt: {missing[:5]}")


if __name__ == "__main__":
    main()
