"""Rebuild the Colombo dengue CSV files from the denguedatahub dataset.

Usage:
    pip install pyreadr pandas
    python prepare_data.py

The script downloads srilanka_weekly_data.rda from the denguedatahub
repository, pinned to a fixed commit so the result never changes. It keeps
Colombo district, converts every date to YYYY-MM-DD and writes two CSV files
next to this script. Case counts are not changed.
"""

import pathlib
import tempfile
import urllib.request

import pandas as pd
import pyreadr

COMMIT = "6fd04ff513a5586b2338d02af759e06e3aa771d2"
URL = (
    "https://raw.githubusercontent.com/thiyangt/denguedatahub/"
    f"{COMMIT}/data/srilanka_weekly_data.rda"
)
OUT_DIR = pathlib.Path(__file__).resolve().parent


def main() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        rda_path = pathlib.Path(tmp) / "srilanka_weekly_data.rda"
        urllib.request.urlretrieve(URL, rda_path)
        raw = next(iter(pyreadr.read_r(str(rda_path)).values()))

    colombo = raw[raw["district"] == "Colombo"].copy()

    # The source mixes month/day/year and YYYY-MM-DD dates; normalise both.
    for src, dst in (("start.date", "start_date"), ("end.date", "end_date")):
        colombo[dst] = pd.to_datetime(colombo[src], format="mixed").dt.strftime("%Y-%m-%d")

    colombo = (
        colombo[["year", "week", "start_date", "end_date", "cases"]]
        .astype({"year": int, "week": int, "cases": int})
        .sort_values("start_date")
        .reset_index(drop=True)
    )

    # Case counts must be untouched by the processing.
    assert colombo["cases"].sum() == raw.loc[raw["district"] == "Colombo", "cases"].sum()

    colombo.to_csv(OUT_DIR / "colombo_weekly_dengue_2006_2026.csv", index=False)
    colombo[colombo["year"] == 2017].to_csv(OUT_DIR / "colombo_2017.csv", index=False)
    print(f"Wrote {len(colombo)} Colombo weeks; 2017 has {(colombo['year'] == 2017).sum()} weeks.")


if __name__ == "__main__":
    main()
