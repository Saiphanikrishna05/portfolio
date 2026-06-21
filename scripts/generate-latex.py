#!/usr/bin/env python3
"""
Reads src/data/resume.json and renders scripts/resume-template.tex
into resume.tex at the project root, ready for xelatex compilation.
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
RESUME_JSON = ROOT / "src" / "data" / "resume.json"
TEMPLATE    = ROOT / "scripts" / "resume-template.tex"
OUTPUT      = ROOT / "resume.tex"


def escape(text: str) -> str:
    """Escape special LaTeX characters."""
    replacements = [
        ("\\", r"\textbackslash{}"),
        ("&",  r"\&"),
        ("%",  r"\%"),
        ("$",  r"\$"),
        ("#",  r"\#"),
        ("_",  r"\_"),
        ("{",  r"\{"),
        ("}",  r"\}"),
        ("~",  r"\textasciitilde{}"),
        ("^",  r"\textasciicircum{}"),
    ]
    for char, rep in replacements:
        text = text.replace(char, rep)
    return text


def fmt_date(date_str: str) -> str:
    if not date_str:
        return "Present"
    parts = date_str.split("-")
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    if len(parts) >= 2:
        try:
            return f"{months[int(parts[1])-1]} {parts[0]}"
        except (ValueError, IndexError):
            pass
    return parts[0]


def build_education(education: list) -> str:
    blocks = []
    for edu in education:
        start = fmt_date(edu.get("startDate", ""))
        end   = fmt_date(edu.get("endDate",   ""))
        block = (
            f"\\textbf{{{escape(edu['studyType'])}, {escape(edu['area'])}}} "
            f"\\hfill {escape(start)} -- {escape(end)} \\\\\n"
            f"{escape(edu['institution'])}\n"
        )
        courses = edu.get("courses", [])
        if courses:
            block += "\\begin{itemize}\n"
            for c in courses[:5]:
                block += f"  \\item {escape(c)}\n"
            block += "\\end{itemize}\n"
        blocks.append(block)
    return "\n".join(blocks)


def build_work(work: list) -> str:
    blocks = []
    for job in work:
        start = fmt_date(job.get("startDate", ""))
        end   = fmt_date(job.get("endDate",   ""))
        block = (
            f"\\textbf{{{escape(job['position'])}}} \\hfill {escape(start)} -- {escape(end)} \\\\\n"
            f"\\textit{{{escape(job['name'])}}}\n"
        )
        highlights = job.get("highlights", [])
        if highlights:
            block += "\\begin{itemize}\n"
            for h in highlights:
                block += f"  \\item {escape(h)}\n"
            block += "\\end{itemize}\n"
        blocks.append(block)
    return "\n".join(blocks)


def build_skills(skills: list) -> str:
    lines = []
    for group in skills:
        kws = ", ".join(escape(k) for k in group.get("keywords", []))
        lines.append(f"  \\item[{escape(group['name'])}:] {kws}")
    return "\n".join(lines)


def main():
    if not RESUME_JSON.exists():
        print(f"ERROR: {RESUME_JSON} not found", file=sys.stderr)
        sys.exit(1)

    with open(RESUME_JSON) as f:
        resume = json.load(f)

    basics   = resume["basics"]
    github   = next((p for p in basics.get("profiles", []) if p["network"] == "GitHub"),   {})
    linkedin = next((p for p in basics.get("profiles", []) if p["network"] == "LinkedIn"), {})

    template = TEMPLATE.read_text(encoding="utf-8")

    replacements = {
        "CANDIDATE_NAME":         escape(basics.get("name",    "")),
        "CANDIDATE_LABEL":        escape(basics.get("label",   "")),
        "CANDIDATE_EMAIL":        basics.get("email", ""),
        "CANDIDATE_GITHUB_URL":   github.get("url",   "#"),
        "CANDIDATE_LINKEDIN_URL": linkedin.get("url", "#"),
        "CANDIDATE_CITY":         escape(basics.get("location", {}).get("city",   "")),
        "CANDIDATE_REGION":       escape(basics.get("location", {}).get("region", "")),
        "CANDIDATE_SUMMARY":      escape(basics.get("summary", "")),
        "EDUCATION_BLOCK":        build_education(resume.get("education", [])),
        "WORK_BLOCK":             build_work(resume.get("work", [])),
        "SKILLS_BLOCK":           build_skills(resume.get("skills", [])),
    }

    for key, value in replacements.items():
        template = template.replace(key, value)

    OUTPUT.write_text(template, encoding="utf-8")
    print(f"Generated {OUTPUT}")


if __name__ == "__main__":
    main()
