# Data

| File | Description | Source (with link) | Licence | Date accessed |
|---|---|---|---|---|
| `colombo_2017.csv` | Weekly notified dengue cases, Colombo district, 2017 (52 weeks). This is the calibration data. | Weekly Epidemiological Reports, Epidemiology Unit, Ministry of Health, Sri Lanka ([epid.gov.lk](https://www.epid.gov.lk)), as compiled in the [denguedatahub](https://github.com/thiyangt/denguedatahub) R package v4.1.2 (dataset `srilanka_weekly_data`) | GPL-3 (denguedatahub) | 2026-11-13 |
| `colombo_weekly_dengue_2006_2026.csv` | Weekly notified dengue cases, Colombo district, from 2006 week 52 to 2026 week 37 (1,029 rows) | As above | GPL-3 (denguedatahub) | 2026-11-13 |

**Columns:**

- `year`, `week`: the year and week number as labelled in the source
- `start_date`, `end_date`: the first and last day of the week (`YYYY-MM-DD`)
- `cases`: the dengue cases notified that week

The counts are notified (suspected) cases, not all laboratory-confirmed, so they undercount true infections.

## How the files were made

`prepare_data.py` rebuilds both files from the denguedatahub repository, pinned at commit `6fd04ff` (8 November 2026). The script does three things:

1. It converts the `.rda` file to CSV and keeps only Colombo district.
2. It converts every date to `YYYY-MM-DD`. The source uses month/day/year up to 2026 week 20 and `YYYY-MM-DD` after that.
3. It sorts the rows by start date.

No case counts are changed. The total is 194,416 cases before and after.

## Known data-quality issues

### Suspicious weeks

Each of these weeks is either zero or below 30% of the median of the two weeks on each side. They are probably reporting gaps or extraction errors.

| Year | Week (reported cases) |
|---|---|
| 2009 | 51 (24) |
| 2011 | 36 (25), 44 (25) |
| 2012 | 18 (0), 19 (0), 24 (0), 29 (0), 45 (0) |
| 2013 | 25 (41) |
| 2016 | 14 (20) |
| 2021 | 30 (13), 40 (13), 43 (19) |
| 2022 | 28 (13), 34 (16), 44 (11), 47 (10), 52 (25) |
| 2026 | 14 (9), 24 (20), 37 (11) |

### Other issues

- **COVID-19 period:** the 2020 to 2022 counts are very low and erratic, so they should not be compared directly with other years.
- **Week start day:** weeks run Saturday to Friday up to 2025 and Monday to Sunday in 2026. 2009 weeks 18 to 22 start on a Sunday.
- **Mislabelled row:** the row labelled 2026 week 53 (20 to 26 December 2025) is really the last week of 2025. The two days of 27 and 28 December 2025 are not covered.
- **2023:** there are only 51 rows because 2024 week 1 starts on 23 December 2023. No week is missing.

## The 2017 calibration data

The 2017 data is 52 consecutive Saturday-to-Friday weeks, with no gaps, no zeros and no flagged weeks.

Week 15 (8 to 14 April, 332 cases) dips between 664 and 823. That week includes the Sinhala and Tamil New Year holiday, so the dip is probably a reporting delay. It is kept unchanged.

## Other inputs

The model uses N = 2,480,000, the official mid-year population estimate for Colombo district in 2017 from the Department of Census and Statistics ([mid-year population by district and sex, 2014–2024](https://www.statistics.gov.lk/Resource/en/Population/Vital_Statistics/Mid-year_population_by_district_and_sex_2014_2024.pdf)). For comparison, the census counted 2,324,349 people in 2012 and 2,374,461 in 2024 (provisional). Using a value interpolated between the two censuses instead changes the results by less than 0.5%.
