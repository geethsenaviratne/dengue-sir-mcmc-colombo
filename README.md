# When should mosquito control start? A dengue SIR model for Colombo, calibrated with MCMC

An SIR epidemic model, fitted to Colombo's 2017 dengue epidemic with a Metropolis MCMC sampler, that estimates how much lower and later the epidemic peak would have been if mosquito control had cut transmission earlier.

**[Live demo](https://geethsenaviratne.github.io/dengue-sir-mcmc-colombo/)** · [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/geethsenaviratne/dengue-sir-mcmc-colombo/blob/main/notebook/dengue-sir-mcmc-colombo.ipynb)

![Screenshot of the web demo](figures/demo-screenshot.png)

## The problem

In 2017, Colombo district had its largest dengue epidemic in the weekly records that begin in 2007. Reported cases rose from a few hundred a week early in the year to 1,972 in the week beginning 15 July. They then collapsed to below 300 a week by September. Mosquito-control campaigns are often launched once cases are already rising, so the timing of control is a decision health authorities face every dengue season.

This project asks one question: **if mosquito control had cut transmission by 20%, starting a given number of weeks before the peak, how much lower and later would the 2017 peak have been?** The answer is given with 95% credible intervals, so the uncertainty in the fitted model is carried through to the result.

## Quick start

**Notebook:** click the *Open in Colab* badge above, then *Runtime → Run all*. Everything installs and runs in about [N] minutes on a free runtime.

**Web demo:** open the [live demo](https://geethsenaviratne.github.io/dengue-sir-mcmc-colombo/), or download this repository and double-click `docs/index.html`.

**Run locally (optional):**

```bash
pip install -r requirements.txt
jupyter notebook notebook/dengue-sir-mcmc-colombo.ipynb
```

## Using the demo

[Two or three sentences on the main controls and outputs.] Full guide: [USER_GUIDE.md](USER_GUIDE.md).

## Model and mathematics

[Short summary of the SIR model with time-varying transmission, the RK4 integrator and the Metropolis sampler.] Full derivations, assumptions and parameters: [THEORY.md](THEORY.md).

## Verification

[The checks run and their results: recovery of known parameters from synthetic data, conservation of S + I + R, and the fourth-order convergence of RK4.]

![Verification plot](figures/verification.png)

## Concepts applied

This project applies compartmental (SIR) epidemic modelling and fourth-order Runge–Kutta integration of ordinary differential equations, with the solver's convergence order measured. It applies Bayesian calibration with a random-walk Metropolis Markov chain Monte Carlo sampler, and Monte Carlo posterior predictive simulation to put credible intervals on every scenario result. The solver is verified by a conservation check and a convergence-order test, and the calibration by recovering known parameters from synthetic data.

## Results

[The answer to the question, with the key figure or table.]

## Limitations and future work

- [Most important assumption and how it limits the result]
- [What you would add with more time or data]

## Key references

1. [Author, "Title," *Venue*, year. DOI/URL]
2. [...]

Full list: [REFERENCES.md](REFERENCES.md).

## AI assistance

Developed with the help of AI coding and writing assistants. All code was reviewed, run and verified by the author.

## Licence and credits

Code: [MIT](LICENSE). Data: weekly notified dengue cases from the Weekly Epidemiological Reports of the Epidemiology Unit, Ministry of Health, Sri Lanka, as compiled in the [denguedatahub](https://github.com/thiyangt/denguedatahub) R package by T. S. Talagala (GPL-3). See [data/README.md](data/README.md).
